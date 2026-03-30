import React, { useState } from 'react';
import { User, ClipboardList, ActivitySquare, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "Sarah Jenkins",
    dob: "1982-05-14",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    diagnosis: "breast_cancer",
    stage: "2",
    treatment: "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};

    if (!profile.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (!/^[A-Za-z\s'\-]+$/.test(profile.fullName)) {
      newErrors.fullName = 'Use only letters, spaces, apostrophes, or hyphens.';
    }

    if (!profile.dob.trim()) {
      newErrors.dob = 'Date of birth is required.';
    }

    if (!profile.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!profile.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[0-9()+\s-]+$/.test(profile.phone)) {
      newErrors.phone = 'Enter a valid phone number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileChange = (key: keyof typeof profile, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      const nextErrors = { ...errors };
      delete nextErrors[key];
      setErrors(nextErrors);
    }
  };

  const handleSave = () => {
    if (!validateProfile()) {
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setErrors({});
      alert('Profile updated successfully.');
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Patient Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal data, current diagnosis, and treatment plan details.</p>
      </div>

      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Please correct the following issues</AlertTitle>
          <AlertDescription>
            Some fields are invalid or missing. Fix the highlighted fields and try saving again.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="border-b border-border/50 pb-4 mb-4">
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Personal Data</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input
                value={profile.fullName}
                onChange={(e) => handleProfileChange('fullName', e.target.value)}
                className={errors.fullName ? 'border-destructive focus:border-destructive' : ''}
              />
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Date of Birth</label>
              <Input
                type="date"
                value={profile.dob}
                onChange={(e) => handleProfileChange('dob', e.target.value)}
                className={errors.dob ? 'border-destructive focus:border-destructive' : ''}
              />
              {errors.dob && <p className="text-xs text-destructive mt-1">{errors.dob}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Contact Email</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className={errors.email ? 'border-destructive focus:border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
                className={errors.phone ? 'border-destructive focus:border-destructive' : ''}
              />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="border-b border-border/50 pb-4 mb-4">
            <CardTitle className="flex items-center gap-2"><ClipboardList className="w-5 h-5 text-primary" /> Clinical Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Primary Diagnosis</label>
              <select
                value={profile.diagnosis}
                onChange={(e) => handleProfileChange('diagnosis', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              >
                <option value="breast_cancer">Breast Cancer</option>
                <option value="lung_cancer">Lung Cancer</option>
                <option value="leukemia">Leukemia</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Stage of Disease</label>
              <select
                value={profile.stage}
                onChange={(e) => handleProfileChange('stage', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              >
                <option value="1">Stage I</option>
                <option value="2">Stage II</option>
                <option value="3">Stage III</option>
                <option value="4">Stage IV</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Treatment Phase</label>
              <select
                value={profile.treatment}
                onChange={(e) => handleProfileChange('treatment', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
              >
                <option value="pre">Pre-treatment / Planning</option>
                <option value="active">Active Treatment (Chemo/Radiation)</option>
                <option value="post">Post-treatment / Recovery</option>
                <option value="remission">Remission Maintenance</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-sm font-medium text-foreground">Attending Physician</label>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-md border border-border">
                <ActivitySquare className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Dr. Michael Chen, MD</p>
                  <p className="text-xs text-muted-foreground">Oncology Dept, Central Hospital</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="gap-2 px-8 h-12">
          {isSaving ? (
            <>
              <LoadingSpinner size={18} className="mr-2" /> Saving...
            </>
          ) : (
            <><Save className="w-5 h-5"/> Save Profile Changes</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PatientProfile;