import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Auth = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Auth format submitted, navigating to dashboard");
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
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
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm rounded font-medium transition-all ${isLogin ? 'bg-background shadow-custom text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('auth.signIn')}
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm rounded font-medium transition-all ${!isLogin ? 'bg-background shadow-custom text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t('auth.register')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">{t('auth.fullName')}</label>
                <Input placeholder={t('auth.fullName')} required />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('auth.emailAddress')}</label>
              <Input type="email" placeholder={t('auth.emailAddress')} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{t('auth.password')}</label>
              <Input type="password" placeholder={t('auth.password')} required />
            </div>
            <Button type="submit" className="w-full mt-4 h-12 text-lg">
              {isLogin ? <><LogIn className="w-5 h-5 mr-2" /> {t('auth.logIn')}</> : <><UserPlus className="w-5 h-5 mr-2" /> {t('auth.register')}</>}
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