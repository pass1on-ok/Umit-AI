import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Plus, AlertTriangle, MessageSquare, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dayNote = payload[0].payload.note;
    return (
      <div className="bg-popover border border-border p-3 rounded-lg shadow-xl max-w-[220px]">
        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between gap-4 text-xs mb-1">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-bold">{entry.value}/10</span>
          </div>
        ))}
        {dayNote && (
          <div className="mt-2 pt-2 border-t border-border italic text-[10px] text-foreground/70">
            "{dayNote}"
          </div>
        )}
      </div>
    );
  }
  return null;
};

const SymptomDiary = () => {
  const [symptoms, setSymptoms] = useState({  pain: 5, fatigue: 5, appetite: 5, nausea: 5, sleep: 5, anxiety: 5, insomnia: 5  });
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

const fetchHistory = async () => {
  const token = localStorage.getItem('accessToken'); 


  try {
    const response = await fetch('http://localhost:3000/symptoms', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      console.error("Session expired. Please log in again.");
      return;
    }

    const data = await response.json();
    
    const flattened = data.map((entry: any) => {
       const scores = entry.values.reduce((acc: any, v: any) => ({
         ...acc,
         [v.type.charAt(0).toUpperCase() + v.type.slice(1)]: v.severity
       }), {});
       return {
         name: new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'short' }),
         note: entry.description,
         ...scores
       };
    });
    setHistory(flattened.reverse());

  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    setIsFetching(false);
  }
};

  useEffect(() => { fetchHistory(); }, []);

  const handleSave = async () => {
    setIsLoading(true);
    
    const token = localStorage.getItem('accessToken');

    if (!token) {
    alert("Session not found. Please log in again.");
    setIsLoading(false);
    return;
  }

    const formattedValues = Object.entries(symptoms).map(([type, severity]) => ({
      type, severity
    }));

    try {
      const response = await fetch('http://localhost:3000/symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description: note, values: formattedValues }),
      });

      if (response.ok) {
        setNote("");
        await fetchHistory(); 
      }
    } catch (err) {
      alert("Failed to save entry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setSymptoms(prev => ({ ...prev, [key]: parseInt(e.target.value) }));
  };

  const alertVisible = symptoms.fatigue >= 8 || symptoms.pain >= 8 || symptoms.anxiety >= 8;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 py-10 px-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-foreground">Symptom Diary</h1>
        <p className="text-muted-foreground">Log your status and track patterns over time.</p>
      </div>

      {alertVisible && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex gap-4 items-center animate-bounce">
          <AlertTriangle className="text-destructive w-6 h-6" />
          <p className="text-destructive font-semibold text-sm">Caution: High symptom levels detected. Notify your provider.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="shadow-xl border-muted/40">
            <CardHeader><CardTitle className="text-lg">Daily Log</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-6">
              {Object.entries(symptoms).map(([key, value]) => (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold capitalize">{key}</label>
                    <span className="text-xs font-black bg-primary/10 text-primary px-2 py-0.5 rounded">{value}/10</span>
                  </div>
                  <input
                    type="range" min="0" max="10" value={value}
                    onChange={(e) => handleSliderChange(e, key)}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}

              <div className="space-y-3 pt-4 border-t">
                <label className="text-sm font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Personal Notes
                </label>
                <Textarea
                  placeholder="Any specific details for today?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[100px] text-sm resize-none"
                />
              </div>

              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="w-full shadow-lg h-12 font-bold text-md mt-2 transition-all active:scale-95"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <><Plus className="mr-2 w-5 h-5" /> Save Entry</>}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-8 shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-blue-500" /> Weekly Trends
            </CardTitle>
            {isFetching && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="h-[600px] w-full">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis domain={[0, 10]} fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />

                    <Line name="Pain" type="monotone" dataKey="Pain" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
                    <Line name="Fatigue" type="monotone" dataKey="Fatigue" stroke="#f59e0b" strokeWidth={3} dot={false} />
                    <Line name="Anxiety" type="monotone" dataKey="Anxiety" stroke="#06b6d4" strokeWidth={3} dot={false} />
                    <Line name="Sleep" type="monotone" dataKey="Sleep" stroke="#ec4899" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground italic">
                  No data logged yet. Create your first entry to see the chart!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SymptomDiary;