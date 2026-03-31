import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, Settings, Loader2, UserPlus, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- API FETCH ---
  const fetchUsers = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('accessToken');

    try {
      const response = await fetch('http://localhost:3000/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error("Access Denied: Admin privileges required.");
        throw new Error("Failed to fetch users.");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- DYNAMIC STATS ---
  const patientCount = users.filter((u: any) => u.role === 'PATIENT').length;
  const staffCount = users.filter((u: any) => u.role === 'DOCTOR' || u.role === 'PSYCHOLOGIST').length;

  // --- HELPER FOR ROLE STYLES ---
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-500/10 border-red-500/20 text-red-600';
      case 'DOCTOR': return 'bg-blue-500/10 border-blue-500/20 text-blue-600';
      case 'PSYCHOLOGIST': return 'bg-purple-500/10 border-purple-500/20 text-purple-600';
      default: return 'bg-muted border-border text-muted-foreground';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 py-10 px-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="bg-primary p-3 rounded-xl border border-primary/20 shadow-lg">
          <Shield className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">System Administration</h1>
          <p className="text-muted-foreground">Manage platform users and global application settings.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "..." : patientCount}</div>
            <p className="text-xs text-green-500 mt-1">Directly from database</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Medical Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isLoading ? "..." : staffCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Verified providers</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">Active</div>
            <p className="text-xs text-muted-foreground mt-1">API Node: localhost:3000</p>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card className="shadow-xl border-border h-[600px] flex flex-col overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary"/> User Directory
            </CardTitle>
            <Button size="sm" className="gap-2">
              <UserPlus className="w-4 h-4" /> Invite User
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 overflow-y-auto">
          {error ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-destructive">
              <AlertCircle className="w-10 h-10" />
              <p className="font-bold">{error}</p>
              <Button variant="outline" onClick={fetchUsers} size="sm">Try Again</Button>
            </div>
          ) : isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-bold sticky top-0 border-b border-border backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-foreground">{user.name}</td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border tracking-wider ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-600 text-xs font-bold">Online</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;