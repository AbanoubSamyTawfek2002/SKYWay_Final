import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import validator from "validator";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// توليد Token للجلسة
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// توليد OTP مكون من 6 أرقام
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// --- تسجيل مستخدم جديد ---
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, location } = req.body;

  // 1. التحقق من الحقول الأساسية
  if (!name || !email || !password || !location) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  // 2. التحقق من صحة الإيميل
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // 3. التحقق من طول كلمة المرور
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  // 4. التأكد إن الإيميل مش مسجل قبل كدة
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // 5. تشفير كلمة المرور (Security Best Practice)
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // صلاحية 5 دقائق

  // 6. إنشاء الحساب (غير مفعل مؤقتاً)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    location,
    otp,
    otpExpires,
    isVerified: false,
  });

  if (user) {
    try {
      // 7. محاولة إرسال الإيميل
      const message = `Your SkyWay verification code is: ${otp}\n\nIt expires in 5 minutes.`;
      await sendEmail({ email, subject: "SkyWay - Verify Account", message });

      res.status(201).json({
        message: "User registered. Please check email for OTP.",
        email: user.email,
      });
    } catch (err) {
      // لو الإيميل متبعتش، بنمسح اليوزر عشان يقدر يحاول تاني بنفس الميل
      await User.findByIdAndDelete(user._id);
      console.error("Email failed, user cleaned up:", err);
      res.status(500).json({
        message: "Error sending verification email. Please try again.",
      });
    }
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// --- تفعيل الحساب بالـ OTP ---
export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: "User already verified" });
  }

  // التأكد إن الـ OTP صحيحة ولم تنتهِ صلاحيتها
  if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
    },
    token: generateToken(user._id.toString()),
  });
};

// --- تسجيل الدخول ---
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: any = await User.findOne({ email });

  // مقارنة الباسوورد المشفرة
  if (user && (await user.comparePassword(password))) {
    if (!user.isVerified) {
      return res.status(401).json({
        message: "Please verify your email address first",
        needsVerification: true,
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        profileImage: user.profileImage,
      },
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        phone: user.phone,
        dob: user.dob,
        address: user.address,
        profileImage: user.profileImage,
      },
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const updateUserProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.dob = req.body.dob || user.dob;
    user.address = req.body.address || user.address;
    user.location = req.body.location || user.location;
    user.profileImage = req.body.profileImage || user.profileImage;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        location: updatedUser.location,
        phone: updatedUser.phone,
        dob: updatedUser.dob,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
      },
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// Rate limiting map for forgot password
const forgotPasswordLimits = new Map<
  string,
  { count: number; firstRequestTime: number }
>();

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please provide an email" });
  }

  // Rate limiting check
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  let userLimit = forgotPasswordLimits.get(email);

  if (userLimit) {
    if (now - userLimit.firstRequestTime < ONE_HOUR) {
      if (userLimit.count >= 3) {
        return res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
      }
      userLimit.count++;
    } else {
      userLimit = { count: 1, firstRequestTime: now };
    }
  } else {
    userLimit = { count: 1, firstRequestTime: now };
  }
  forgotPasswordLimits.set(email, userLimit);

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ message: "No account found with this email" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(now + 10 * 60 * 1000); // 10 minutes

  user.otpCode = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  try {
    const plainMessage = `Your SkyWay Travel password reset code is: ${otp}. It expires in 10 minutes. If you didn't request this, please ignore this email.`;
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; 
                  margin: 0 auto; background: #0a0a0a; color: #ffffff; 
                  padding: 40px; border-radius: 12px;">
        
        <h1 style="color: #0ea5e9; font-size: 28px; margin-bottom: 8px;">
          ✈️ SkyWay Travel
        </h1>
        
        <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 24px;">
          Password Reset Request
        </h2>
        
        <p style="color: #aaaaaa; font-size: 16px; margin-bottom: 16px;">
          You requested to reset your password. Use the verification code below:
        </p>
        
        <div style="background: #1a1a2e; border: 2px solid #0ea5e9; 
                    border-radius: 12px; padding: 24px; text-align: center; 
                    margin: 24px 0;">
          <p style="color: #aaaaaa; font-size: 14px; margin-bottom: 8px;">
            YOUR VERIFICATION CODE
          </p>
          <p style="font-size: 42px; font-weight: bold; letter-spacing: 10px; 
                    color: #0ea5e9; margin: 0;">
            ${otp}
          </p>
        </div>
        
        <p style="color: #ff6b6b; font-size: 14px; margin-bottom: 8px;">
          ⏰ This code expires in <strong>10 minutes</strong>
        </p>
        
        <p style="color: #666666; font-size: 13px; margin-top: 32px; 
                  border-top: 1px solid #333; padding-top: 16px;">
          If you didn't request this, please ignore this email. 
          Your password will remain unchanged.
        </p>
        
      </div>
    `;
    await sendEmail({
      email,
      subject: "SkyWay Travel — Your Password Reset Code",
      message: plainMessage,
      html: htmlMessage,
    });
  } catch (err) {
    console.error("Email could not be sent", err);
    user.otpCode = null as any;
    user.otpExpiry = null as any;
    await user.save();
    return res.status(500).json({ message: "Email could not be sent" });
  }

  res.status(200).json({ message: "OTP sent to your email" });
};

export const verifyForgotPasswordOTP = async (req: Request, res: Response) => {
  const { email, otpCode } = req.body;

  if (!email || !otpCode) {
    return res
      .status(400)
      .json({ message: "Please provide email and OTP code" });
  }

  const user = await User.findOne({ email });

  if (
    !user ||
    user.otpCode !== otpCode ||
    !user.otpExpiry ||
    user.otpExpiry.getTime() < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otpCode = null as any;
  user.otpExpiry = null as any;

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await user.save();

  res.status(200).json({ resetToken });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res
      .status(400)
      .json({ message: "Please provide reset token and new password" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  // 1. Find user by valid, non-expired reset token
  const user = await User.findOne({
    resetToken: resetToken,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({
      message: "Reset token is invalid or has expired",
    });
  }

  // 2. Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  console.log("Updating password for user:", user._id);

  // 3. Update using findOneAndUpdate to guarantee DB write
  await User.findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        password: hashedPassword,
        isVerified: true,
        resetToken: null,
        resetTokenExpiry: null,
        otpCode: null,
        otpExpiry: null,
      },
    },
    { new: true },
  );

  console.log("Password update complete");

  return res.status(200).json({
    message: "Password updated successfully",
  });
};
