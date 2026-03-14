import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileBarChart, HeartPulse, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TestResults = () => {
  const data = [
    { date: 'Oct 1', Anxiety: 12, Depression: 8 },
    { date: 'Oct 8', Anxiety: 10, Depression: 7 },
    { date: 'Oct 15', Anxiety: 14, Depression: 9 },
    { date: 'Oct 22', Anxiety: 8, Depression: 6 },
    { date: 'Today', Anxiety: 7, Depression: 5 },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessment Results</h1>
          <p className="text-muted-foreground mt-1">Your latest HADS scores and historical progress.</p>
        </div>
        <Link to="/test">
          <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4"/> Back to Test</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center justify-between">
              Anxiety Score
              <span className="text-3xl font-bold text-chart-1">7</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 inline-block px-2 py-1 rounded mb-2">Normal Range (0-7)</div>
            <p className="text-sm text-muted-foreground">Your anxiety levels are currently within the normal clinical range. A decrease of 1 point from your last assessment shows positive progress.</p>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center justify-between">
              Depression Score
              <span className="text-3xl font-bold text-chart-2">5</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 inline-block px-2 py-1 rounded mb-2">Normal Range (0-7)</div>
            <p className="text-sm text-muted-foreground">Your depression score indicates no clinical concern at this time. Maintain your current routines and support structures.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-custom border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileBarChart className="w-5 h-5 text-primary" /> Score History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(127, 127, 127, 0.2)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(127, 127, 127, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(127, 127, 127, 0.8)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 21]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgb(23, 23, 23)', border: 'none', borderRadius: '8px', color: '#fff' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Anxiety" fill="rgb(20, 71, 230)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Depression" fill="rgb(0, 188, 125)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-4">
        <Link to="/recommendations">
          <Button size="lg" className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
            View Personalized Recommendations <HeartPulse className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TestResults;