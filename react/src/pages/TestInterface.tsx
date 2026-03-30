import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TestInterface = () => {
  const navigate = useNavigate();
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number>>({});

  const questions = [
    { id: 1, type: 'A', text: "I feel tense or 'wound up':", options: ["Most of the time (3)", "A lot of the time (2)", "From time to time, occasionally (1)", "Not at all (0)"] },
    { id: 2, type: 'D', text: "I still enjoy the things I used to enjoy:", options: ["Definitely as much (0)", "Not quite so much (1)", "Only a little (2)", "Hardly at all (3)"] },
    { id: 3, type: 'A', text: "I get a sort of frightened feeling as if something awful is about to happen:", options: ["Very definitely and quite badly (3)", "Yes, but not too badly (2)", "A little, but it doesn't worry me (1)", "Not at all (0)"] },
    { id: 4, type: 'D', text: "I can laugh and see the funny side of things:", options: ["As much as I always could (0)", "Not quite so much now (1)", "Definitely not so much now (2)", "Not at all (3)"] }
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
        <h1 className="text-3xl font-bold text-foreground">HADS Assessment</h1>
        <p className="text-muted-foreground mt-2">Hospital Anxiety and Depression Scale</p>
        <p className="text-sm mt-4 bg-muted p-4 rounded-lg border border-border inline-block text-left max-w-2xl">
          <HelpCircle className="inline-block w-4 h-4 mr-2 mb-0.5 text-primary" />
          Please select the reply that is closest to how you have been feeling in the past week. Don't take too long over your replies.
        </p>
      </div>

      {questions.map((q, idx) => (
        <Card key={q.id} className="shadow-custom border-border bg-card">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-lg">
              <span className="text-primary mr-2">{idx + 1}.</span>
              {q.text}
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
                  <span>{opt}</span>
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
          Submit Results <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default TestInterface;