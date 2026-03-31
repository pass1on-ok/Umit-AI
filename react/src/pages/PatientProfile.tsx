import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, ClipboardList, ActivitySquare, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/lib/authContext';
import { usersApi } from '@/lib/api';

const PatientProfile = () => {
  const { t } = useTranslation();
  const { user, setAuth, token } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [diagnosis, setDiagnosis] = useState('breast_cancer');
  const [stage, setStage] = useState('2');
  const [treatmentPhase, setTreatmentPhase] = useState('active');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Populate form from stored user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setDateOfBirth(user.profile?.dateOfBirth?.slice(0, 10) || '');
      setPhone(user.profile?.phone || '');
      setDiagnosis(user.profile?.diagnosis || 'breast_cancer');
      setStage(user.profile?.stage || '2');
      setTreatmentPhase(user.profile?.treatmentPhase || 'active');
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      // Update name/email
      await usersApi.updateMe(user.id, { name, email });
      // Update profile fields
      const updated = await usersApi.updateProfile(user.id, {
        dateOfBirth: dateOfBirth || undefined,
        phone,
        diagnosis,
        stage,
        treatmentPhase,
      });
      // Refresh context
      if (token) setAuth(updated.data, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('patientProfile.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('patientProfile.subtitle')}</p>
      </div>

      {error && (
        <div className="px-4 py-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md">{error}</div>
      )}
      {saved && (
        <div className="px-4 py-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">Профиль успешно сохранён!</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="border-b border-border/50 pb-4 mb-4">
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> {t('patientProfile.personalData')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.fullName')}</label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.dateOfBirth')}</label>
              <Input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.contactEmail')}</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.phoneNumber')}</label>
              <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
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
              <select
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="breast_cancer">{t('patientProfile.breastCancer')}</option>
                <option value="lung_cancer">{t('patientProfile.lungCancer')}</option>
                <option value="leukemia">{t('patientProfile.leukemia')}</option>
                <option value="other">{t('patientProfile.other')}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.stageOfDisease')}</label>
              <select
                value={stage}
                onChange={e => setStage(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="1">{t('patientProfile.stage1')}</option>
                <option value="2">{t('patientProfile.stage2')}</option>
                <option value="3">{t('patientProfile.stage3')}</option>
                <option value="4">{t('patientProfile.stage4')}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.treatmentPhase')}</label>
              <select
                value={treatmentPhase}
                onChange={e => setTreatmentPhase(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="pre">{t('patientProfile.preTreatment')}</option>
                <option value="active">{t('patientProfile.activeTreatment')}</option>
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
        <Button className="gap-2 px-8 h-12" onClick={handleSave} disabled={saving}>
          <Save className="w-5 h-5" /> {saving ? 'Сохранение...' : t('patientProfile.saveProfileChanges')}
        </Button>
      </div>
    </div>
  );
};

export default PatientProfile;
