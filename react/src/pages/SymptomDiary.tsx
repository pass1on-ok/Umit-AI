import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Plus, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SymptomDiary = () => {
  const { t } = useTranslation();
  const symptomLabels = {
    pain: t('symptomDiary.pain'),
    fatigue: t('symptomDiary.fatigue'),
    appetite: t('symptomDiary.appetite'),
    nausea: t('symptomDiary.nausea'),
    sleep: t('symptomDiary.sleep')
  };
  const [symptoms, setSymptoms] = useState({ pain: 4, fatigue: 6, appetite: 2, nausea: 1, sleep: 5 });
  
  const mockData = [
    { name: 'Mon', Pain: 3, Fatigue: 6, Nausea: 1 },
    { name: 'Tue', Pain: 4, Fatigue: 7, Nausea: 2 },
    { name: 'Wed', Pain: 5, Fatigue: 5, Nausea: 1 },
    { name: 'Thu', Pain: 2, Fatigue: 4, Nausea: 0 },
    { name: 'Fri', Pain: 4, Fatigue: 6, Nausea: 1 },
    { name: 'Sat', Pain: 3, Fatigue: 5, Nausea: 2 },
    { name: 'Sun', Pain: 4, Fatigue: 6, Nausea: 1 },
  ];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setSymptoms(prev => ({ ...prev, [key]: parseInt(e.target.value) }));
  };

  const handleSave = () => {
    console.log("Saved symptoms", symptoms);
    alert("Symptoms logged successfully!");
  };

  const alertVisible = symptoms.fatigue >= 8 || symptoms.pain >= 8;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('symptomDiary.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('symptomDiary.subtitle')}</p>
      </div>

      {alertVisible && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r-md flex gap-3 text-destructive-foreground items-center">
          <AlertTriangle className="w-6 h-6 text-destructive" />
          <div>
            <p className="font-bold text-destructive">{t('symptomDiary.alertTitle')}</p>
            <p className="text-sm text-foreground">{t('symptomDiary.alertText')}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="shadow-custom border-border bg-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">{t('symptomDiary.todaysLog')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {Object.entries(symptoms).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-foreground">{symptomLabels[key as keyof typeof symptomLabels]}</label>
                  <span className="text-sm font-bold text-primary w-8 text-right block bg-primary/10 rounded">{value}/10</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="10" 
                  value={value} 
                  onChange={(e) => handleSliderChange(e, key)}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('symptomDiary.none')}</span>
                  <span>{t('symptomDiary.severe')}</span>
                </div>
              </div>
            ))}
            <Button onClick={handleSave} className="w-full mt-4 gap-2">
              <Plus className="w-4 h-4" /> {t('symptomDiary.saveTodaysLog')}
            </Button>
          </CardContent>
        </Card>

        {/* Chart View */}
        <Card className="shadow-custom border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-chart-2" /> {t('symptomDiary.symptomTrends')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[450px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(127, 127, 127, 0.2)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(127, 127, 127, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(127, 127, 127, 0.8)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgb(23, 23, 23)', border: 'none', borderRadius: '8px', color: '#fff' }} 
                  />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="Pain" stroke="rgb(20, 71, 230)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Fatigue" stroke="rgb(253, 154, 0)" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Nausea" stroke="rgb(0, 188, 125)" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SymptomDiary;