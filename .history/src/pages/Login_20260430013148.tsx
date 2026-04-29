import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
// ...
    if (!captchaVerified) {
      setError("Please verify you're not a robot.");
      return;
    }
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-primary" size={24} />
          </div>
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">{t('login')}</CardTitle>
          <CardDescription>Enter your credentials to access your SkyWay account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">{error}</div>}
            
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
                  className="pl-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline italic uppercase tracking-wider">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Mock CAPTCHA */}
            <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-4">
              <Checkbox id="captcha" onCheckedChange={(checked) => setCaptchaVerified(checked === true)} />
              <Label htmlFor="captcha" className="cursor-pointer font-medium flex items-center gap-2">
                I'm not a robot
                <ShieldCheck size={16} className="text-green-600" />
              </Label>
            </div>

            <Button type="submit" className="w-full h-12 font-bold uppercase tracking-widest">
              {t('login')}
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                {t('register')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
