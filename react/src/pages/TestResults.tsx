import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileBarChart, HeartPulse, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hadsApi, HadsResult } from '@/lib/api';
import { useAuth } from '@/lib/authContext';

const getCategory = (score: number) => {
  if (score <= 7)  return { label: 'Норма (0–7)',            color: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-900/30'  };
  if (score <= 10) return { label: 'Субклинический (8–10)', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/30' };
  return           { label: 'Клинический (11–21)',           color: 'text-red-600 dark:text-red-400',      bg: 'bg-red-50 dark:bg-red-900/30'      };
};

const TestResults = () => {
  const location = useLocation();
  const { user } = useAuth();
  const passedResult: HadsResult | undefined = location.state?.result;

  const [history, setHistory] = useState<HadsResult[]>([]);
  const [latest, setLatest] = useState<HadsResult | null>(passedResult || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Staff see all; patients see their own
    const fetch = user && ['DOCTOR','PSYCHOLOGIST','ADMIN'].includes(user.role)
      ? hadsApi.getAll()
      : hadsApi.getMy();

    fetch
      .then(res => {
        const sorted = [...res.data].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setHistory(sorted);
        if (!passedResult && sorted.length > 0) {
          setLatest(sorted[sorted.length - 1]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chartData = history.slice(-5).map(h => ({
    date: new Date(h.createdAt).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
    Тревога: h.anxietyScore,
    Депрессия: h.depressionScore,
  }));

  const anxietyCat    = latest ? getCategory(latest.anxietyScore)    : null;
  const depressionCat = latest ? getCategory(latest.depressionScore) : null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Результаты теста HADS</h1>
          <p className="text-muted-foreground mt-1">Ваши последние показатели и история изменений.</p>
        </div>
        <Link to="/test">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Пройти снова
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="text-center py-16 text-muted-foreground">Загрузка...</div>
      )}

      {!loading && !latest && (
        <div className="text-center py-16 text-muted-foreground">
          Нет данных. Пройдите тест, чтобы увидеть результаты.
        </div>
      )}

      {latest && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-custom border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center justify-between">
                Тревога
                <span className="text-3xl font-bold text-chart-1">{latest.anxietyScore}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-sm font-medium ${anxietyCat?.color} ${anxietyCat?.bg} inline-block px-2 py-1 rounded mb-2`}>
                {anxietyCat?.label}
              </div>
              <p className="text-sm text-muted-foreground">
                {latest.anxietyScore <= 7
                  ? 'Уровень тревожности в норме. Продолжайте текущий режим.'
                  : latest.anxietyScore <= 10
                    ? 'Субклиническая тревога. Рекомендуется повторить тест через 3 дня.'
                    : 'Клинически выраженная тревога. Рекомендуется консультация психолога.'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-custom border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center justify-between">
                Депрессия
                <span className="text-3xl font-bold text-chart-2">{latest.depressionScore}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-sm font-medium ${depressionCat?.color} ${depressionCat?.bg} inline-block px-2 py-1 rounded mb-2`}>
                {depressionCat?.label}
              </div>
              <p className="text-sm text-muted-foreground">
                {latest.depressionScore <= 7
                  ? 'Депрессивных симптомов не выявлено. Сохраняйте текущий образ жизни.'
                  : latest.depressionScore <= 10
                    ? 'Субклиническая депрессия. Обратите внимание на режим сна и активность.'
                    : 'Клинически выраженная депрессия. Срочно обратитесь к специалисту.'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {chartData.length > 0 && (
        <Card className="shadow-custom border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileBarChart className="w-5 h-5 text-primary" /> История результатов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(127,127,127,0.2)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(127,127,127,0.8)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(127,127,127,0.8)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 21]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgb(23,23,23)', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="Тревога"    fill="rgb(20,71,230)"   radius={[4,4,0,0]} maxBarSize={40} />
                  <Bar dataKey="Депрессия" fill="rgb(0,188,125)"   radius={[4,4,0,0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center mt-4">
        <Link to="/recommendations">
          <Button size="lg" className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
            Персональные рекомендации <HeartPulse className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TestResults;
