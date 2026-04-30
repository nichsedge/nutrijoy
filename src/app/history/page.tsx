"use client";

import React from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Utensils, Activity, ChevronLeft, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { state, removeFoodLog, removeActivity } = useApp();
  const t = getTranslation(state.profile?.language || 'en');

  const allLogs = [
    ...state.foodLogs.map(log => ({ ...log, type: 'food' as const })),
    ...state.activities.map(act => ({ ...act, type: 'activity' as const }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  const handleRemoveLog = (id: string, type: 'food' | 'activity') => {
    if (type === 'food') {
      removeFoodLog(id);
    } else {
      removeActivity(id);
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
            <h2 className="text-2xl font-black tracking-tight">{t.history}</h2>
            <p className="text-sm text-muted-foreground">{t.allHistory}</p>
          </div>
        </div>

        {Object.keys(groupedLogs).length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-muted-foreground/20">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-lg font-bold text-muted-foreground">{t.noHistory}</p>
            <p className="text-sm text-muted-foreground mb-6">{t.startLogging}</p>
            <div className="flex justify-center gap-4">
              <Button asChild className="rounded-xl">
                <Link href="/food">{t.logFood}</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/activity">{t.logActivity}</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedLogs).map(([date, logs]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">{date}</h3>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <Card key={log.id} className="border-none shadow-sm rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${log.type === 'food' ? 'bg-accent/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                            {log.type === 'food' ? <Utensils className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                          </div>
                          <div>
                            <p className="font-bold text-sm capitalize">{log.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.type === 'food' ? (log as any).quantity : `${(log as any).duration} mins`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`font-black text-sm ${log.type === 'food' ? 'text-primary' : 'text-secondary'}`}>
                              {log.type === 'food' ? `+${(log as any).calories}` : `-${(log as any).caloriesBurned}`} kcal
                            </p>
                            {log.type === 'food' && (log as any).sugar > 0 && (
                              <p className="text-[10px] font-bold text-muted-foreground">Sugar: {(log as any).sugar}g</p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveLog(log.id, log.type)}
                            className="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
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
