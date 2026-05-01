"use client";

import React from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { SleepTracker } from '@/components/wellness/SleepTracker';
import { CycleTracker } from '@/components/wellness/CycleTracker';
import { SelfCareChecklist } from '@/components/wellness/SelfCareChecklist';
import { ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckInPage() {
  const { state } = useApp();
  const t = getTranslation(state.profile?.language || 'en');

  const today = new Date().setHours(0, 0, 0, 0);
  const hasSleep = state.sleepLogs?.some(s => new Date(s.timestamp).setHours(0,0,0,0) === today);
  const hasCycle = state.cycleLogs?.some(c => new Date(c.timestamp).setHours(0,0,0,0) === today);
  const hasSelfCare = state.selfCareLogs?.some(sc => new Date(sc.timestamp).setHours(0,0,0,0) === today);

  const allDone = hasSleep && hasCycle && hasSelfCare;

  return (
    <Shell>
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </Button>
          <div className="flex flex-col">
            <h2 className="text-2xl font-black tracking-tight">{t.wellnessRitual}</h2>
            <p className="text-sm text-muted-foreground">Your daily self-care moments.</p>
          </div>
        </div>

        {allDone ? (
          <div className="text-center py-12 bg-emerald-50 rounded-[3rem] border-2 border-dashed border-emerald-200 flex flex-col items-center gap-4 mx-2">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1 px-8">
              <p className="text-xl font-black text-emerald-900">You're All Set!</p>
              <p className="text-sm text-emerald-700/70 leading-relaxed">
                Your daily wellness ritual is complete. You're doing amazing things for your body today! ✨
              </p>
            </div>
            <Button asChild className="rounded-full bg-emerald-500 hover:bg-emerald-600 px-8 mt-4">
              <Link href="/">{t.dashboard}</Link>
            </Button>
          </div>
        ) : (
          <div className="px-1 flex flex-col gap-8">
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Step 1: Rest & Recovery
              </h3>
              <SleepTracker />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Step 2: Body Awareness
              </h3>
              <CycleTracker />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Step 3: Mindful Care
              </h3>
              <SelfCareChecklist />
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}