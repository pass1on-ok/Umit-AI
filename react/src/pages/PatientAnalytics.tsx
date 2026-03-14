import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { User, ShieldAlert, ArrowLeft, Download, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PatientAnalytics = () => {
  const combinedData = [
    { date: 'Oct 1', Anxiety: 12, Depression: 8, Pain: 4, Fatigue: 6 },
    { date: 'Oct 8', Anxiety: 10, Depression: 7, Pain: 3, Fatigue: 5 },
    { date: 'Oct 15', Anxiety: 14, Depression: 9, Pain: 6, Fatigue: 8 }, // Spike
    { date: 'Oct 22', Anxiety: 8, Depression: 6, Pain: 3, Fatigue: 6 },
    { date: 'Today', Anxiety: 7, Depression: 5, Pain: 4, Fatigue: 8 },  // Fatigue Spike
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/doctor/dashboard">
          <Button variant="outline" size="icon" className="h-8 w-8"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Patient Analytics View</h1>
        </div>
        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export Report</Button>
        <Link to="/chat">
          <Button className="gap-2"><MessageSquare className="w-4 h-4" /> Message Patient</Button>
        </Link>
      </div>

      {/* Patient Header Card */}
      <Card className="shadow-custom border-border bg-card bg-muted/20">
        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-primary/20 p-4 rounded-full"><User className="w-10 h-10 text-primary" /></div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Sarah Jenkins (P-4402)</h2>
              <p className="text-sm text-muted-foreground">38 Y/O • Female • Breast Cancer Stage II • Acvtive Treatment</p>
            </div>
          </div>
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg flex items-start gap-4 max-w-md">
            <ShieldAlert className="w-6 h-6 text-destructive shrink-0" />
            <div>
              <h3 className="font-bold text-destructive text-sm">System Alert: Elevated Fatigue</h3>
              <p className="text-xs text-foreground mt-1">Patient has logged consecutive days of fatigue &gt; 7/10. AI recommendation logic triggered protocol 2B (Rest management).</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader>
            <CardTitle>Combined Metrics Correlation (30 Days)</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Visualizing HADS scores against reported Physical Symptoms to identify psychosocial impact factors.</p>
          </CardHeader>
          <CardContent>
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(127, 127, 127, 0.2)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(127, 127, 127, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="rgba(127, 127, 127, 0.8)" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Score (0-21)', angle: -90, position: 'insideLeft', fill: 'rgba(127, 127, 127, 0.8)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgb(23, 23, 23)', border: 'none', borderRadius: '8px', color: '#fff' }} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  
                  {/* Highlight Clinical Threshold */}
                  <ReferenceLine yAxisId="left" y={11} stroke="rgb(244, 22, 95)" strokeDasharray="3 3" label={{ position: 'top', value: 'Abnormal HADS Threshold', fill: 'rgb(244, 22, 95)', fontSize: 10 }} />

                  <Line yAxisId="left" type="monotone" dataKey="Anxiety" stroke="rgb(20, 71, 230)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="HADS Anxiety" />
                  <Line yAxisId="left" type="monotone" dataKey="Depression" stroke="rgb(0, 188, 125)" strokeWidth={3} dot={{ r: 4 }} name="HADS Depression" />
                  <Line yAxisId="left" type="monotone" dataKey="Fatigue" stroke="rgb(253, 154, 0)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Phys: Fatigue" />
                  <Line yAxisId="left" type="monotone" dataKey="Pain" stroke="rgb(136, 72, 249)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Phys: Pain" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm flex gap-2">
              <span className="font-bold">AI Clinical Insight:</span> 
              <span className="text-muted-foreground">Historical data indicates a strong positive correlation between spikes in physical Pain and subsequent increases in HADS Anxiety scores (lag time ~2 days). Current fatigue spike is isolated; monitor pain diligently to prevent psych regression.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientAnalytics;