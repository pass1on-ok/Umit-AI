import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeartPulse, Activity, Shield, ArrowRight, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';

type DemoRole = 'patient' | 'doctor' | 'admin';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  const demoMode = searchParams.get('demo') === '1';

  const isLoggedIn = Boolean(user);
  const primaryButtonLabel = isLoggedIn ? t('home.goToDashboard') : t('home.getStarted');
  const primaryButtonLink = isLoggedIn ? '/dashboard' : '/auth';

  const openDemo = () => {
    setSearchParams({ demo: '1' });
  };

  const closeDemo = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('demo');
    setSearchParams(nextParams);
  };

  const handleDemoRole = (role: DemoRole) => {
    const target = role === 'doctor' ? '/doctor/dashboard' : role === 'admin' ? '/admin' : '/dashboard';
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('demo', '1');
    navigate(`${target}?${nextParams.toString()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto py-12">
      <div className="bg-primary/10 p-6 rounded-full mb-8">
        <HeartPulse className="w-24 h-24 text-primary" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight mb-6 text-foreground">
        {t('home.headline')} <br/><span className="text-primary mt-2 block">{t('home.headlineHighlight')}</span>
      </h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
        {t('home.subtext')}
      </p>
      
      <div className="flex flex-wrap gap-4 mb-16 justify-center">
        <Link to={primaryButtonLink}>
          <Button size="lg" className="gap-2 px-8 text-lg h-14">
            {primaryButtonLabel}
          </Button>
        </Link>
        <Button size="lg" variant="outline" className="gap-2 px-8 text-lg h-14" onClick={openDemo}>
          {t('home.viewDemo')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader>
            <Activity className="w-8 h-8 text-primary mb-2" />
            <CardTitle>{t('home.continuousTracking')}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {t('home.continuousTrackingDescription')}
          </CardContent>
        </Card>
        <Card className="shadow-custom border-border bg-card">
          <CardHeader>
            <HeartPulse className="w-8 h-8 text-primary mb-2" />
            <CardTitle>{t('home.psychologicalSupport')}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {t('home.psychologicalSupportDescription')}
          </CardContent>
        </Card>
        <Card className="shadow-custom border-border bg-card">
          <CardHeader>
            <Shield className="w-8 h-8 text-primary mb-2" />
            <CardTitle>{t('home.secureCommunication')}</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {t('home.secureCommunicationDescription')}
          </CardContent>
        </Card>
      </div>

      {demoMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeDemo}>
          <div className="relative w-full max-w-3xl rounded-3xl bg-card p-8 shadow-custom" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeDemo}
              type="button"
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted/80"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-3xl font-semibold mb-3">{t('home.demoTitle')}</h2>
            <p className="text-base text-muted-foreground mb-6">
              {t('home.demoDescription')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button variant="outline" size="lg" className="h-16" onClick={() => handleDemoRole('patient')}>
                {t('layout.patient')}
              </Button>
              <Button variant="outline" size="lg" className="h-16" onClick={() => handleDemoRole('doctor')}>
                {t('layout.doctor')}
              </Button>
              <Button variant="outline" size="lg" className="h-16" onClick={() => handleDemoRole('admin')}>
                {t('layout.admin')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;