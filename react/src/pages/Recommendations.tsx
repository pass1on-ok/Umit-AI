import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Moon, Utensils, Activity, BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Recommendations = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-xl border border-primary/20 flex gap-4 items-start">
        <Lightbulb className="w-10 h-10 text-primary shrink-0" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('recommendations.title')}</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            {t('recommendations.description')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2"><Moon className="w-5 h-5 text-indigo-500" /> {t('recommendations.sleepRecovery')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-4 text-sm text-muted-foreground">
            <p className="text-foreground font-medium">{t('recommendations.sleepNote')}</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>{t('recommendations.activeResting')}</li>
              <li>{t('recommendations.screenTime')}</li>
              <li>{t('recommendations.consultDrSmith')}</li>
            </ul>
            <Button variant="outline" className="mt-2 w-max gap-2 text-xs"><BookOpen className="w-3 h-3"/> {t('recommendations.readArticle')}</Button>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-green-500" /> {t('recommendations.physicalMobility')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-4 text-sm text-muted-foreground">
            <p className="text-foreground font-medium">{t('recommendations.physicalMobilityNote')}</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>{t('recommendations.tryYoga')}</li>
              <li>{t('recommendations.aimWalks')}</li>
            </ul>
            <Button variant="outline" className="mt-2 w-max gap-2 text-xs"><ExternalLink className="w-3 h-3"/> {t('recommendations.viewVideo')}</Button>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card md:col-span-2 bg-muted/30">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2"><Utensils className="w-5 h-5 text-orange-500" /> {t('recommendations.nutritionalAdjustments')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-4 text-sm text-muted-foreground">
            <p>{t('recommendations.nutritionNote')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="bg-card border border-border p-4 rounded-md">
                <h4 className="font-bold text-foreground mb-1">{t('recommendations.hydration')}</h4>
                <p className="text-xs">{t('recommendations.hydrationText')}</p>
              </div>
              <div className="bg-card border border-border p-4 rounded-md">
                <h4 className="font-bold text-foreground mb-1">{t('recommendations.proteinPacing')}</h4>
                <p className="text-xs">{t('recommendations.proteinText')}</p>
              </div>
              <div className="bg-card border border-border p-4 rounded-md">
                <h4 className="font-bold text-foreground mb-1">{t('recommendations.gingerTea')}</h4>
                <p className="text-xs">{t('recommendations.gingerText')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recommendations;