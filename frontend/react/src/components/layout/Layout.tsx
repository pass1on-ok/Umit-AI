import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HeartPulse, User, Menu, LogOut, LayoutDashboard, FileText, Activity, MessageCircle, Settings, Shield, GitGraph } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const isLoggedIn = !!localStorage.getItem('accessToken');

  console.log("Current path details:", path);

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    // Clear any other user data here
    navigate('/auth');
  };

  const getRoleNav = () => {
    if (path.startsWith('/admin')) {
      return [
        { name: 'Admin Panel', path: '/admin', icon: Shield }
      ];
    }
    if (path.startsWith('/doctor')) {
      return [
        { name: 'Dr. Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
        { name: 'Analytics', path: '/doctor/analytics', icon: Activity }
      ];
    }
    // Default to Patient Nav
    return [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'HADS Test', path: '/test', icon: FileText },
      { name: 'Test Results', path: '/test/results', icon: BarChart},
      { name: 'Diary', path: '/diary', icon: Activity },
      { name: 'Chat', path: '/chat', icon: MessageCircle },
      { name: 'Advice', path: '/recommendations', icon: HeartPulse }
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
          <span className="text-xl font-bold tracking-tight">UmitAI</span>
        </Link>

        {/* Role Switcher (Mock for preview navigation) */}
        <div className="hidden md:flex bg-muted p-1 rounded-md border border-border">
          <Link to="/dashboard" className={`px-3 py-1 text-sm rounded ${!path.includes('doctor') && !path.includes('admin') && path !== '/' && path !== '/auth' ? 'bg-background shadow-custom' : 'text-muted-foreground hover:text-foreground'}`}>Patient</Link>
          <Link to="/doctor/dashboard" className={`px-3 py-1 text-sm rounded ${path.includes('doctor') ? 'bg-background shadow-custom' : 'text-muted-foreground hover:text-foreground'}`}>Doctor</Link>
          <Link to="/admin" className={`px-3 py-1 text-sm rounded ${path.includes('admin') ? 'bg-background shadow-custom' : 'text-muted-foreground hover:text-foreground'}`}>Admin</Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex gap-2 text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                <User className="w-4 h-4" /> Sign In
              </Button>
            </Link>
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
            <div className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Navigation</div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = path === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive
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