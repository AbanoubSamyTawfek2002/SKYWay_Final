import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function VerifyResetOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1]; // Only take last char
    }
    
    // allow only numbers
    if (value && !/^[0-9]+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError('Please enter the fully 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Token received, redirect to reset password page
        sessionStorage.setItem('resetToken', data.resetToken);
        navigate('/reset-password');
      } else {
        setError(data.message || 'Invalid or expired code');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        setResendCooldown(60);
      } else {
        setError(data.message || 'Could not resend code');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="text-primary" size={24} />
          </div>
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">Verify Code</CardTitle>
          <CardDescription>We sent a 6-digit code to <span className="font-bold text-foreground">{email}</span></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center">{error}</div>}
            
            <div className="flex justify-between gap-2 sm:gap-4 my-8">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  maxLength={1}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50"
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={loading}
                />
              ))}
            </div>

            <Button type="submit" className="w-full h-12 font-bold uppercase tracking-widest" disabled={loading || otp.join('').length < 6}>
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              Verify Code
            </Button>

            <div className="text-center text-sm pt-4">
              <span className="text-muted-foreground mr-2">Didn't receive the code?</span>
              <button 
                type="button" 
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className={`font-bold ${resendCooldown > 0 ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:underline'}`}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
            
            <div className="text-center text-sm text-muted-foreground pt-4">
              <button type="button" onClick={() => navigate('/forgot-password')} className="flex items-center justify-center gap-2 hover:text-primary transition-colors mx-auto">
                <ArrowLeft size={16} /> Use a different email
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
