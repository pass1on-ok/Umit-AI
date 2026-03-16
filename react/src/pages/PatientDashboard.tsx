import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, MessageCircle, FileText, Bell, CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PatientDashboard = () => {
  console.log("Patient Dashboard Loaded");
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Sarah</h1>
          <p className="text-muted-foreground mt-1">Here is the overview of your wellness program for today.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium flex items-center gap-2 border border-primary/20 shadow-custom">
          <Activity className="w-5 h-5" /> Phase 2 Treatment
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-custom border-border bg-card hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Symptom Diary <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-full"><Activity className="w-5 h-5 text-rose-500" /></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">You haven't logged your symptoms today. Tracking helps us help you better.</p>
            <Link to="/diary">
              <Button className="w-full gap-2">Log Symptoms <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              HADS Assessment <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"><FileText className="w-5 h-5 text-blue-500" /></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Your weekly psychological assessment is due. It takes ~5 minutes.</p>
            <Link to="/test">
              <Button className="w-full gap-2" variant="secondary">Start Test <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card hover:border-primary/50 transition-colors relative overflow-hidden">
          <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,22,95,0.8)]"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Messages <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full"><MessageCircle className="w-5 h-5 text-green-600" /></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Dr. Emily Smith (Psychologist) sent you a new message 2 hours ago.</p>
            <Link to="/chat">
              <Button className="w-full gap-2" variant="outline">View Messages <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Recent Alerts & Updates</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-4 p-3 bg-muted rounded-lg border border-border">
              <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">New recommendations available</p>
                <p className="text-sm text-muted-foreground">Based on your recent tests, we've updated your daily wellness guide.</p>
                <Link to="/recommendations" className="text-primary text-sm font-medium hover:underline mt-1 inline-block">Read now</Link>
              </div>
            </div>
            <div className="flex gap-4 p-3 bg-muted rounded-lg border border-border">
              <Activity className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Sleep patterns stable</p>
                <p className="text-sm text-muted-foreground">Your sleep tracking shows positive improvement over the last 3 days.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Treatment Journey</span>
                  <span className="text-sm text-muted-foreground">40%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Diary Logging Streak</span>
                  <span className="text-sm text-muted-foreground">5 Days</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <Link to="/profile">
                <Button variant="link" className="px-0 text-primary">Update your medical profile →</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;