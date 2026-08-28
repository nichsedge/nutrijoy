'use client';

import { useAppState, useAppActions, useHydration } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { WellnessSummary } from '@/components/dashboard/WellnessSummary';
import { CoupleSyncCard } from '@/components/wellness/CoupleSyncCard';
import { DailyAffirmationCard } from '@/components/dashboard/DailyAffirmationCard';
import { MorningSunlightCard } from '@/components/wellness/MorningSunlightCard';
import { CaffeineTrackerCard } from '@/components/wellness/CaffeineTrackerCard';
import { CircadianWindowCard } from '@/components/dashboard/CircadianWindowCard';
import { SolfeggioPlayerCard } from '@/components/wellness/SolfeggioPlayerCard';
import { getTranslation } from '@/lib/translations';
import { calculateTDEE, calculateSkinGlowScore } from '@/lib/nutrition';
import { calculateStreak } from '@/lib/types';
import { playChime } from '@/lib/soundEffects';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowRight, Sparkles, Flame, Droplets, Utensils, Activity, Sun, Heart, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const state = useAppState();
  const isHydrated = useHydration();
  const { addWaterLog } = useAppActions();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const router = useRouter();
  const isId = state.profile?.language === 'id';

  const [activeTab, setActiveTab] = useState('biorhythm');

  useEffect(() => {
    if (isHydrated && !state.profile) {
      router.push('/onboarding');
    }
  }, [isHydrated, state.profile, router]);

  if (!isHydrated || !state.profile) return null;

  // Calculate stats
  const baseGoals = calculateTDEE(state.profile);
  const recommendedCalories = state.activePlan ? state.activePlan.dailyTarget : baseGoals.recommendedCalories;
  const sugarLimit = state.activePlan ? (recommendedCalories * 0.1) / 4 : baseGoals.sugarLimit;

  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today).setHours(24, 0, 0, 0);
  const todaysFood = state.foodLogs.filter((log) => log.timestamp >= today && log.timestamp < tomorrow);
  const todaysActivities = state.activities.filter((act) => act.timestamp >= today && act.timestamp < tomorrow);
  const todaysWater = state.waterLogs?.filter((log) => log.timestamp >= today && log.timestamp < tomorrow) || [];

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

  const todaysSleep = state.sleepLogs?.filter((log) => log.timestamp >= today && log.timestamp < tomorrow) || [];
  const hasSleepLog = todaysSleep.length > 0;
  const hasActivityLog = todaysActivities.length > 0;

  const glowScore = calculateSkinGlowScore(todaysFood, todaysWater, todaysSleep, state.profile, state.profile.language);
  const streak = calculateStreak(state);

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12
      ? isId
        ? 'Selamat Pagi'
        : 'Good Morning'
      : hour < 18
        ? isId
          ? 'Selamat Siang'
          : 'Good Afternoon'
        : isId
          ? 'Selamat Malam'
          : 'Good Evening';

  const handleQuickWater = () => {
    playChime();
    addWaterLog({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      amountMl: 250,
    });
    toast({
      title: '💧 +250ml ' + (isId ? 'Tercatat' : 'Logged'),
      description: isId ? 'Terus jaga hidrasi kulitmu!' : 'Keep that radiant hydration flowing!',
    });
  };

  const totalLogsToday = todaysFood.length + todaysActivities.length + todaysWater.length;

  return (
    <Shell>
      <div className="space-y-6 animate-in fade-in duration-500 pb-24">
        {/* 🌟 1. Header with greeting, streak & skin glow score */}
        <div className="flex items-center justify-between pt-1">
          <div className="space-y-0.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{timeGreeting} ✨</p>
            <h2 className="text-2xl font-black tracking-tight text-foreground">{state.profile.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            {streak > 0 && (
              <Link
                href="/history"
                className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-amber-500/20 transition-colors"
              >
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                {streak} {isId ? 'Hari' : 'Days'}
              </Link>
            )}

            <div className="flex items-center gap-1 bg-rose-500/10 text-rose-600 px-3 py-1.5 rounded-full text-xs font-black border border-rose-500/20 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 fill-rose-500" />
              <span>{glowScore.score}</span>
            </div>
          </div>
        </div>

        {/* ⚡ 2. Quick 1-Tap Action Pills */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={handleQuickWater}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-600 transition-all active:scale-95 group shadow-2xs"
          >
            <Droplets className="w-5 h-5 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] font-black uppercase tracking-wider">+250ml</span>
          </button>

          <Link
            href="/food"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 transition-all active:scale-95 group shadow-2xs"
          >
            <Utensils className="w-5 h-5 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] font-black uppercase tracking-wider">{isId ? 'Makanan' : 'Meal'}</span>
          </Link>

          <Link
            href="/activity"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 text-orange-600 transition-all active:scale-95 group shadow-2xs"
          >
            <Activity className="w-5 h-5 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] font-black uppercase tracking-wider">{isId ? 'Gerak' : 'Move'}</span>
          </Link>

          <Link
            href="/check-in"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/15 border border-purple-500/20 text-purple-600 transition-all active:scale-95 group shadow-2xs"
          >
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] font-black uppercase tracking-wider">{isId ? 'Ritual' : 'Ritual'}</span>
          </Link>
        </div>

        {/* 🎯 3. Core Daily Progress & Calorie Balance */}
        <DailyProgress />

        {/* 💡 4. AI Insight Card */}
        <AIInsightCard
          userName={state.profile.name}
          caloriesRemaining={caloriesRemaining}
          waterPercent={waterPercent}
          sugarPercent={sugarPercent}
          proteinPercent={proteinPercent}
          hasSleepLog={hasSleepLog}
          hasActivityLog={hasActivityLog}
          glowScore={glowScore.score}
        />

        {/* 🌿 5. Segmented Bio-Rhythm & Wellness Hub */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-black text-xs uppercase tracking-widest text-foreground/60">
              {isId ? 'Pusat Keseimbangan & Ritme' : 'Bio-Rhythm & Wellness Hub'}
            </h3>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full h-11 p-1 bg-accent/40 rounded-2xl">
              <TabsTrigger
                value="biorhythm"
                className="rounded-xl text-xs font-black tracking-wide data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
              >
                <Sun className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                {isId ? 'Ritme' : 'Rhythm'}
              </TabsTrigger>
              <TabsTrigger
                value="rituals"
                className="rounded-xl text-xs font-black tracking-wide data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                {isId ? 'Ritual' : 'Rituals'}
              </TabsTrigger>
              <TabsTrigger
                value="sync"
                className="rounded-xl text-xs font-black tracking-wide data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
              >
                <Heart className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                {isId ? 'Harmoni' : 'Harmony'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="biorhythm" className="space-y-4 mt-3 animate-in fade-in-50 duration-200">
              <MorningSunlightCard />
              <CaffeineTrackerCard />
              <CircadianWindowCard />
            </TabsContent>

            <TabsContent value="rituals" className="space-y-4 mt-3 animate-in fade-in-50 duration-200">
              <WellnessSummary />
              <DailyAffirmationCard />
            </TabsContent>

            <TabsContent value="sync" className="space-y-4 mt-3 animate-in fade-in-50 duration-200">
              <CoupleSyncCard />
              <SolfeggioPlayerCard />
            </TabsContent>
          </Tabs>
        </div>

        {/* 📖 6. Clean Journal Summary Card */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-black text-xs uppercase tracking-widest text-foreground/60">{t.journal}</h3>
            <Link
              href="/history"
              className="text-xs text-primary font-black uppercase tracking-wider flex items-center gap-1 hover:underline"
            >
              {t.allHistory} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Link href="/history">
            <Card className="border border-slate-100 bg-white p-5 rounded-3xl shadow-xs hover:shadow-md transition-all group overflow-hidden relative">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-black text-foreground/90">
                    {isId ? 'Lihat Jurnal Hari Ini' : "View Today's Journal"}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {totalLogsToday > 0
                      ? `${totalLogsToday} ${isId ? 'aktivitas tercatat hari ini' : 'items tracked today'}`
                      : isId
                        ? 'Belum ada catatan hari ini'
                        : 'Nothing tracked yet today'}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:translate-x-1 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </Link>
        </section>
      </div>
    </Shell>
  );
}
