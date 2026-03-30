import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeartPulse, User, Menu, LogIn, LogOut, LayoutDashboard, FileText, Activity, MessageCircle, Settings, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const demoMode = searchParams.get('demo') === '1';
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();

  const languageOptions = [
    { code: 'en', label: 'Eng' },
    { code: 'kk', label: 'Қаз' },
    { code: 'ru', label: 'Ру' },
  ];

  const currentLanguage = i18n.language?.substring(0, 2) || 'en';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = async () => {
    if (demoMode && !user) {
      navigate('/');
      return;
    }

    await signOut();
    navigate('/');
  };

  const getDemoLink = (targetPath: string) => demoMode ? `${targetPath}?demo=1` : targetPath;

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
        <Link to={getDemoLink('/')} className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <HeartPulse className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">{t('brand')}</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {languageOptions.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLanguage === lang.code ? 'secondary' : 'ghost'}
                size="sm"
                className="min-w-[48px] px-2"
                onClick={() => changeLanguage(lang.code)}
              >
                {lang.label}
              </Button>
            ))}
          </div>

          {(path === '/' || demoMode) && (
            user || demoMode ? (
              <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" /> {t('layout.logout')}
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" /> {t('layout.signIn')}
                </Button>
              </Link>
            )
          )}
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
                  to={getDemoLink(item.path)}
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

            {user && (
              <div className="mt-auto pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" /> {t('layout.logout')}
                </Button>
              </div>
            )}
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