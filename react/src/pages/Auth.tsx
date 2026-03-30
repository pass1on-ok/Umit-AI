import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Auth format submitted, navigating to dashboard");
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md shadow-custom border-border bg-card">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create an Account'}</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {isLogin ? 'Enter your details to access your portal' : 'Register to start your supported journey'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg border border-border">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm rounded font-medium transition-all ${isLogin ? 'bg-background shadow-custom text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm rounded font-medium transition-all ${!isLogin ? 'bg-background shadow-custom text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Full Name</label>
                <Input placeholder="John Doe" required />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Email Address</label>
              <Input type="email" placeholder="patient@example.com" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full mt-4 h-12 text-lg">
              {isLogin ? <><LogIn className="w-5 h-5 mr-2" /> Log In</> : <><UserPlus className="w-5 h-5 mr-2" /> Register</>}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            For medical emergencies, please call emergency services immediately.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;