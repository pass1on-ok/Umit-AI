import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeartPulse, Activity, Shield, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Home = () => {
  const { t } = useTranslation();
  console.log("Rendering Home Page");
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
      
      <div className="flex gap-4 mb-16">
        <Link to="/auth">
          <Button size="lg" className="gap-2 px-8 text-lg h-14">
            {t('home.getStarted')} <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button size="lg" variant="outline" className="gap-2 px-8 text-lg h-14">
            {t('home.viewDemo')}
          </Button>
        </Link>
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
    </div>
  );
};

export default Home;