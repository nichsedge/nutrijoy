"use client";

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { calculateWeightLossPlan } from '@/lib/nutrition';
import { WeightLossPlanResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, AlertTriangle, CheckCircle2, TrendingDown, Target, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PlannerPage() {
  const { state } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  
  const [targetLoss, setTargetLoss] = useState('5');
  const [duration, setDuration] = useState('8');
  const [result, setResult] = useState<WeightLossPlanResult | null>(null);

  const handleCalculate = () => {
    if (!state.profile) return;
    
    const res = calculateWeightLossPlan({
      currentWeight: state.profile.weight,
      targetLossKg: parseFloat(targetLoss),
      durationWeeks: parseInt(duration),
      age: state.profile.age,
      height: state.profile.height,
      sex: state.profile.sex,
      activityLevel: state.profile.activityLevel,
    });
    
    setResult(res);
  };

  if (!state.profile) return null;

  return (
    <Shell>
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{t.planner}</h2>
          <p className="text-sm text-muted-foreground">{t.plannerDesc}</p>
        </div>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> {t.targetWeightLoss}
              </Label>
              <Input 
                type="number" 
                value={targetLoss} 
                onChange={(e) => setTargetLoss(e.target.value)}
                className="rounded-xl border-2 border-primary/10 h-12 text-lg font-bold"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> {t.durationWeeks}
              </Label>
              <Input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="rounded-xl border-2 border-primary/10 h-12 text-lg font-bold"
              />
            </div>

            <Button onClick={handleCalculate} className="w-full h-12 rounded-xl font-bold text-lg mt-2">
              {t.calculatePlan}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {result.status !== 'safe' && (
              <Alert variant="destructive" className="rounded-2xl border-2">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="font-bold">
                  {result.status === 'too_aggressive' ? t.tooAggressive : t.unsafe}
                </AlertTitle>
                <AlertDescription>
                  {result.warningMessage}
                </AlertDescription>
              </Alert>
            )}

            {result.status === 'safe' && (
              <Alert className="rounded-2xl border-2 border-green-200 bg-green-50 text-green-800">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <AlertTitle className="font-bold">{t.safe}</AlertTitle>
                <AlertDescription>
                  This plan is sustainable and meets safety guidelines.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-none bg-primary/5 rounded-3xl">
                <CardContent className="p-6 text-center">
                  <p className="text-[10px] uppercase font-bold text-primary opacity-70 mb-1">{t.dailyTarget}</p>
                  <p className="text-3xl font-bold text-primary">{result.dailyTarget}</p>
                  <p className="text-xs font-bold text-muted-foreground mt-1">kcal/day</p>
                </CardContent>
              </Card>

              <Card className="border-none bg-secondary/5 rounded-3xl">
                <CardContent className="p-6 text-center">
                  <p className="text-[10px] uppercase font-bold text-secondary opacity-70 mb-1">{t.dailyDeficit}</p>
                  <p className="text-3xl font-bold text-secondary">{result.dailyDeficit}</p>
                  <p className="text-xs font-bold text-muted-foreground mt-1">kcal/day</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
               <CardHeader className="pb-2 bg-accent/10">
                 <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" /> Metabolism Overview
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-3">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Basal Metabolic Rate (BMR)</span>
                    <span className="font-bold">{result.bmr} kcal</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Daily Expenditure (TDEE)</span>
                    <span className="font-bold">{result.tdee} kcal</span>
                 </div>
                 <div className="pt-3 border-t text-xs text-muted-foreground italic flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <p>Calculation assumes 1 kg of fat equals approx. 7,700 kcal as per health standards.</p>
                 </div>
               </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Shell>
  );
}
