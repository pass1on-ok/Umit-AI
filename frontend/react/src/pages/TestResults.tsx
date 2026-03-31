import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileBarChart, HeartPulse, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface HadsState {
  scoreData: {
    anxietyScore: number;
    depressionScore: number;
    answers: number[];
  };
}

const TestResults = () => {
  const location = useLocation();

  const state = location.state as HadsState;
  const latestResult = state?.scoreData;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await fetch('http://localhost:3000/hads/my-results', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        // Ensure 'data' is an array before mapping
        if (Array.isArray(data)) {
          const formattedData = data.map((item) => ({
            // Convert '2026-03-30...' into 'Mar 30'
            date: new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            }),
            Anxiety: item.anxietyScore,
            Depression: item.depressionScore
          }));
          setHistory(formattedData);
        }
      } catch (error) {
        console.error("History fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getRange = (score: number) => {
    if (score <= 7) return { label: "Normal", color: "bg-green-100 text-green-700", border: "border-green-200" };
    if (score <= 10) return { label: "Mild", color: "bg-yellow-100 text-yellow-700", border: "border-yellow-200" };
    if (score <= 14) return { label: "Moderate", color: "bg-orange-100 text-orange-700", border: "border-orange-200" };
    return { label: "Severe", color: "bg-red-100 text-red-700", border: "border-red-200" };
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  const anxiety = state?.scoreData?.anxietyScore ?? (history[history.length - 1]?.Anxiety || 0);
  const depression = state?.scoreData?.depressionScore ?? (history[history.length - 1]?.Depression || 0);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 py-10 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Your Wellbeing Report</h1>
          <p className="text-muted-foreground text-lg">HADS Scores and progress tracking.</p>
        </div>
        <Link to="/test">
          <Button variant="outline" className="gap-2"><ArrowLeft className="w-4 h-4"/> Retake Test</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Anxiety Card */}
        <Card className={`shadow-lg border-2 ${getRange(anxiety).border}`}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Anxiety Level</p>
                <div className={`mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold inline-block ${getRange(anxiety).color}`}>
                  {getRange(anxiety).label}
                </div>
              </div>
              <span className="text-5xl font-black text-blue-600">{anxiety}</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Scores of 0-7 are considered normal. Scores above 11 may benefit from professional consultation.
            </p>
          </CardContent>
        </Card>

        {/* Depression Card */}
        <Card className={`shadow-lg border-2 ${getRange(depression).border}`}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Depression Level</p>
                <div className={`mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold inline-block ${getRange(depression).color}`}>
                  {getRange(depression).label}
                </div>
              </div>
              <span className="text-5xl font-black text-emerald-600">{depression}</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Your depression score is currently in the {getRange(depression).label.toLowerCase()} range.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card className="shadow-xl border-border overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileBarChart className="w-5 h-5 text-primary" /> Historical Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} domain={[0, 21]} />
                <Tooltip 
                   cursor={{fill: '#f1f5f9'}}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" align="right" height={36}/>
                <Bar name="Anxiety" dataKey="Anxiety" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={50} />
                <Bar name="Depression" dataKey="Depression" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-4 mt-4">
        <Link to="/recommendations">
          <Button size="lg" className="h-14 px-10 text-lg gap-3 shadow-indigo-200 shadow-xl">
            View Personalized Recommendations <HeartPulse className="w-6 h-6" />
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground max-w-md text-center">
          Note: This assessment is a screening tool, not a diagnosis. Please consult a healthcare professional for clinical advice.
        </p>
      </div>
    </div>
  );
};

export default TestResults;