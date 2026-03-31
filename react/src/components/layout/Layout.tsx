import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeartPulse, User, Menu, LogOut, LayoutDashboard, FileText, Activity, MessageCircle, Settings, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const path = location.pathname;
  const { t, i18n } = useTranslation();
  const activeLang = i18n.resolvedLanguage || 'en';

  console.log("Current path details:", path);

  const getRoleNav = () => {
    if (path.startsWith('/admin')) {
      return [
        { name: t('shared.adminPanel'), path: '/admin', icon: Shield }
      ];
    }
    if (path.startsWith('/doctor')) {
      return [
        { name: t('shared.dashboard'), path: '/doctor/dashboard', icon: LayoutDashboard },
        { name: t('layout.analytics'), path: '/doctor/analytics', icon: Activity }
      ];
    }
    // Default to Patient Nav
    return [
      { name: t('shared.dashboard'), path: '/dashboard', icon: LayoutDashboard },
      { name: t('shared.profile'), path: '/profile', icon: User },
      { name: t('shared.test'), path: '/test', icon: FileText },
      { name: t('shared.diary'), path: '/diary', icon: Activity },
      { name: t('shared.chat'), path: '/chat', icon: MessageCircle },
      { name: t('shared.advice'), path: '/recommendations', icon: HeartPulse }
    ];
  };

  const navItems = getRoleNav();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center">
      {/* Top Header - Fixed at max 1440px */}
      <header className="w-full max-w-[1440px] px-6 py-4 flex items-center justify-between border-b border-border bg-card shadow-custom sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <HeartPulse className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">{t('brand')}</span>
        </Link>

        {/* Role Switcher (Mock for preview navigation) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="hidden md:flex bg-muted p-1 rounded-md border border-border">
            <Link to="/dashboard" className={`px-3 py-1 text-sm rounded ${!path.includes('doctor') && !path.includes('admin') && path !== '/' && path !== '/auth' ? 'bg-background shadow-custom' : 'text-muted-foreground hover:text-foreground'}`}>
              {t('layout.patient')}
            </Link>
            <Link to="/doctor/dashboard" className={`px-3 py-1 text-sm rounded ${path.includes('doctor') ? 'bg-background shadow-custom' : 'text-muted-foreground hover:text-foreground'}`}>
              {t('layout.doctor')}
            </Link>
            <Link to="/admin" className={`px-3 py-1 text-sm rounded ${path.includes('admin') ? 'bg-background shadow-custom' : 'text-muted-foreground hover:text-foreground'}`}>
              {t('layout.admin')}
            </Link>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-muted px-1">
            <button
              type="button"
              onClick={() => i18n.changeLanguage('en')}
              className={`px-3 py-1 text-sm rounded ${activeLang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Eng
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              type="button"
              onClick={() => i18n.changeLanguage('kk')}
              className={`px-3 py-1 text-sm rounded ${activeLang === 'kk' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Қаз
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              type="button"
              onClick={() => i18n.changeLanguage('ru')}
              className={`px-3 py-1 text-sm rounded ${activeLang === 'ru' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Ру
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <LogOut className="w-4 h-4" /> {t('layout.signIn')}
            </Button>
          </Link>
          <button className="md:hidden p-2">
            <Menu className="w-6 h-6 border rounded border-border" />
          </button>
        </div>
      </header>

      <div className="w-full max-w-[1440px] flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        {path !== '/' && path !== '/auth' && (
          <aside className="w-full md:w-64 border-r border-border bg-card/50 p-6 flex flex-col gap-2 shrink-0">
            <div className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">{t('layout.navigation')}</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = path === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                      : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </aside>
        )}
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;