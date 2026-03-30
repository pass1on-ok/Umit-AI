import React from 'react';
import { User, ClipboardList, ActivitySquare, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PatientProfile = () => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Patient Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal data, current diagnosis, and treatment plan details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="border-b border-border/50 pb-4 mb-4">
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Personal Data</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input defaultValue="Sarah Jenkins" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Date of Birth</label>
              <Input type="date" defaultValue="1982-05-14" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Contact Email</label>
              <Input type="email" defaultValue="sarah.j@example.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Phone Number</label>
              <Input type="tel" defaultValue="+1 (555) 123-4567" />
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
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground">
                <option value="breast_cancer" selected>Breast Cancer</option>
                <option value="lung_cancer">Lung Cancer</option>
                <option value="leukemia">Leukemia</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Stage of Disease</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground">
                <option value="1">Stage I</option>
                <option value="2" selected>Stage II</option>
                <option value="3">Stage III</option>
                <option value="4">Stage IV</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Treatment Phase</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground">
                <option value="pre">Pre-treatment / Planning</option>
                <option value="active" selected>Active Treatment (Chemo/Radiation)</option>
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
        <Button className="gap-2 px-8 h-12"><Save className="w-5 h-5"/> Save Profile Changes</Button>
      </div>
    </div>
  );
};

export default PatientProfile;