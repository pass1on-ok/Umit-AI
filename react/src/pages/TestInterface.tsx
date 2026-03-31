import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hadsApi } from '@/lib/api';

// Full 14-question HADS scale
// Even indices (0,2,4...) → Anxiety; Odd indices (1,3,5...) → Depression
const HADS_QUESTIONS = [
  { id: 1, type: 'A', textKey: 'testInterface.question1', options: ['testInterface.option1a','testInterface.option1b','testInterface.option1c','testInterface.option1d'] },
  { id: 2, type: 'D', textKey: 'testInterface.question2', options: ['testInterface.option2a','testInterface.option2b','testInterface.option2c','testInterface.option2d'] },
  { id: 3, type: 'A', textKey: 'testInterface.question3', options: ['testInterface.option3a','testInterface.option3b','testInterface.option3c','testInterface.option3d'] },
  { id: 4, type: 'D', textKey: 'testInterface.question4', options: ['testInterface.option4a','testInterface.option4b','testInterface.option4c','testInterface.option4d'] },
  { id: 5, type: 'A', textKey: 'testInterface.question5', options: ['testInterface.option5a','testInterface.option5b','testInterface.option5c','testInterface.option5d'] },
  { id: 6, type: 'D', textKey: 'testInterface.question6', options: ['testInterface.option6a','testInterface.option6b','testInterface.option6c','testInterface.option6d'] },
  { id: 7, type: 'A', textKey: 'testInterface.question7', options: ['testInterface.option7a','testInterface.option7b','testInterface.option7c','testInterface.option7d'] },
  { id: 8, type: 'D', textKey: 'testInterface.question8', options: ['testInterface.option8a','testInterface.option8b','testInterface.option8c','testInterface.option8d'] },
  { id: 9, type: 'A', textKey: 'testInterface.question9', options: ['testInterface.option9a','testInterface.option9b','testInterface.option9c','testInterface.option9d'] },
  { id: 10, type: 'D', textKey: 'testInterface.question10', options: ['testInterface.option10a','testInterface.option10b','testInterface.option10c','testInterface.option10d'] },
  { id: 11, type: 'A', textKey: 'testInterface.question11', options: ['testInterface.option11a','testInterface.option11b','testInterface.option11c','testInterface.option11d'] },
  { id: 12, type: 'D', textKey: 'testInterface.question12', options: ['testInterface.option12a','testInterface.option12b','testInterface.option12c','testInterface.option12d'] },
  { id: 13, type: 'A', textKey: 'testInterface.question13', options: ['testInterface.option13a','testInterface.option13b','testInterface.option13c','testInterface.option13d'] },
  { id: 14, type: 'D', textKey: 'testInterface.question14', options: ['testInterface.option14a','testInterface.option14b','testInterface.option14c','testInterface.option14d'] },
];

const TestInterface = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = (qId: number, optionIdx: number) => {
    setCurrentAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      // Build ordered array of 14 answers (scores 0-3 per question)
      const answers = HADS_QUESTIONS.map(q => currentAnswers[q.id] ?? 0);
      const result = await hadsApi.submit(answers);
      // Pass result to TestResults via navigation state
      navigate('/test/results', { state: { result: result.data } });
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Ошибка при отправке теста');
      setSubmitting(false);
    }
  };

  const allAnswered = Object.keys(currentAnswers).length >= HADS_QUESTIONS.length;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">{t('testInterface.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('testInterface.subtitle')}</p>
        <p className="text-sm mt-4 bg-muted p-4 rounded-lg border border-border inline-block text-left max-w-2xl">
          <HelpCircle className="inline-block w-4 h-4 mr-2 mb-0.5 text-primary" />
          {t('testInterface.instruction')}
        </p>
      </div>

      {error && (
        <div className="px-4 py-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md">{error}</div>
      )}

      {HADS_QUESTIONS.map((q, idx) => (
        <Card key={q.id} className="shadow-custom border-border bg-card">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-lg">
              <span className="text-primary mr-2">{idx + 1}.</span>
              <span className={`text-xs mr-2 px-1.5 py-0.5 rounded font-normal ${q.type === 'A' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                {q.type === 'A' ? 'Тревога' : 'Депрессия'}
              </span>
              {t(q.textKey)}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-3">
              {q.options.map((opt, optIdx) => (
                <label
                  key={optIdx}
                  className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${currentAnswers[q.id] === optIdx ? 'bg-primary/10 border-primary text-primary font-medium' : 'border-border hover:bg-muted text-foreground'}`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    className="w-4 h-4 text-primary focus:ring-primary accent-primary"
                    checked={currentAnswers[q.id] === optIdx}
                    onChange={() => handleSelect(q.id, optIdx)}
                  />
                  <span>{t(opt)}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end mt-4">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          className="gap-2 px-8"
        >
          {submitting ? 'Отправка...' : <>{t('testInterface.submitResults')} <ArrowRight className="w-5 h-5" /></>}
        </Button>
      </div>
    </div>
  );
};

export default TestInterface;
