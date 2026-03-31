import React from 'react';
import { Lightbulb, Moon, Utensils, Activity, BookOpen, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Recommendations = () => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-xl border border-primary/20 flex gap-4 items-start">
        <Lightbulb className="w-10 h-10 text-primary shrink-0" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Supported Recommendations</h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Based on your recent HADS results and Symptom Diary stating elevated fatigue, we have synthesized the following supportive actions tailored specifically to your active treatment phase.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2"><Moon className="w-5 h-5 text-indigo-500" /> Sleep & Recovery (Priority)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-4 text-sm text-muted-foreground">
            <p className="text-foreground font-medium">Your fatigue score has averaged 6/10 this week.</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Implement 'active resting' - taking structured 20-minute rests before you feel completely exhausted.</li>
              <li>Limit screen time 1 hour before scheduled sleep to improve sleep quality.</li>
              <li>If you experience pain at night, consult Dr. Smith about adjusting medication timing.</li>
            </ul>
            <Button variant="outline" className="mt-2 w-max gap-2 text-xs"><BookOpen className="w-3 h-3"/> Read article on Cancer Fatigue</Button>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-green-500" /> Physical Mobility</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-4 text-sm text-muted-foreground">
            <p className="text-foreground font-medium">Gentle movement maintains muscle mass without depleting energy.</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Try the recommended 15-minute gentle seated yoga sequence.</li>
              <li>Aim for two 10-minute walks rather than one 20-minute walk to conserve energy reserves.</li>
            </ul>
            <Button variant="outline" className="mt-2 w-max gap-2 text-xs"><ExternalLink className="w-3 h-3"/> View Video Tutorial</Button>
          </CardContent>
        </Card>

        <Card className="shadow-custom border-border bg-card md:col-span-2 bg-muted/30">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2"><Utensils className="w-5 h-5 text-orange-500" /> Nutritional Adjustments</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-4 text-sm text-muted-foreground">
            <p>While your appetite score is stable, maintaining nutritional intake during phase 2 treatment is critical to combating fatigue.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="bg-card border border-border p-4 rounded-md">
                <h4 className="font-bold text-foreground mb-1">Hydration</h4>
                <p className="text-xs">Aim for 2.5L daily. SIP slowly throughout the day rather than drinking large amounts at once to prevent mild nausea.</p>
              </div>
              <div className="bg-card border border-border p-4 rounded-md">
                <h4 className="font-bold text-foreground mb-1">Protein Pacing</h4>
                <p className="text-xs">Include small amounts of high-biological value protein (Greek yogurt, eggs) in every snack to stabilize energy.</p>
              </div>
              <div className="bg-card border border-border p-4 rounded-md">
                <h4 className="font-bold text-foreground mb-1">Ginger Tea</h4>
                <p className="text-xs">Recommended to introduce ginger tea post-meals to pre-emptively manage trace nausea.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recommendations;