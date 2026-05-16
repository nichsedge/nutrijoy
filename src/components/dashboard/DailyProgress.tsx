"use client";

import React, { useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import { calculateTDEE } from '@/lib/nutrition';
import { getTranslation } from '@/lib/translations';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Zap, Droplets, Beef, Leaf, Pill, GlassWater, Sparkles, Sun, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { MicronutrientsCard } from './MicronutrientsCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import confetti from 'canvas-confetti';

export function DailyProgress() {
  const { state, addWaterLog, removeWaterLog } = useApp();
  const [showAllNutrients, setShowAllNutrients] = useState(false);
  const [waterGoalReached, setWaterGoalReached] = useState(false);
  const t = getTranslation(state.profile?.language || 'en');

  if (!state.profile) return null;

  const baseGoals = calculateTDEE(state.profile);
  const recommendedCalories = state.activePlan ? state.activePlan.dailyTarget : baseGoals.recommendedCalories;
  const sugarLimit = state.activePlan ? (recommendedCalories * 0.1) / 4 : baseGoals.sugarLimit;
  const goals = { ...baseGoals, recommendedCalories, sugarLimit: Math.round(sugarLimit) };
  
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today).setHours(24, 0, 0, 0);
  const todaysFood = state.foodLogs.filter(log => log.timestamp >= today && log.timestamp < tomorrow);
  const todaysActivities = state.activities.filter(act => act.timestamp >= today && act.timestamp < tomorrow);

  const caloriesConsumed = todaysFood.reduce((acc, curr) => acc + curr.calories, 0);
  const sugarConsumed = todaysFood.reduce((acc, curr) => acc + curr.sugar, 0);
  const sodiumConsumed = todaysFood.reduce((acc, curr) => acc + curr.sodium, 0);
  const proteinConsumed = todaysFood.reduce((acc, curr) => acc + (curr.protein || 0), 0);
  const fiberConsumed = todaysFood.reduce((acc, curr) => acc + (curr.fiber || 0), 0);
  const vitaminCConsumed = todaysFood.reduce((acc, curr) => acc + (curr.vitaminC || 0), 0);
  const biotinConsumed = todaysFood.reduce((acc, curr) => acc + (curr.biotin || 0), 0);
  const zincConsumed = todaysFood.reduce((acc, curr) => acc + (curr.zinc || 0), 0);
  const omega3Consumed = todaysFood.reduce((acc, curr) => acc + (curr.omega3 || 0), 0);
  const vitaminEConsumed = todaysFood.reduce((acc, curr) => acc + (curr.vitaminE || 0), 0);
  const caloriesBurned = todaysActivities.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

  const todaysWater = state.waterLogs?.filter(log => log.timestamp >= today && log.timestamp < tomorrow) || [];
  const waterConsumed = todaysWater.reduce((acc, curr) => acc + curr.amountMl, 0);
  const waterGoal = 2500; // ml

  const netCalories = caloriesConsumed - caloriesBurned;
  const waterPercent = Math.min((waterConsumed / waterGoal) * 100, 100);
  const sugarPercent = (sugarConsumed / goals.sugarLimit) * 100;
  const sodiumPercent = (sodiumConsumed / goals.sodiumLimit) * 100;
  const proteinPercent = Math.min((proteinConsumed / goals.proteinLimit) * 100, 100);
  const fiberPercent = Math.min((fiberConsumed / goals.fiberLimit) * 100, 100);
  const vitaminCPercent = Math.min((vitaminCConsumed / goals.vitaminCLimit) * 100, 100);
  const biotinPercent = Math.min((biotinConsumed / goals.biotinLimit) * 100, 100);
  const zincPercent = Math.min((zincConsumed / goals.zincLimit) * 100, 100);
  const omega3Percent = Math.min((omega3Consumed / goals.omega3Limit) * 100, 100);
  const vitaminEPercent = Math.min((vitaminEConsumed / goals.vitaminELimit) * 100, 100);

  useEffect(() => {
    if (waterPercent >= 100 && !waterGoalReached) {
      setWaterGoalReached(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#60a5fa', '#93c5fd']
      });
    } else if (waterPercent < 100) {
      setWaterGoalReached(false);
    }
  }, [waterPercent, waterGoalReached]);

  const handleAddWater = (amount: number) => {
    addWaterLog({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      amountMl: amount
    });
  };

  const handleRemoveRecentWater = () => {
    if (todaysWater.length > 0) {
      const mostRecent = [...todaysWater].sort((a, b) => b.timestamp - a.timestamp)[0];
      removeWaterLog(mostRecent.id);
    }
  };

  const getProgressColor = (percent: number, isLimit: boolean = false) => {
    if (!isLimit) return "bg-primary";
    if (percent > 100) return "bg-destructive";
    if (percent > 70) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <Card className="border-none bg-gradient-to-br from-primary to-secondary text-white shadow-xl overflow-hidden relative rounded-[2.5rem] animate-in zoom-in-95 duration-700">
        <div className="absolute top-0 right-0 p-4 opacity-20 animate-float">
          <Flame className="w-24 h-24" />
        </div>
        <CardContent className="p-10">
          <div className="flex flex-col gap-1 items-center text-center">
            <p className="text-xs font-black opacity-80 uppercase tracking-[0.2em] mb-2">{t.calories} {t.remaining}</p>
            <div className="relative">
               <h2 className="text-7xl font-black font-headline tracking-tighter">
                {Math.max(0, goals.recommendedCalories - netCalories)}
              </h2>
              <div className="absolute -top-2 -right-6">
                <Sparkles className="w-6 h-6 animate-pulse text-white/50" />
              </div>
            </div>
            <p className="text-sm font-bold opacity-90 mt-2">kcal to go</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-8 border-t border-white/20 pt-8">
            <div className="text-center">
              <p className="text-[10px] uppercase font-black opacity-70 tracking-widest mb-1">{t.consumed}</p>
              <p className="text-2xl font-black">{caloriesConsumed}</p>
            </div>
            <div className="text-center border-l border-white/20">
              <p className="text-[10px] uppercase font-black opacity-70 tracking-widest mb-1">{t.burned}</p>
              <p className="text-2xl font-black">{caloriesBurned}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm mb-4 glass-premium border-2 border-blue-500/10 rounded-[2rem]">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600 font-black">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <GlassWater className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase tracking-[0.1em]">{t.skinGlow || 'Skin Glow Hydration'}</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-xs font-black text-blue-600">{waterConsumed} / {waterGoal}ml</span>
               {todaysWater.length > 0 && (
                 <button 
                  onClick={handleRemoveRecentWater}
                  className="p-1.5 hover:bg-blue-500/10 rounded-full transition-colors"
                  title="Undo last entry"
                 >
                   <RotateCcw className="w-4 h-4 text-blue-500" />
                 </button>
               )}
            </div>
          </div>
          <div className="relative h-4 w-full bg-blue-500/5 rounded-full overflow-hidden">
             <div 
               className="h-full bg-blue-500 transition-all duration-1000 ease-out rounded-full"
               style={{ width: `${waterPercent}%` }}
             />
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-soft" />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handleAddWater(250)}
              className="flex-1 bg-white/80 hover:bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest py-3 rounded-2xl border border-blue-500/10 shadow-sm transition-all active:scale-95"
            >
              +250ml
            </button>
            <button 
              onClick={() => handleAddWater(500)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-2xl shadow-lg transition-all active:scale-95 shadow-blue-500/20"
            >
              +500ml
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className={`border-none shadow-sm ${state.profile.goal === 'recompose' ? 'bg-primary/10 border-2 border-primary/20' : 'bg-accent/30'}`}>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Beef className="w-5 h-5" />
              <span className="text-sm uppercase tracking-tighter">{t.protein || 'Protein'}</span>
            </div>
            {state.profile.goal === 'recompose' && (
              <span className="text-[10px] font-bold bg-primary text-white px-2 py-1 rounded-full uppercase">Goal Focus</span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>{proteinConsumed}g</span>
              <span className="opacity-50">/ {goals.proteinLimit}g</span>
            </div>
            <Progress value={proteinPercent} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Collapsible open={showAllNutrients} onOpenChange={setShowAllNutrients} className="space-y-4">
        <div className="flex justify-center">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
              {showAllNutrients ? t.showLess : t.showMore}
              {showAllNutrients ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-none shadow-sm bg-accent/30">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Leaf className="w-5 h-5" />
                  <span className="text-sm uppercase tracking-tighter">{t.fiber || 'Fiber'}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{fiberConsumed}g</span>
                    <span className="opacity-50">/ {goals.fiberLimit}g</span>
                  </div>
                  <Progress value={fiberPercent} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <MicronutrientsCard 
              t={t} 
              nutrients={[
                { label: t.vitaminC, consumed: vitaminCConsumed, limit: goals.vitaminCLimit, unit: 'mg', icon: <Pill />, percent: vitaminCPercent },
                { label: t.biotin, consumed: biotinConsumed, limit: goals.biotinLimit, unit: 'mcg', icon: <Sparkles />, percent: biotinPercent },
                { label: t.zinc, consumed: zincConsumed, limit: goals.zincLimit, unit: 'mg', icon: <Zap />, percent: zincPercent },
                { label: t.omega3, consumed: omega3Consumed, limit: goals.omega3Limit, unit: 'mg', icon: <Droplets />, percent: omega3Percent },
                { label: t.vitaminE, consumed: vitaminEConsumed, limit: goals.vitaminELimit, unit: 'mg', icon: <Sun />, percent: vitaminEPercent },
              ]} 
            />

            <Card className="border-none shadow-sm bg-muted/50">
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
                  <Progress value={sugarPercent} className="h-2" indicatorClassName={getProgressColor(sugarPercent, true)} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-muted/50">
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
                  <Progress value={sodiumPercent} className="h-2" indicatorClassName={getProgressColor(sodiumPercent, true)} />
                </div>
              </CardContent>
            </Card>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
