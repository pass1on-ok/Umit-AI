import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const endpoint = isLogin ? '/auth/login' : '/users/register';
  // Use VITE_API_URL if you have it in your .env, otherwise localhost is fine for now
  const url = `http://localhost:3000${endpoint}`;

  const payload = isLogin 
    ? { email: formData.email, password: formData.password } 
    : formData;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
      }
      const user = data.user || data;

      if (user && typeof user === 'object') {
        localStorage.setItem('userName', user.name || 'User'); 
        localStorage.setItem('userRole', user.role || 'PATIENT'); 
        localStorage.setItem('userId', String(user.id || '')); 
        
        console.log("Auth Success. Role:", user.role);
        navigate('/dashboard');
      } else {
        throw new Error("User data format is incorrect");
      }

    } else {
      alert(data.message || "Authentication failed");
    }
  } catch (error) {
    console.error("Connection error:", error);
    alert("Could not connect to the backend. Please check if the server is running.");
  }
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
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Email Address</label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="patient@example.com" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
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