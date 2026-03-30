import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, ClipboardList, ActivitySquare, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PatientProfile = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('patientProfile.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('patientProfile.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="border-b border-border/50 pb-4 mb-4">
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> {t('patientProfile.personalData')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.fullName')}</label>
              <Input defaultValue="Sarah Jenkins" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.dateOfBirth')}</label>
              <Input type="date" defaultValue="1982-05-14" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.contactEmail')}</label>
              <Input type="email" defaultValue="sarah.j@example.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.phoneNumber')}</label>
              <Input type="tel" defaultValue="+1 (555) 123-4567" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="border-b border-border/50 pb-4 mb-4">
            <CardTitle className="flex items-center gap-2"><ClipboardList className="w-5 h-5 text-primary" /> {t('patientProfile.clinicalDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.primaryDiagnosis')}</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground">
                <option value="breast_cancer" selected>{t('patientProfile.breastCancer')}</option>
                <option value="lung_cancer">{t('patientProfile.lungCancer')}</option>
                <option value="leukemia">{t('patientProfile.leukemia')}</option>
                <option value="other">{t('patientProfile.other')}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.stageOfDisease')}</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground">
                <option value="1">{t('patientProfile.stage1')}</option>
                <option value="2" selected>{t('patientProfile.stage2')}</option>
                <option value="3">{t('patientProfile.stage3')}</option>
                <option value="4">{t('patientProfile.stage4')}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.treatmentPhase')}</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground">
                <option value="pre">{t('patientProfile.preTreatment')}</option>
                <option value="active" selected>{t('patientProfile.activeTreatment')}</option>
                <option value="post">{t('patientProfile.postTreatment')}</option>
                <option value="remission">{t('patientProfile.remissionMaintenance')}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.attendingPhysician')}</label>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-md border border-border">
                <ActivitySquare className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{t('patientProfile.drMichaelChen')}</p>
                  <p className="text-xs text-muted-foreground">{t('patientProfile.oncologyDept')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="gap-2 px-8 h-12"><Save className="w-5 h-5"/> {t('patientProfile.saveProfileChanges')}</Button>
      </div>
    </div>
  );
};

export default PatientProfile;