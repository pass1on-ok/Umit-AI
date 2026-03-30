import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useAuth } from '@/context/AuthContext';

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = isLogin
        ? await signIn({ email, password })
        : await signUp({ fullName, email, password, role: 'patient' });

      if (user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError((err as Error).message || 'Unable to authenticate.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-custom border-border bg-card">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">{isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {isLogin ? t('auth.enterDetails') : t('auth.registerStart')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm rounded font-medium transition-all ${isLogin ? 'bg-background shadow-custom text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('auth.signIn')}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm rounded font-medium transition-all ${!isLogin ? 'bg-background shadow-custom text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('auth.register')}
            </button>
          </div>

          {error ? <ErrorMessage message={error} onDismiss={() => setError(null)} /> : null}
          {isLoading ? <LoadingSpinner text="Authenticating..." variant="page" /> : null}

          {!isLoading ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">{t('auth.fullName')}</label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t('auth.fullName')} required />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">{t('auth.emailAddress')}</label>
                <Input value={email} type="email" onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.emailAddress')} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">{t('auth.password')}</label>
                <Input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.password')} required />
              </div>
              <Button type="submit" className="w-full mt-4 h-12 text-lg" disabled={isLoading}>
                {isLogin ? <><LogIn className="w-5 h-5 mr-2" /> {t('auth.logIn')}</> : <><UserPlus className="w-5 h-5 mr-2" /> {t('auth.register')}</>}
              </Button>
            </form>
          ) : null}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t('auth.forEmergencies')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
