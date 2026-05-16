"use client";

import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { WellnessSummary } from '@/components/dashboard/WellnessSummary';
import { getTranslation } from '@/lib/translations';
import { calculateTDEE } from '@/lib/nutrition';
import { calculateStreak } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { state } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const router = useRouter();

  useEffect(() => {
    if (!state.profile) {
      router.push('/onboarding');
    }
  }, [state.profile, router]);

  if (!state.profile) return null;

  // Calculate stats
  const baseGoals = calculateTDEE(state.profile);
  const recommendedCalories = state.activePlan ? state.activePlan.dailyTarget : baseGoals.recommendedCalories;
  const sugarLimit = state.activePlan ? (recommendedCalories * 0.1) / 4 : baseGoals.sugarLimit;
  
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today).setHours(24, 0, 0, 0);
  const todaysFood = state.foodLogs.filter(log => log.timestamp >= today && log.timestamp < tomorrow);
  const todaysActivities = state.activities.filter(act => act.timestamp >= today && act.timestamp < tomorrow);
  const todaysWater = state.waterLogs?.filter(log => log.timestamp >= today && log.timestamp < tomorrow) || [];

  const caloriesConsumed = todaysFood.reduce((acc, curr) => acc + curr.calories, 0);
  const caloriesBurned = todaysActivities.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
  const waterConsumed = todaysWater.reduce((acc, curr) => acc + curr.amountMl, 0);
  const sugarConsumed = todaysFood.reduce((acc, curr) => acc + curr.sugar, 0);
  const proteinConsumed = todaysFood.reduce((acc, curr) => acc + (curr.protein || 0), 0);

  const netCalories = caloriesConsumed - caloriesBurned;
  const caloriesRemaining = Math.max(0, recommendedCalories - netCalories);
  const waterPercent = (waterConsumed / 2500) * 100;
  const sugarPercent = (sugarConsumed / sugarLimit) * 100;
  const proteinPercent = (proteinConsumed / baseGoals.proteinLimit) * 100;

  const hasSleepLog = state.sleepLogs?.some(log => log.timestamp >= today && log.timestamp < tomorrow) || false;
  const hasActivityLog = todaysActivities.length > 0;
  
  const streak = calculateStreak(state);

  return (
    <Shell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black tracking-tight">Hi, {state.profile.name}!</h2>
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground italic font-medium">Ready to nourish your body today?</p>
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 bg-orange-500/10 text-orange-600 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20">
                  <Flame className="w-3 h-3 fill-orange-500" />
                  {streak} Day Streak
                </div>
              </div>
            )}
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold border-2 border-primary/20 shadow-sm">
              {state.profile.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <AIInsightCard 
          userName={state.profile.name}
          caloriesRemaining={caloriesRemaining}
          waterPercent={waterPercent}
          sugarPercent={sugarPercent}
          proteinPercent={proteinPercent}
          hasSleepLog={hasSleepLog}
          hasActivityLog={hasActivityLog}
        />

        <DailyProgress />

        <section className="space-y-4">
           <h3 className="font-black text-sm uppercase tracking-widest text-foreground/60">{t.wellnessRitual}</h3>
           <WellnessSummary />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-sm uppercase tracking-widest text-foreground/60">{t.journal}</h3>
            <Link href="/history" className="text-[10px] text-primary font-black uppercase tracking-widest flex items-center gap-1">
              {t.allHistory} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <Link href="/history">
            <Card className="border-none bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group overflow-hidden relative border border-slate-100">
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