import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Mail, Lock, User as UserIcon, CheckCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaVerified) {
      setError("Please verify you're not a robot.");
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, location })
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2); // Move to OTP step
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.message);
        setOtp(''); // Clear OTP on failure
      }
    } catch (err) {
      setError('An error occurred during verification');
      setOtp(''); // Clear OTP on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl transition-all hover:shadow-primary/5">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {step === 1 ? <UserIcon className="text-primary" size={24} /> : <ShieldCheck className="text-primary" size={24} />}
          </div>
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">
            {step === 1 ? t('register') : 'Verify Email'}
          </CardTitle>
          <CardDescription>
            {step === 1 ? 'Create an account to start booking your dream trips' : `Enter the 6-digit code sent to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">{error}</div>}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="pl-10" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email') || 'Email'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-10" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password') || 'Password'}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••" 
                    className="pl-10" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Where do you live?</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="location" 
                    list="egypt-cities"
                    placeholder="E.g., Cairo, Alexandria, Luxor" 
                    className="pl-10" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                  <datalist id="egypt-cities">
                    {['Cairo', 'Giza', 'Alexandria', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El Sheikh', 'Mansoura', 'Tanta', 'Zagazig', 'Ismailia', 'Suez', 'Minya', 'Sohag', 'Qena', 'Beni Suef'].map(city => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="p-4 border rounded-lg flex items-center gap-4 bg-muted/30">
                <Checkbox id="captcha" checked={captchaVerified} onCheckedChange={(checked) => setCaptchaVerified(checked as boolean)} />
                <Label htmlFor="captcha" className="cursor-pointer font-medium flex items-center gap-2">
                  I'm not a robot
                  <ShieldCheck size={16} className="text-green-600" />
                </Label>
              </div>

              <Button type="submit" className="w-full font-black uppercase tracking-widest text-xs h-12" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  {t('login')}
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
               {error && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">{error}</div>}
               <div className="p-4 bg-muted/30 rounded-lg text-center text-sm text-muted-foreground italic mb-4">
                  We've sent a 6-digit code to your email. Check your inbox to complete verification.
               </div>
               
               <div className="space-y-2">
                <Label htmlFor="otp">6-Digit Code</Label>
                <Input 
                  id="otp" 
                  placeholder="123456" 
                  className="text-center font-mono text-2xl tracking-[0.5em] h-14" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  required
                />
              </div>

              <Button type="submit" className="w-full font-black uppercase tracking-widest text-xs h-12 mt-4" disabled={loading || otp.length !== 6}>
                {loading ? 'Verifying...' : 'Verify OTP'} <CheckCircle size={14} className="ml-2"/>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
