"use client";

import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { AICoach } from '@/components/dashboard/AICoach';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { state } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!state.profile) {
      router.push('/onboarding');
    }
  }, [state.profile, router]);

  if (!state.profile) return null;

  return (
    <Shell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Hi, {state.profile.name}!</h2>
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold border border-secondary/30">
            {state.profile.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <DailyProgress />
        
        <AICoach />

        <div className="grid grid-cols-2 gap-4">
          <Button asChild className="h-16 rounded-2xl flex flex-col items-center justify-center bg-primary hover:bg-primary/90">
            <Link href="/food">
              <Utensils className="w-5 h-5" />
              <span className="text-xs font-bold mt-1">LOG FOOD</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-16 rounded-2xl flex flex-col items-center justify-center border-2 border-primary/20 hover:border-primary text-primary">
            <Link href="/activity">
              <Activity className="w-5 h-5" />
              <span className="text-xs font-bold mt-1">LOG MOVE</span>
            </Link>
          </Button>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Latest Habits</h3>
            <Link href="/history" className="text-xs text-primary font-bold flex items-center gap-1">
              HISTORY <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
             {state.foodLogs.slice(0, 3).map(log => (
               <div key={log.id} className="p-4 rounded-2xl bg-white shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-primary">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold capitalize">{log.name}</p>
                      <p className="text-xs text-muted-foreground">{log.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold">+{log.calories} kcal</p>
               </div>
             ))}
             {state.foodLogs.length === 0 && (
               <div className="text-center py-8 text-muted-foreground text-sm italic">
                  No logs for today yet.
               </div>
             )}
          </div>
        </section>
      </div>
    </Shell>
  );
}