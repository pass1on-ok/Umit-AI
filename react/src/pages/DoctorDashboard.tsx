import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Users, AlertCircle, FileBarChart2, Search, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DoctorDashboard = () => {
  const { t } = useTranslation();
  const patients = [
    { id: 1, name: "Sarah Jenkins", idNum: "P-4402", diagnosis: "Breast Cancer - Stage II", status: "critical", alert: "High Fatigue (8/10)", lastTest: "Today" },
    { id: 2, name: "Michael Chang", idNum: "P-8819", diagnosis: "Leukemia", status: "warning", alert: "Elevated Anxiety Score (12)", lastTest: "Yesterday" },
    { id: 3, name: "Robert Fox", idNum: "P-2010", diagnosis: "Lung Cancer - Stage III", status: "stable", alert: "None", lastTest: "3 days ago" },
    { id: 4, name: "Amanda Pierce", idNum: "P-5591", diagnosis: "Colorectal Cancer", status: "stable", alert: "None", lastTest: "1 week ago" }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('doctorDashboard.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('doctorDashboard.subtitle')}</p>
        </div>
        <div className="flex bg-card border border-border rounded-lg p-1">
          <div className="px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 rounded flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {t('doctorDashboard.criticalAlert')}</div>
          <div className="px-4 py-2 text-sm font-medium text-amber-500 rounded flex items-center gap-2">{t('doctorDashboard.warning')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-custom border-border bg-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full text-primary"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">42</p>
              <p className="text-sm text-muted-foreground">{t('doctorDashboard.totalPatients')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-custom border-border bg-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-chart-2/10 p-3 rounded-full text-chart-2"><FileBarChart2 className="w-6 h-6" /></div>
            <div>
              <p className="text-2xl font-bold text-foreground">18</p>
              <p className="text-sm text-muted-foreground">{t('doctorDashboard.testsThisWeek')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-custom border-border bg-card mt-4">
        <CardHeader className="border-b border-border/50 flex flex-row items-center justify-between py-4">
          <CardTitle>{t('doctorDashboard.patientRoster')}</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder={t('doctorDashboard.searchPlaceholder')} 
              className="w-full pl-9 pr-4 py-1.5 bg-background border border-input rounded text-sm outline-none focus:border-primary"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-3">{t('doctorDashboard.patientName')}</th>
                <th className="px-6 py-3">{t('doctorDashboard.id')}</th>
                <th className="px-6 py-3">{t('doctorDashboard.diagnosis')}</th>
                <th className="px-6 py-3">{t('doctorDashboard.statusAlerts')}</th>
                <th className="px-6 py-3">{t('doctorDashboard.lastTest')}</th>
                <th className="px-6 py-3 text-right">{t('doctorDashboard.action')}</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">{p.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.idNum}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.diagnosis}</td>
                  <td className="px-6 py-4">
                    {p.status === 'critical' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-destructive/10 text-destructive text-xs font-bold border border-destructive/20"><AlertCircle className="w-3 h-3"/> {p.alert}</span>}
                    {p.status === 'warning' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20"><AlertCircle className="w-3 h-3"/> {p.alert}</span>}
                    {p.status === 'stable' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold border border-green-500/20">{t('doctorDashboard.stable')}</span>}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{p.lastTest}</td>
                  <td className="px-6 py-4 text-right">
                    <Link to="/doctor/analytics">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">{t('doctorDashboard.analyze')} <ArrowRight className="w-4 h-4 ml-1"/></Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;