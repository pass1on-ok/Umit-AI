import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Activity, MessageCircle, FileText, Bell, CheckCircle2, ChevronRight, LogOut } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/authContext';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('patientDashboard.welcomeBack')}{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="text-muted-foreground mt-1">{t('patientDashboard.overview')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-primary/20 shadow-custom">
            <Activity className="w-5 h-5" /> {t('patientDashboard.phaseTreatment')}
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Выйти
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-custom border-border bg-card hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              {t('patientDashboard.symptomDiary')} <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-full"><Activity className="w-5 h-5 text-rose-500" /></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{t('patientDashboard.symptomDiaryDescription')}</p>
            <Link to="/diary">
              <Button className="w-full gap-2">{t('patientDashboard.symptomDiary')} <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              {t('patientDashboard.hadsAssessment')} <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"><FileText className="w-5 h-5 text-blue-500" /></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{t('patientDashboard.hadsAssessmentDescription')}</p>
            <Link to="/test">
              <Button className="w-full gap-2" variant="secondary">{t('patientDashboard.hadsAssessment')} <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card hover:border-primary/50 transition-colors relative overflow-hidden">
          <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,22,95,0.8)]"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              {t('patientDashboard.messages')} <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full"><MessageCircle className="w-5 h-5 text-green-600" /></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{t('patientDashboard.messagesDescription')}</p>
            <Link to="/chat">
              <Button className="w-full gap-2" variant="outline">{t('patientDashboard.messages')} <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> {t('patientDashboard.recentAlerts')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-4 p-3 bg-muted rounded-lg border border-border">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{t('patientDashboard.newRecommendations')}</p>
                <p className="text-sm text-muted-foreground">{t('patientDashboard.newRecommendationsDescription')}</p>
                <Link to="/recommendations" className="text-primary text-sm font-medium hover:underline mt-1 inline-block">{t('patientDashboard.updateProfile')}</Link>
              </div>
            </div>
            <div className="flex gap-4 p-3 bg-muted rounded-lg border border-border">
              <Activity className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{t('patientDashboard.sleepStable')}</p>
                <p className="text-sm text-muted-foreground">{t('patientDashboard.sleepStableDescription')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle>{t('patientDashboard.yourProgress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{t('patientDashboard.treatmentJourney')}</span>
                  <span className="text-sm text-muted-foreground">40%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{t('patientDashboard.diaryStreak')}</span>
                  <span className="text-sm text-muted-foreground">5 Days</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <Link to="/profile">
                <Button variant="link" className="px-0 text-primary">{t('patientDashboard.updateProfile')}</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
