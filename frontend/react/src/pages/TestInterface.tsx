import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

const TestInterface = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, number>>({});

  const questions = [
    { id: 1, type: 'A', text: "I feel tense or 'wound up':", options: ["Most of the time (3)", "A lot of the time (2)", "From time to time, occasionally (1)", "Not at all (0)"] },
    { id: 2, type: 'D', text: "I still enjoy the things I used to enjoy:", options: ["Definitely as much (0)", "Not quite so much (1)", "Only a little (2)", "Hardly at all (3)"] },
    { id: 3, type: 'A', text: "I get a sort of frightened feeling as if something awful is about to happen:", options: ["Very definitely and quite badly (3)", "Yes, but not too badly (2)", "A little, but it doesn't worry me (1)", "Not at all (0)"] },
    { id: 4, type: 'D', text: "I can laugh and see the funny side of things:", options: ["As much as I always could (0)", "Not quite so much now (1)", "Definitely not so much now (2)", "Not at all (3)"] },
    { id: 5, type: 'A', text: "Worrying thoughts go through my mind:", options: ["A great deal of the time (3)", "A lot of the time (2)", "From time to time, but not too often (1)", "Only occasionally (0)"] },
    { id: 6, type: 'D', text: "I feel cheerful:", options: ["Not at all (3)", "Not often (2)", "Sometimes (1)", "Most of the time (0)"] },
    { id: 7, type: 'A', text: "I can sit at ease and feel relaxed:", options: ["Definitely (0)", "Usually (1)", "Not often (2)", "Not at all (3)"] },
    { id: 8, type: 'D', text: "I feel as if I am slowed down:", options: ["Nearly all the time (3)", "Very often (2)", "Sometimes (1)", "Not at all (0)"] },
    { id: 9, type: 'A', text: "I get a sort of frightened feeling like 'butterflies' in the stomach:", options: ["Not at all (0)", "Occasionally (1)", "Quite often (2)", "Very often (3)"] },
    { id: 10, type: 'D', text: "I have lost interest in my appearance:", options: ["Definitely (3)", "I don't take as much care as I should (2)", "I may not take quite as much care (1)", "I take just as much care as ever (0)"] },
    { id: 11, type: 'A', text: "I feel restless as if I have to be on the move:", options: ["Very much indeed (3)", "Quite a lot (2)", "Not very much (1)", "Not at all (0)"] },
    { id: 12, type: 'D', text: "I look forward with enjoyment to things:", options: ["As much as I ever did (0)", "Rather less than I used to (1)", "Definitely less than I used to (2)", "Hardly at all (3)"] },
    { id: 13, type: 'A', text: "I get sudden feelings of panic:", options: ["Very often indeed (3)", "Quite often (2)", "Not very often (1)", "Not at all (0)"] },
    { id: 14, type: 'D', text: "I can enjoy a good book or radio or TV program:", options: ["Often (0)", "Sometimes (1)", "Not often (2)", "Very seldom (3)"] }
  ];

  const handleSelect = (qId: number, optionIdx: number) => {
    setCurrentAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');

    const answersArray = questions.map(q => {
      const selectedStr = q.options[currentAnswers[q.id]];
      const score = parseInt(selectedStr.match(/\((\d+)\)/)?.[1] || "0");
      return score;
    });

    try {
      const response = await fetch('http://localhost:3000/hads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate('/test/results', { state: { scoreData: data } });
      } else {
        const err = await response.json();
        alert(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 py-8">
      <div className="flex items-center justify-between mb-2">
        <Link to="/dashboard">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
      </div>

      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight">HADS Assessment</h1>
        <p className="text-muted-foreground mt-2">Hospital Anxiety and Depression Scale</p>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <Card key={q.id} className="border-border overflow-hidden transition-all duration-200">
            <CardHeader className="bg-muted/30 py-3 px-6">
              <CardTitle className="text-base font-semibold">
                <span className="text-primary/70 mr-3">{idx + 1}.</span>
                {q.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(q.id, optIdx)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${currentAnswers[q.id] === optIdx
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-transparent bg-muted/50 hover:bg-muted text-muted-foreground'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{opt.split(' (')[0]}</span>
                      {currentAnswers[q.id] === optIdx && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="sticky bottom-6 bg-background/80 backdrop-blur-md p-4 border rounded-2xl shadow-xl flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {Object.keys(currentAnswers).length} of {questions.length} answered
        </p>
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={Object.keys(currentAnswers).length < questions.length || loading}
          className="gap-2 min-w-[160px]"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Complete Test"}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default TestInterface;