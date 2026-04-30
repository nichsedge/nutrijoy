"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { generateCoachingFeedback } from '@/ai/flows/personalized-ai-coaching-feedback';
import { calculateTDEE } from '@/lib/nutrition';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AICoach() {
  const { state } = useApp();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFeedback = async () => {
    if (!state.profile) return;
    setLoading(true);
    try {
      const goals = calculateTDEE(state.profile);
      const today = new Date().setHours(0, 0, 0, 0);
      const todaysFood = state.foodLogs.filter(log => new Date(log.timestamp).setHours(0,0,0,0) === today);
      const todaysActivities = state.activities.filter(act => new Date(act.timestamp).setHours(0,0,0,0) === today);

      const res = await generateCoachingFeedback({
        caloriesConsumed: todaysFood.reduce((acc, curr) => acc + curr.calories, 0),
        caloriesBurned: todaysActivities.reduce((acc, curr) => acc + curr.caloriesBurned, 0),
        calorieGoal: goals.recommendedCalories,
        sugarIntake: todaysFood.reduce((acc, curr) => acc + curr.sugar, 0),
        sugarLimit: goals.sugarLimit,
        sodiumIntake: todaysFood.reduce((acc, curr) => acc + curr.sodium, 0),
        sodiumLimit: goals.sodiumLimit,
        weightLossGoal: state.profile.goal === 'lose' ? 'lose weight' : state.profile.goal,
        currentWeight: state.profile.weight,
      });
      setFeedback(res.feedbackMessage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state.profile) fetchFeedback();
  }, [state.profile]);

  if (!state.profile) return null;

  return (
    <Card className="border-none shadow-md bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-secondary font-bold">
            <Sparkles className="w-5 h-5 fill-secondary" />
            <span className="text-sm uppercase tracking-wider">NutriJoy Coach</span>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchFeedback} disabled={loading}>
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
        </div>
        <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap italic">
          {loading ? "Waking up NutriJoy..." : feedback || "No feedback yet. Add some logs and check back!"}
        </div>
      </CardContent>
    </Card>
  );
}

import { cn } from '@/lib/utils';