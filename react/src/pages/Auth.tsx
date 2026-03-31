import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authApi, usersApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';

const Auth = () => {
  const { t } = useTranslation();
  const { setAuth } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const loginRes = await authApi.login(email, password);
        const token = loginRes.data.accessToken;
        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRes = await usersApi.getMe(payload.userId);
        setAuth(userRes.data, token);
        const role = userRes.data.role;
        if (role === 'DOCTOR' || role === 'PSYCHOLOGIST') navigate('/doctor/dashboard');
        else if (role === 'ADMIN') navigate('/admin');
        else navigate('/dashboard');
      } else {
        await authApi.register({ name, email, password });
        const loginRes = await authApi.login(email, password);
        const token = loginRes.data.accessToken;
        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRes = await usersApi.getMe(payload.userId);
        setAuth(userRes.data, token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-custom border-border bg-card">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">
            {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {isLogin ? t('auth.enterDetails') : t('auth.registerStart')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg border border-border">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-sm rounded font-medium transition-all ${isLogin ? 'bg-background shadow-custom text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('auth.signIn')}
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-sm rounded font-medium transition-all ${!isLogin ? 'bg-background shadow-custom text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('auth.register')}
            </button>
          </div>

          {error && (
            <div className="mb-4 px-3 py-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">{t('auth.fullName')}</label>
                <Input placeholder={t('auth.fullName')} value={name} onChange={e => setName(e.target.value)} required />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('auth.emailAddress')}</label>
              <Input type="email" placeholder={t('auth.emailAddress')} value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('auth.password')}</label>
              <Input type="password" placeholder={t('auth.password')} value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full mt-4 h-12 text-lg" disabled={loading}>
              {loading ? '...' : isLogin
                ? <><LogIn className="w-5 h-5 mr-2" /> {t('auth.logIn')}</>
                : <><UserPlus className="w-5 h-5 mr-2" /> {t('auth.register')}</>
              }
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t('auth.forEmergencies')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
