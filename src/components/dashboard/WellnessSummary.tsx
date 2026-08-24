'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Sparkles, RefreshCcw, CheckCircle2, Circle } from 'lucide-react';
import { useAppState } from '../AppContext';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

export function WellnessSummary() {
  const state = useAppState();

  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today).setHours(24, 0, 0, 0);

  const hasSleep = state.sleepLogs?.some((s) => s.timestamp >= today && s.timestamp < tomorrow);
  const hasCycle = state.cycleLogs?.some((c) => c.timestamp >= today && c.timestamp < tomorrow);
  const hasSelfCare = state.selfCareLogs?.some((sc) => sc.timestamp >= today && sc.timestamp < tomorrow);

  const rituals = [
    { label: 'Sleep', completed: hasSleep, icon: <Moon className="w-4 h-4" /> },
    { label: 'Cycle', completed: hasCycle, icon: <RefreshCcw className="w-4 h-4" /> },
    { label: 'Care', completed: hasSelfCare, icon: <Sparkles className="w-4 h-4" /> },
  ];

  const completedCount = rituals.filter((r) => r.completed).length;

  return (
    <Link href="/check-in" className="block group">
      <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden rounded-[2.5rem] glass-premium">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/50">Daily Rituals</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground/80">
                  {completedCount === rituals.length
                    ? 'Ultimate Balance!'
                    : `${rituals.length - completedCount} more to go`}
                </p>
                <div className="flex gap-0.5">
                  {[...Array(rituals.length)].map((_, i) => (
                    <div
                      key={i}
                      className={cn('w-1.5 h-1.5 rounded-full', i < completedCount ? 'bg-primary' : 'bg-black/10')}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="relative group/check">
              <div
                className={cn(
                  'w-10 h-10 rounded-2xl shadow-sm flex items-center justify-center transition-all duration-500 border border-white/50',
                  completedCount === rituals.length
                    ? 'bg-primary text-white rotate-12'
                    : 'bg-white group-hover/check:bg-primary/5'
                )}
              >
                <CheckCircle2 className="w-6 h-6" />
              </div>
              {completedCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white animate-pulse" />
              )}
            </div>
          </div>

          <div className="h-1.5 w-full bg-black/5 rounded-full mb-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / rituals.length) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {rituals.map((r, i) => (
              <div
                key={i}
                className={cn(
                  'flex flex-col items-center gap-2.5 p-4 rounded-3xl transition-all duration-500 border',
                  r.completed
                    ? 'bg-white/80 border-emerald-200/50 text-emerald-600 shadow-lg shadow-emerald-500/5 scale-105'
                    : 'bg-black/5 border-transparent text-slate-400 opacity-60'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500',
                    r.completed ? 'bg-emerald-100/50' : 'bg-white/40'
                  )}
                >
                  {r.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{r.label}</span>
                {r.completed ? (
                  <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-current opacity-30" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
