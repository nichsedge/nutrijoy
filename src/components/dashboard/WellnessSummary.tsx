"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Sparkles, RefreshCcw, CheckCircle2, Circle } from 'lucide-react';
import { useApp } from '../AppContext';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function WellnessSummary() {
  const { state } = useApp();
  
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today).setHours(24, 0, 0, 0);
  
  const hasSleep = state.sleepLogs?.some(s => s.timestamp >= today && s.timestamp < tomorrow);
  const hasCycle = state.cycleLogs?.some(c => c.timestamp >= today && c.timestamp < tomorrow);
  const hasSelfCare = state.selfCareLogs?.some(sc => sc.timestamp >= today && sc.timestamp < tomorrow);

  const rituals = [
    { label: "Sleep", completed: hasSleep, icon: <Moon className="w-4 h-4" /> },
    { label: "Cycle", completed: hasCycle, icon: <RefreshCcw className="w-4 h-4" /> },
    { label: "Care", completed: hasSelfCare, icon: <Sparkles className="w-4 h-4" /> },
  ];

  const completedCount = rituals.filter(r => r.completed).length;

  return (
    <Link href="/check-in" className="block group">
      <Card className="border-none bg-white shadow-sm hover:shadow-md transition-all overflow-hidden rounded-[2rem]">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70 flex items-center gap-2">
              Wellness Ritual
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {completedCount}/3
              </span>
            </h3>
            <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {rituals.map((r, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border",
                  r.completed 
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-inner" 
                    : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
                )}
              >
                {r.icon}
                <span className="text-[10px] font-black uppercase tracking-tighter">{r.label}</span>
                {r.completed ? (
                   <CheckCircle2 className="w-3 h-3" />
                ) : (
                   <Circle className="w-3 h-3" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
