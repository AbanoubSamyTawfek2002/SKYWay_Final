import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './models.js';
import { sendOTP } from './services/emailService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'skyway-secret-key-123';

// Extend Express Request type
interface AuthRequest extends Request {
  user?: any;
}

// Middleware to verify JWT
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware for RBAC
export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: 'User already exists' });
      }
      // If user exists but not verified, update and send new OTP
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
      await existingUser.save();
      await sendOTP(email, otp);
      return res.json({ message: 'OTP sent to email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000)
    });
    await user.save();
    await sendOTP(email, otp);

    res.status(201).json({ message: 'OTP sent to email. Please verify your account.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp, otpExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first.' });
    }

    if (!user.password && user.googleId) {
      return res.status(400).json({ message: 'This account is linked with Google. Please use Google Login.' });
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login URL constructed on server
router.get('/google/url', (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);
  res.json({ url: `${rootUrl}?${qs.toString()}` });
});

// Google Callback
router.get('/google/callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send('No code provided');

  try {
    // Exchange code for tokens
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const values = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    };

    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      body: new URLSearchParams(values),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { id_token, access_token } = await tokenRes.json();

    // Get user info
    const userRes = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
      headers: { Authorization: `Bearer ${id_token}` },
    });
    const googleUser = await userRes.json();

    // Upsert user in MongoDB
    let user = await User.findOne({ email: googleUser.email });
    if (!user) {
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.id,
        isVerified: true, // Google accounts are verified
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleUser.id;
      user.isVerified = true;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.send(`
      <html>
        <body>
          <script>
            const data = ${JSON.stringify({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })};
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', payload: data }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. Redirecting...</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).send('Authentication failed');
  }
});

export default router;
