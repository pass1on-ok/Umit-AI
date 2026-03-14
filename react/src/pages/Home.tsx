import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Activity, Shield, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Home = () => {
  console.log("Rendering Home Page");
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto py-12">
      <div className="bg-primary/10 p-6 rounded-full mb-8">
        <HeartPulse className="w-24 h-24 text-primary" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight mb-6 text-foreground">
        Compassionate Care, <br/><span className="text-primary mt-2 block">Powered by Data</span>
      </h1>
      <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
        OncoSupport bridges the gap between clinic visits with daily symptom tracking, verified psychological assessments, and direct communication with your healthcare team.
      </p>
      
      <div className="flex gap-4 mb-16">
        <Link to="/auth">
          <Button size="lg" className="gap-2 px-8 text-lg h-14">
            Get Started <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button size="lg" variant="outline" className="gap-2 px-8 text-lg h-14">
            View Live Demo
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader>
            <Activity className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Continuous Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Log your daily symptoms like pain and fatigue to help your doctors understand your wellness journey.
          </CardContent>
        </Card>
        <Card className="shadow-custom border-border bg-card">
          <CardHeader>
            <HeartPulse className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Psychological Support</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Take clinical HADS tests and receive immediate recommendations to support your mental health.
          </CardContent>
        </Card>
        <Card className="shadow-custom border-border bg-card">
          <CardHeader>
            <Shield className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Secure Communication</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Chat securely with your assigned psychologist and medical team when you need them most.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;