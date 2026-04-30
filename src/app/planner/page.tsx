"use client";

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { calculateWeightPlan } from '@/lib/nutrition';
import { WeightPlanResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Info, AlertTriangle, CheckCircle2, TrendingDown, Target, Clock, History, Award, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function PlannerPage() {
  const { state, setActivePlan, completePlan } = useApp();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  
  const [targetLoss, setTargetLoss] = useState('5');
  const [duration, setDuration] = useState('8');
  const [calcResult, setCalcResult] = useState<WeightPlanResult | null>(null);
  
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [endWeight, setEndWeight] = useState(state.profile?.weight.toString() || '');

  const handleCalculate = () => {
    if (!state.profile) return;
    
    const res = calculateWeightPlan({
      currentWeight: state.profile.weight,
      targetChangeKg: parseFloat(targetLoss),
      durationWeeks: parseInt(duration),
      age: state.profile.age,
      height: state.profile.height,
      sex: state.profile.sex,
      activityLevel: state.profile.activityLevel,
      goal: state.profile.goal,
    });
    
    setCalcResult(res);
  };

  const handleStartPlan = () => {
    if (!calcResult || !state.profile) return;
    
    setActivePlan({
      ...calcResult,
      id: Math.random().toString(36).substr(2, 9),
      startDate: Date.now(),
      targetChangeKg: parseFloat(targetLoss),
      durationWeeks: parseInt(duration),
      startWeight: state.profile.weight,
      goal: state.profile.goal,
    });

    const isGain = state.profile.goal === 'gain';
    toast({
      title: (t as any).planStarted,
      description: `Target: ${isGain ? '+' : '-'}${targetLoss}kg in ${duration} weeks`,
    });
    setCalcResult(null);
  };

  const handleCompletePlan = () => {
    completePlan(parseFloat(endWeight));
    setIsCompleteDialogOpen(false);
    toast({
      title: (t as any).planCompleted,
      variant: "default",
    });
  };

  const handleCancelActivePlan = () => {
    setActivePlan(null);
  };

  if (!state.profile) return null;

  const isGain = state.profile.goal === 'gain';
  const isMaintain = state.profile.goal === 'maintain';

  return (
    <Shell>
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-20">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{t.planner}</h2>
          <p className="text-sm text-muted-foreground">{t.plannerDesc}</p>
        </div>

        {/* Active Plan Card */}
        {state.activePlan && (
          <Card className="border-2 border-primary/20 bg-primary/5 rounded-3xl overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> {(t as any).activePlan}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={handleCancelActivePlan} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-2xl shadow-sm">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{t.dailyTarget}</p>
                   <p className="text-2xl font-bold text-primary">{state.activePlan.dailyTarget}</p>
                   <p className="text-[10px] font-bold text-muted-foreground">kcal/day</p>
                </div>
                <div className="text-center p-3 bg-white rounded-2xl shadow-sm">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Target {state.activePlan.goal === 'gain' ? 'Gain' : 'Loss'}</p>
                   <p className="text-2xl font-bold text-secondary">{state.activePlan.goal === 'gain' ? '+' : '-'}{state.activePlan.targetChangeKg ?? (state.activePlan as any).targetLossKg} kg</p>
                   <p className="text-[10px] font-bold text-muted-foreground">in {state.activePlan.durationWeeks} weeks</p>
                </div>
              </div>
              
              <Button onClick={() => setIsCompleteDialogOpen(true)} className="w-full h-12 rounded-xl font-bold text-lg">
                <Award className="w-5 h-5 mr-2" /> {(t as any).completePlan}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Maintain Message */}
        {isMaintain && !state.activePlan && (
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-primary/5">
            <CardContent className="p-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-xl font-bold">You are Maintaining!</h3>
              <p className="text-sm text-muted-foreground">
                Your current goal is to maintain your weight. You don't need to set a weight change target. Your daily calories are already optimized for maintenance.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Planner Input Card */}
        {!state.activePlan && !isMaintain && (
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> {isGain ? (t as any).targetWeightGain : t.targetWeightLoss}
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
        )}

        {/* Calculation Result */}
        {calcResult && !state.activePlan && !isMaintain && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {calcResult.status !== 'safe' && (
              <Alert variant="destructive" className="rounded-2xl border-2">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="font-bold">
                  {calcResult.status === 'too_aggressive' ? t.tooAggressive : t.unsafe}
                </AlertTitle>
                <AlertDescription>
                  {calcResult.warningMessage}
                </AlertDescription>
              </Alert>
            )}

            {calcResult.status === 'safe' && (
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
                  <p className="text-3xl font-bold text-primary">{calcResult.dailyTarget}</p>
                  <p className="text-xs font-bold text-muted-foreground mt-1">kcal/day</p>
                </CardContent>
              </Card>

              <Card className="border-none bg-secondary/5 rounded-3xl">
                <CardContent className="p-6 text-center">
                  <p className="text-[10px] uppercase font-bold text-secondary opacity-70 mb-1">{isGain ? (t as any).dailySurplus : t.dailyDeficit}</p>
                  <p className="text-3xl font-bold text-secondary">{calcResult.dailyDeficit}</p>
                  <p className="text-xs font-bold text-muted-foreground mt-1">kcal/day</p>
                </CardContent>
              </Card>
            </div>
            
            <Button onClick={handleStartPlan} className="w-full h-14 rounded-2xl font-bold text-xl shadow-lg bg-primary hover:bg-primary/90">
               {(t as any).startPlan}
            </Button>

            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
               <CardHeader className="pb-2 bg-accent/10">
                 <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" /> Metabolism Overview
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-3">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Basal Metabolic Rate (BMR)</span>
                    <span className="font-bold">{calcResult.bmr} kcal</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Daily Expenditure (TDEE)</span>
                    <span className="font-bold">{calcResult.tdee} kcal</span>
                 </div>
                 <div className="pt-3 border-t text-xs text-muted-foreground italic flex items-start gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <p>Calculation assumes 1 kg of fat equals approx. 7,700 kcal as per health standards.</p>
                 </div>
               </CardContent>
            </Card>
          </div>
        )}

        {/* History Section */}
        {state.planHistory && state.planHistory.length > 0 && (
          <section className="space-y-4 pt-4">
            <h3 className="font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> {(t as any).planHistory}
            </h3>
            <div className="space-y-3">
              {state.planHistory.map((h, i) => (
                <Card key={i} className="border-none shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">{h.goal === 'gain' ? '+' : '-'}{h.targetChangeKg ?? (h as any).targetLossKg} kg Goal</p>
                      <p className="text-[10px] text-muted-foreground">
                        {(t as any).achievedOn} {new Date(h.achievedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-green-600">SUCCESS</p>
                      <p className="text-[10px] text-muted-foreground">
                        {h.startWeight}kg → {h.endWeight}kg
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Complete Plan Dialog */}
        <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
          <DialogContent className="rounded-3xl max-w-[90%] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{(t as any).confirmComplete}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                {(t as any).enterEndWeight}
              </p>
              <Input 
                type="number" 
                value={endWeight} 
                onChange={(e) => setEndWeight(e.target.value)}
                className="rounded-xl h-12 text-lg font-bold"
                placeholder="45.0"
              />
            </div>
            <DialogFooter className="flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)} className="flex-1 rounded-xl">
                {(t as any).cancel}
              </Button>
              <Button onClick={handleCompletePlan} className="flex-1 rounded-xl">
                {(t as any).done}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  );
}
