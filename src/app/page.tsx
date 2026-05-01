"use client";

import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { DailyNudge } from '@/components/dashboard/DailyNudge';
import { SleepTracker } from '@/components/wellness/SleepTracker';
import { SelfCareChecklist } from '@/components/wellness/SelfCareChecklist';
import { CycleTracker } from '@/components/wellness/CycleTracker';
import { getTranslation } from '@/lib/translations';
import { calculateTDEE } from '@/lib/nutrition';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils, Activity, ArrowRight, Trash2, Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { state, removeFoodLog, removeActivity } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const router = useRouter();

  useEffect(() => {
    if (!state.profile) {
      router.push('/onboarding');
    }
  }, [state.profile, router]);

  if (!state.profile) return null;

  // Calculate stats for DailyNudge
  const baseGoals = calculateTDEE(state.profile);
  const recommendedCalories = state.activePlan ? state.activePlan.dailyTarget : baseGoals.recommendedCalories;
  const sugarLimit = state.activePlan ? (recommendedCalories * 0.1) / 4 : baseGoals.sugarLimit;
  
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysFood = state.foodLogs.filter(log => new Date(log.timestamp).setHours(0,0,0,0) === today);
  const todaysActivities = state.activities.filter(act => new Date(act.timestamp).setHours(0,0,0,0) === today);
  const todaysWater = state.waterLogs?.filter(log => new Date(log.timestamp).setHours(0,0,0,0) === today) || [];

  const caloriesConsumed = todaysFood.reduce((acc, curr) => acc + curr.calories, 0);
  const caloriesBurned = todaysActivities.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  const waterConsumed = todaysWater.reduce((acc, curr) => acc + curr.amountMl, 0);
  const sugarConsumed = todaysFood.reduce((acc, curr) => acc + curr.sugar, 0);

  const netCalories = caloriesConsumed - caloriesBurned;
  const caloriesRemaining = Math.max(0, recommendedCalories - netCalories);
  const waterPercent = (waterConsumed / 2500) * 100;
  const sugarPercent = (sugarConsumed / sugarLimit) * 100;

  const handleRemoveLog = (id: string, type: 'food' | 'activity') => {
    if (type === 'food') {
      removeFoodLog(id);
    } else {
      removeActivity(id);
    }
  };

  return (
    <Shell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">Hi, {state.profile.name}!</h2>
            <p className="text-sm text-muted-foreground">Ready to nourish your body today?</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-primary/20 shadow-sm">
            {state.profile.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <DailyNudge 
          userName={state.profile.name}
          caloriesRemaining={caloriesRemaining}
          waterPercent={waterPercent}
          sugarPercent={sugarPercent}
        />

        <DailyProgress />

        <section className="pb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{t.journal}</h3>
            <Link href="/history" className="text-xs text-primary font-bold flex items-center gap-1">
              {t.allHistory.toUpperCase()} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <Link href="/history">
            <Card className="border-none bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-20 h-20" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground/80">View Today's Journal</p>
                  <p className="text-xs text-muted-foreground">
                    {state.foodLogs.length + state.activities.length + (state.waterLogs?.length || 0)} items tracked today
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </Link>
        </section>
      </div>
    </Shell>
  );
}