"use client";

import React from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Utensils, 
  Activity, 
  ChevronLeft, 
  Calendar, 
  Trash2, 
  Droplets, 
  Sparkles,
  Moon,
  Ruler,
  Dna,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { 
    state, 
    removeFoodLog, 
    removeActivity, 
    removeWaterLog,
    removeSleepLog,
    removeCycleLog,
    removeSelfCareLog,
    removeMeasurement
  } = useApp();
  const t = getTranslation(state.profile?.language || 'en');

  const allLogs = [
    ...state.foodLogs.map(log => ({ ...log, type: 'food' as const })),
    ...state.activities.map(act => ({ ...act, type: 'activity' as const })),
    ...(state.waterLogs || []).map(w => ({ ...w, type: 'water' as const, name: t.water })),
    ...(state.sleepLogs || []).map(s => ({ ...s, type: 'sleep' as const, name: t.sleep })),
    ...(state.cycleLogs || []).map(c => ({ ...c, type: 'cycle' as const, name: t.cycle })),
    ...(state.selfCareLogs || []).map(sc => ({ ...sc, type: 'selfCare' as const, name: t.selfCare })),
    ...(state.measurements || []).map(m => ({ ...m, type: 'measurement' as const, name: t.measurements }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  const handleRemoveLog = (id: string, type: string) => {
    switch (type) {
      case 'food': removeFoodLog(id); break;
      case 'activity': removeActivity(id); break;
      case 'water': removeWaterLog(id); break;
      case 'sleep': removeSleepLog(id); break;
      case 'cycle': removeCycleLog(id); break;
      case 'selfCare': removeSelfCareLog(id); break;
      case 'measurement': removeMeasurement(id); break;
    }
  };

  // Group logs by date
  const groupedLogs: { [date: string]: typeof allLogs } = {};
  allLogs.forEach(log => {
    const date = new Date(log.timestamp).toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!groupedLogs[date]) {
      groupedLogs[date] = [];
    }
    groupedLogs[date].push(log);
  });

  return (
    <Shell>
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-10">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link href="/">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </Button>
          <div className="flex flex-col gap-0">
            <h2 className="text-2xl font-black tracking-tight">{t.journal}</h2>
            <p className="text-sm text-muted-foreground">{t.allHistory}</p>
          </div>
        </div>

        {Object.keys(groupedLogs).length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-muted-foreground/20 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-primary/40">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-muted-foreground">{t.noHistory}</p>
              <p className="text-sm text-muted-foreground mb-6">{t.startLogging}</p>
            </div>
            <Button asChild className="rounded-full px-8">
              <Link href="/">{t.getStarted}</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedLogs).map(([date, logs]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">{date}</h3>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <Card key={log.id} className="border-none shadow-sm rounded-3xl overflow-hidden active:bg-accent/5 transition-all">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            log.type === 'food' ? 'bg-primary/10 text-primary' : 
                            log.type === 'activity' ? 'bg-secondary/10 text-secondary' : 
                            log.type === 'water' ? 'bg-blue-500/10 text-blue-500' :
                            log.type === 'sleep' ? 'bg-indigo-500/10 text-indigo-500' :
                            log.type === 'cycle' ? 'bg-rose-500/10 text-rose-500' :
                            log.type === 'selfCare' ? 'bg-emerald-500/10 text-emerald-500' :
                            'bg-orange-500/10 text-orange-500'
                          }`}>
                            {log.type === 'food' && <Utensils className="w-6 h-6" />}
                            {log.type === 'activity' && <Activity className="w-6 h-6" />}
                            {log.type === 'water' && <Droplets className="w-6 h-6" />}
                            {log.type === 'sleep' && <Moon className="w-6 h-6" />}
                            {log.type === 'cycle' && <Dna className="w-6 h-6" />}
                            {log.type === 'selfCare' && <CheckCircle2 className="w-6 h-6" />}
                            {log.type === 'measurement' && <Ruler className="w-6 h-6" />}
                          </div>
                          <div>
                            <p className="font-bold text-sm capitalize">{log.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {
                                log.type === 'food' ? (log as any).quantity : 
                                log.type === 'activity' ? `${(log as any).duration} mins` : 
                                log.type === 'water' ? `${(log as any).amountMl}ml` :
                                log.type === 'sleep' ? `${(log as any).durationHours} hrs` :
                                log.type === 'cycle' ? `Day ${(log as any).cycleDay}` :
                                log.type === 'selfCare' ? `${(log as any).checkedItems.length} items` :
                                `${(log as any).weight} kg`
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`font-black text-sm ${
                              log.type === 'food' ? 'text-primary' : 
                              log.type === 'activity' ? 'text-secondary' : 
                              log.type === 'water' ? 'text-blue-500' :
                              'text-muted-foreground'
                            }`}>
                              {log.type === 'food' ? `+${(log as any).calories}` : 
                               log.type === 'activity' ? `-${(log as any).caloriesBurned}` : 
                               log.type === 'measurement' ? `${(log as any).weight}kg` :
                               ''} { (log.type === 'food' || log.type === 'activity') && 'kcal' }
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveLog(log.id, log.type)}
                            className="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-opacity"
                          >
                             <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}