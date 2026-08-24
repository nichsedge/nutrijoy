'use client';

import React, { useState } from 'react';
import { useAppState } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SleepTracker } from '@/components/wellness/SleepTracker';
import { CycleTracker } from '@/components/wellness/CycleTracker';
import { SelfCareChecklist } from '@/components/wellness/SelfCareChecklist';
import { VisualSkinJournal } from '@/components/wellness/VisualSkinJournal';
import { SleepQualityCard } from '@/components/wellness/SleepQualityCard';
import { UVProtectionCard } from '@/components/wellness/UVProtectionCard';
import { HairNailVitalityCard } from '@/components/wellness/HairNailVitalityCard';
import { SkinBarrierCard } from '@/components/wellness/SkinBarrierCard';
import { SkincareShelfCard } from '@/components/wellness/SkincareShelfCard';
import { PeriodReliefCard } from '@/components/wellness/PeriodReliefCard';
import { ChevronLeft, Sparkles, CheckCircle2, Moon, Heart, Camera, Sun } from 'lucide-react';
import Link from 'next/link';

export default function CheckInPage() {
  const state = useAppState();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [activeTab, setActiveTab] = useState('sleep');

  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today).setHours(24, 0, 0, 0);
  const hasSleep = state.sleepLogs?.some((s) => s.timestamp >= today && s.timestamp < tomorrow);
  const hasCycle = state.cycleLogs?.some((c) => c.timestamp >= today && c.timestamp < tomorrow);
  const hasSelfCare = state.selfCareLogs?.some((sc) => sc.timestamp >= today && sc.timestamp < tomorrow);

  const completedCount = (hasSleep ? 1 : 0) + (hasCycle ? 1 : 0) + (hasSelfCare ? 1 : 0);

  return (
    <Shell>
      <div className="space-y-6 animate-in fade-in duration-300 pb-24">
        {/* Header with back button & progress */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <Link href="/" aria-label={isId ? 'Kembali' : 'Back'}>
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-black tracking-tight">{t.wellnessRitual}</h2>
              <p className="text-xs text-muted-foreground font-medium">
                {isId ? 'Ritual harian untuk keseimbangan tubuh & kulit' : 'Daily rituals for body & skin balance'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-purple-500/10 text-purple-600 px-3 py-1 rounded-full text-xs font-black border border-purple-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {completedCount}/3 {isId ? 'Selesai' : 'Done'}
            </span>
          </div>
        </div>

        {/* 3-Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full h-12 p-1 bg-accent/40 rounded-2xl">
            <TabsTrigger
              value="sleep"
              className="rounded-xl text-xs font-black tracking-wide data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all relative"
            >
              <Moon className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />
              {isId ? 'Tidur' : 'Sleep'}
              {hasSleep && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-2 right-2" />}
            </TabsTrigger>
            <TabsTrigger
              value="cycle"
              className="rounded-xl text-xs font-black tracking-wide data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all relative"
            >
              <Heart className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
              {isId ? 'Siklus' : 'Cycle & Care'}
              {(hasCycle || hasSelfCare) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-2 right-2" />
              )}
            </TabsTrigger>
            <TabsTrigger
              value="skin"
              className="rounded-xl text-xs font-black tracking-wide data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-pink-500" />
              {isId ? 'Kulit' : 'Skin & Glow'}
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: REST & SLEEP */}
          <TabsContent value="sleep" className="space-y-4 mt-4 animate-in fade-in-50 duration-200">
            <SleepTracker />
            <SleepQualityCard />
          </TabsContent>

          {/* TAB 2: CYCLE & CARE */}
          <TabsContent value="cycle" className="space-y-4 mt-4 animate-in fade-in-50 duration-200">
            <CycleTracker />
            <PeriodReliefCard />
            <SelfCareChecklist />
          </TabsContent>

          {/* TAB 3: SKIN & RADIANCE */}
          <TabsContent value="skin" className="space-y-4 mt-4 animate-in fade-in-50 duration-200">
            <VisualSkinJournal />
            <UVProtectionCard />
            <SkinBarrierCard />
            <HairNailVitalityCard />
            <SkincareShelfCard />
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
}
