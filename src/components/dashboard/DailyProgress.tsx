"use client";

import React from 'react';
import { useApp } from '../AppContext';
import { calculateTDEE } from '@/lib/nutrition';
import { getTranslation } from '@/lib/translations';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Zap, Droplets } from 'lucide-react';

export function DailyProgress() {
  const { state } = useApp();
  const t = getTranslation(state.profile?.language || 'en');

  if (!state.profile) return null;

  const goals = calculateTDEE(state.profile);
  
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysFood = state.foodLogs.filter(log => new Date(log.timestamp).setHours(0,0,0,0) === today);
  const todaysActivities = state.activities.filter(act => new Date(act.timestamp).setHours(0,0,0,0) === today);

  const caloriesConsumed = todaysFood.reduce((acc, curr) => acc + curr.calories, 0);
  const sugarConsumed = todaysFood.reduce((acc, curr) => acc + curr.sugar, 0);
  const sodiumConsumed = todaysFood.reduce((acc, curr) => acc + curr.sodium, 0);
  const caloriesBurned = todaysActivities.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

  const netCalories = caloriesConsumed - caloriesBurned;
  const calPercent = Math.min((netCalories / goals.recommendedCalories) * 100, 100);
  const sugarPercent = Math.min((sugarConsumed / goals.sugarLimit) * 100, 100);
  const sodiumPercent = Math.min((sodiumConsumed / goals.sodiumLimit) * 100, 100);

  return (
    <div className="space-y-6">
      <Card className="border-none bg-gradient-to-br from-primary to-secondary text-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Flame className="w-24 h-24" />
        </div>
        <CardContent className="p-8">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{t.calories}</p>
            <h2 className="text-5xl font-bold font-headline">
              {Math.max(0, goals.recommendedCalories - netCalories)}
            </h2>
            <p className="text-sm opacity-90">{t.remaining} kcal</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs uppercase font-bold opacity-70">{t.consumed}</p>
              <p className="text-xl font-bold">{caloriesConsumed} kcal</p>
            </div>
            <div>
              <p className="text-xs uppercase font-bold opacity-70">{t.burned}</p>
              <p className="text-xl font-bold">{caloriesBurned} kcal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-sm bg-accent/30">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Droplets className="w-5 h-5" />
              <span className="text-sm uppercase tracking-tighter">{t.sugar}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>{sugarConsumed}g</span>
                <span className="opacity-50">/ {goals.sugarLimit}g</span>
              </div>
              <Progress value={sugarPercent} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-accent/30">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Zap className="w-5 h-5" />
              <span className="text-sm uppercase tracking-tighter">{t.sodium}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>{sodiumConsumed}mg</span>
                <span className="opacity-50">/ {goals.sodiumLimit}mg</span>
              </div>
              <Progress value={sodiumPercent} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}