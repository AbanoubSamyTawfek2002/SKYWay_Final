import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPassword() {
  const navigate = useNavigate();
  const resetToken = sessionStorage.getItem('resetToken');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If no token, return to login
    if (!resetToken) {
      navigate('/login', { replace: true });
    }
  }, [resetToken, navigate]);

  if (!resetToken) {
    return <Navigate to="/login" replace />;
  }

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^A-Za-z0-9]/)) score += 1;
    
    if (password.length === 0) return { label: '', color: 'bg-muted' };
    if (score < 2) return { label: 'Weak', color: 'bg-red-500' };
    if (score === 2 || score === 3) return { label: 'Medium', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, newPassword: password })
      });
      const data = await res.json();
      
      if (res.ok) {
        sessionStorage.removeItem('resetToken');
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <Card className="w-full max-w-md shadow-2xl text-center py-10">
          <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="text-green-500" size={32} />
          </div>
          <CardTitle className="text-2xl font-black uppercase tracking-tighter mb-2">Password Updated!</CardTitle>
          <CardDescription className="text-base">
            Your password has been changed successfully. Redirecting to log in...
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-primary" size={24} />
          </div>
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">Create New Password</CardTitle>
          <CardDescription>Enter a new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  className="pl-10 pr-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              <div className="pt-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Password strength</span>
                  {strength.label && <span className={`text-[10px] uppercase font-black ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>}
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 ${password.length > 0 ? strength.color : 'bg-transparent'}`}></div>
                  <div className={`h-full flex-1 ${strength.label === 'Medium' || strength.label === 'Strong' ? strength.color : 'bg-transparent'}`}></div>
                  <div className={`h-full flex-1 ${strength.label === 'Strong' ? strength.color : 'bg-transparent'}`}></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  className={`pl-10 pr-10 ${confirmPassword && password !== confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[10px] text-destructive font-semibold mt-1 uppercase">Passwords do not match</p>
              )}
            </div>

            <Button type="submit" className="w-full h-12 font-bold uppercase tracking-widest" disabled={loading || password !== confirmPassword || password.length < 8}>
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
