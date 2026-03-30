import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, ClipboardList, ActivitySquare, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { toast } from 'sonner';
import { getProfile, updateProfile, type ProfilePayload } from '@/services/api';

const PatientProfile = () => {
  const { t } = useTranslation();

  type ValidationErrors = Partial<Record<keyof ProfilePayload, string>>;

  const defaultProfile: ProfilePayload & { id: string; role: string } = {
    id: '',
    fullName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    diagnosis: '',
    stage: '1',
    treatmentPhase: 'pre',
    role: 'patient',
  };

  const isEmailValid = (value: string) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value.trim());
  const isPhoneValid = (value: string) => /^\+?[0-9\s\-()]{7,20}$/.test(value.trim());
  const isFullNameValid = (value: string) => {
    const words = value.trim().split(/\s+/);
    return words.length >= 2 && words.every((word) => /^[\p{Lu}][\p{L}'-]*$/u.test(word));
  };

  const validateProfile = (data: ProfilePayload): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!data.fullName.trim()) {
      errors.fullName = t('patientProfile.errors.fullName') ?? 'Full name is required';
    } else if (!isFullNameValid(data.fullName)) {
      errors.fullName = t('patientProfile.errors.fullNameInvalid') ?? 'Please enter a valid full name starting each word with uppercase';
    }

    if (!data.dateOfBirth) {
      errors.dateOfBirth = t('patientProfile.errors.dateOfBirth') ?? 'Date of birth is required';
    }

    if (!data.email.trim()) {
      errors.email = t('patientProfile.errors.email') ?? 'Email is required';
    } else if (!isEmailValid(data.email)) {
      errors.email = t('patientProfile.errors.emailInvalid') ?? 'Enter a valid Latin email address';
    }

    if (!data.phone.trim()) {
      errors.phone = t('patientProfile.errors.phone') ?? 'Phone number is required';
    } else if (!isPhoneValid(data.phone)) {
      errors.phone = t('patientProfile.errors.phoneInvalid') ?? 'Enter a valid phone number';
    }

    if (!data.diagnosis) {
      errors.diagnosis = t('patientProfile.errors.diagnosis') ?? 'Diagnosis is required';
    }

    if (!data.stage) {
      errors.stage = t('patientProfile.errors.stage') ?? 'Stage is required';
    }

    if (!data.treatmentPhase) {
      errors.treatmentPhase = t('patientProfile.errors.treatmentPhase') ?? 'Treatment phase is required';
    }

    return errors;
  };

  const [profile, setProfile] = useState<ProfilePayload & { id: string; role: string }>(defaultProfile);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(() => validateProfile(defaultProfile));
  const [touchedFields, setTouchedFields] = useState<Partial<Record<keyof ProfilePayload, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = Object.keys(validationErrors).length === 0;
  const shouldShowError = (field: keyof ProfilePayload) => Boolean(validationErrors[field] && (submitAttempted || touchedFields[field]));

  useEffect(() => {
    const loadProfile = async () => {
      setError(null);
      setIsLoading(true);

      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        setError((err as Error).message || 'Unable to load profile.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    setValidationErrors(validateProfile(profile));
  }, [profile, t]);

  const handleChange = (key: keyof ProfilePayload, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setTouchedFields((prev) => ({ ...prev, [key]: true }));
  };

  const handleSave = async () => {
    setError(null);
    setSubmitAttempted(true);
    const currentErrors = validateProfile(profile);
    setValidationErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      setError(t('patientProfile.errors.fixForm') ?? 'Please fill in all required fields correctly.');
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile({
        fullName: profile.fullName,
        dateOfBirth: profile.dateOfBirth,
        email: profile.email,
        phone: profile.phone,
        diagnosis: profile.diagnosis,
        stage: profile.stage,
        treatmentPhase: profile.treatmentPhase,
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      setError((err as Error).message || 'Unable to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text={t('shared.loading') ?? 'Loading profile...'} variant="page" />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 px-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('patientProfile.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('patientProfile.subtitle')}</p>
      </div>

      {error ? <ErrorMessage message={error} onDismiss={() => setError(null)} /> : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="border-b border-border/50 pb-4 mb-4">
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> {t('patientProfile.personalData')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.fullName')}</label>
              <Input
                value={profile.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={shouldShowError('fullName') ? 'border-destructive focus-visible:ring-destructive/50' : ''}
              />
              {shouldShowError('fullName') ? <p className="text-xs text-destructive">{validationErrors.fullName}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.dateOfBirth')}</label>
              <Input
                type="date"
                value={profile.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className={shouldShowError('dateOfBirth') ? 'border-destructive focus-visible:ring-destructive/50' : ''}
              />
              {shouldShowError('dateOfBirth') ? <p className="text-xs text-destructive">{validationErrors.dateOfBirth}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.contactEmail')}</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={shouldShowError('email') ? 'border-destructive focus-visible:ring-destructive/50' : ''}
              />
              {shouldShowError('email') ? <p className="text-xs text-destructive">{validationErrors.email}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.phoneNumber')}</label>
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={shouldShowError('phone') ? 'border-destructive focus-visible:ring-destructive/50' : ''}
              />
              {shouldShowError('phone') ? <p className="text-xs text-destructive">{validationErrors.phone}</p> : null}
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
                value={profile.diagnosis}
                onChange={(e) => handleChange('diagnosis', e.target.value)}
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground ${shouldShowError('diagnosis') ? 'border-destructive' : 'border-input'}`}
              >
                <option value="">{t('patientProfile.selectDiagnosis') ?? 'Select diagnosis'}</option>
                <option value="breast_cancer">{t('patientProfile.breastCancer')}</option>
                <option value="lung_cancer">{t('patientProfile.lungCancer')}</option>
                <option value="leukemia">{t('patientProfile.leukemia')}</option>
                <option value="other">{t('patientProfile.other')}</option>
              </select>
              {validationErrors.diagnosis ? <p className="text-xs text-destructive">{validationErrors.diagnosis}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.stageOfDisease')}</label>
              <select
                value={profile.stage}
                onChange={(e) => handleChange('stage', e.target.value)}
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground ${shouldShowError('stage') ? 'border-destructive' : 'border-input'}`}
              >
                <option value="">{t('patientProfile.selectStage') ?? 'Select stage'}</option>
                <option value="1">{t('patientProfile.stage1')}</option>
                <option value="2">{t('patientProfile.stage2')}</option>
                <option value="3">{t('patientProfile.stage3')}</option>
                <option value="4">{t('patientProfile.stage4')}</option>
              </select>
              {validationErrors.stage ? <p className="text-xs text-destructive">{validationErrors.stage}</p> : null}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">{t('patientProfile.treatmentPhase')}</label>
              <select
                value={profile.treatmentPhase}
                onChange={(e) => handleChange('treatmentPhase', e.target.value)}
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground ${shouldShowError('treatmentPhase') ? 'border-destructive' : 'border-input'}`}
              >
                <option value="">{t('patientProfile.selectTreatmentPhase') ?? 'Select treatment phase'}</option>
                <option value="pre">{t('patientProfile.preTreatment')}</option>
                <option value="active">{t('patientProfile.activeTreatment')}</option>
                <option value="post">{t('patientProfile.postTreatment')}</option>
                <option value="remission">{t('patientProfile.remissionMaintenance')}</option>
              </select>
              {validationErrors.treatmentPhase ? <p className="text-xs text-destructive">{validationErrors.treatmentPhase}</p> : null}
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

      <div className="flex justify-end px-4">
        <Button onClick={handleSave} className="gap-2 px-8 h-12" disabled={!isFormValid || isSaving}>
          <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : t('patientProfile.saveProfileChanges')}
        </Button>
      </div>
    </div>
  );
};

export default PatientProfile;
