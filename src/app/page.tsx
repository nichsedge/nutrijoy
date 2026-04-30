"use client";

import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { DailyProgress } from '@/components/dashboard/DailyProgress';
import { getTranslation } from '@/lib/translations';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Utensils, Activity, ArrowRight, Trash2 } from 'lucide-react';
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
          <h2 className="text-xl font-bold">Hi, {state.profile.name}!</h2>
          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold border border-secondary/30">
            {state.profile.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <DailyProgress />


        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">{t.logs}</h3>
            <Link href="/history" className="text-xs text-primary font-bold flex items-center gap-1">
              {t.history.toUpperCase()} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
             {[
               ...state.foodLogs.map(log => ({ ...log, type: 'food' as const })),
               ...state.activities.map(act => ({ ...act, type: 'activity' as const }))
             ]
               .sort((a, b) => b.timestamp - a.timestamp)
               .slice(0, 3)
               .map(log => (
                <div key={log.id} className="p-4 rounded-2xl bg-white shadow-sm flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.type === 'food' ? 'bg-accent/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                       {log.type === 'food' ? <Utensils className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                     </div>
                     <div>
                       <p className="text-sm font-bold capitalize">{log.name}</p>
                       <p className="text-xs text-muted-foreground">
                         {log.type === 'food' ? (log as any).quantity : `${(log as any).duration} mins`}
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <p className={`text-sm font-bold ${log.type === 'food' ? 'text-primary' : 'text-secondary'}`}>
                       {log.type === 'food' ? `+${(log as any).calories}` : `-${(log as any).caloriesBurned}`} kcal
                     </p>
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       onClick={() => handleRemoveLog(log.id, log.type)}
                       className="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                        <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                </div>
             ))}
             {state.foodLogs.length === 0 && state.activities.length === 0 && (
               <div className="text-center py-8 text-muted-foreground text-sm italic">
                  {t.noLogs}
               </div>
             )}
          </div>
        </section>
      </div>
    </Shell>
  );
}