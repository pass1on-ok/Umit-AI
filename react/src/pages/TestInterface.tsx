import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TestInterface = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number>>({});

  const questions = [
    { id: 1, type: 'A', textKey: 'testInterface.question1', options: ['testInterface.option1a', 'testInterface.option1b', 'testInterface.option1c', 'testInterface.option1d'] },
    { id: 2, type: 'D', textKey: 'testInterface.question2', options: ['testInterface.option2a', 'testInterface.option2b', 'testInterface.option2c', 'testInterface.option2d'] },
    { id: 3, type: 'A', textKey: 'testInterface.question3', options: ['testInterface.option3a', 'testInterface.option3b', 'testInterface.option3c', 'testInterface.option3d'] },
    { id: 4, type: 'D', textKey: 'testInterface.question4', options: ['testInterface.option4a', 'testInterface.option4b', 'testInterface.option4c', 'testInterface.option4d'] }
  ];

  const handleSelect = (qId: number, optionIdx: number) => {
    setCurrentAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = () => {
    console.log("Submitting test results: ", currentAnswers);
    navigate('/test/results');
  };

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

      {questions.map((q, idx) => (
        <Card key={q.id} className="shadow-custom border-border bg-card">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-lg">
              <span className="text-primary mr-2">{idx + 1}.</span>
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
          disabled={Object.keys(currentAnswers).length < questions.length}
          className="gap-2 px-8"
        >
          {t('testInterface.submitResults')} <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default TestInterface;