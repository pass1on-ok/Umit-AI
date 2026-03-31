import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Users, Server, Database, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminPanel = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="bg-primary p-3 rounded-xl border border-primary/20 shadow-custom">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('adminPanel.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('adminPanel.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('adminPanel.activePatients')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,248</div>
            <p className="text-xs text-green-500 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('adminPanel.medicalStaff')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">84</div>
            <p className="text-xs text-muted-foreground mt-1">12 {t('adminPanel.pendingVerification')}</p>
          </CardContent>
        </Card>
        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('adminPanel.systemStatus')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">99.9%</div>
            <p className="text-xs text-muted-foreground mt-1">{t('adminPanel.statusActive')}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-custom border-border bg-card h-[500px] flex flex-col overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5"/> {t('adminPanel.userManagement')}</CardTitle>
            <Button size="sm">{t('adminPanel.inviteUser')}</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-medium sticky top-0 border-b border-border shadow-sm">
              <tr>
                <th className="px-6 py-3">{t('adminPanel.name')}</th>
                <th className="px-6 py-3">{t('adminPanel.email')}</th>
                <th className="px-6 py-3">{t('adminPanel.role')}</th>
                <th className="px-6 py-3">{t('adminPanel.status')}</th>
                <th className="px-6 py-3 text-right">{t('adminPanel.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {['Dr. Emily Smith', 'Sarah Jenkins', 'Admin Portal', 'Robert Fox', 'Michael Chang'].map((user, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{user}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.split(' ')[0].toLowerCase()}@oncosupport.med</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs border ${idx === 2 ? 'bg-primary/10 border-primary/20 text-primary' : idx === 0 ? 'bg-chart-2/10 border-chart-2/20 text-chart-2' : 'bg-muted border-border text-muted-foreground'}`}>
                      {idx === 2 ? t('adminPanel.sysAdmin') : idx === 0 ? t('adminPanel.psychologist') : t('adminPanel.patient')}
                    </span>
                  </td>
                  <td className="px-6 py-4"><span className="text-green-500 text-xs font-bold">{t('adminPanel.activeDot')}</span></td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 group"><Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground" /></Button>
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

export default AdminPanel;