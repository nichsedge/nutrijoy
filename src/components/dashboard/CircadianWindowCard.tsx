"use client";

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Utensils, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { getMealTimingAnalysis } from '@/lib/circadian';

export function CircadianWindowCard() {
  const { state } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const analysis = useMemo(() =>
    getMealTimingAnalysis(state.foodLogs || [], 23),
    [state.foodLogs]
  );

  // Timeline visual: 6am = 0%, midnight = 100% (18 hours window = 6am to midnight)
  const START_HOUR = 6;
  const SPAN_HOURS = 18; // 6am to midnight

  const toPercent = (ts: number) => {
    const hour = new Date(ts).getHours() + new Date(ts).getMinutes() / 60;
    return Math.max(0, Math.min(100, ((hour - START_HOUR) / SPAN_HOURS) * 100));
  };

  const firstPct = analysis.firstMealTime ? toPercent(analysis.firstMealTime) : null;
  const lastPct = analysis.lastMealTime ? toPercent(analysis.lastMealTime) : null;

  const hourLabels = ['6am', '9am', '12pm', '3pm', '6pm', '9pm', '12am'];

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-cyan-500/10 rounded-[2rem] border border-sky-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-sky-700 font-black">
          <div className="w-8 h-8 rounded-xl bg-sky-500/15 flex items-center justify-center">
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider">{t.circadianWindow || 'Metabolic Eating Window'}</p>
            <p className="text-[10px] text-muted-foreground font-bold">{t.circadianWindowDesc || 'Optimize meal timing for overnight skin repair'}</p>
          </div>
        </div>

        {/* Timeline visual */}
        <div className="space-y-1.5">
          <div className="relative h-5 bg-slate-100 rounded-full overflow-hidden">
            {/* Optimal window overlay (7am – 8pm) */}
            <div
              className="absolute top-0 bottom-0 bg-emerald-200/40 border-x border-emerald-300/40"
              style={{ left: `${((7 - START_HOUR) / SPAN_HOURS) * 100}%`, width: `${((13) / SPAN_HOURS) * 100}%` }}
            />
            {/* Actual eating window */}
            {firstPct !== null && lastPct !== null && (
              <div
                className={`absolute top-1 bottom-1 rounded-full ${
                  analysis.status === 'optimal' ? 'bg-sky-500' :
                  analysis.status === 'late_eating' ? 'bg-rose-500' :
                  analysis.status === 'extended' ? 'bg-amber-500' : 'bg-sky-400'
                }`}
                style={{ left: `${firstPct}%`, width: `${Math.max(1, lastPct - firstPct)}%` }}
              />
            )}
          </div>
          <div className="flex justify-between text-[9px] text-muted-foreground font-bold px-0.5">
            {hourLabels.map(l => <span key={l}>{l}</span>)}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t.firstMeal || 'First Meal', value: analysis.firstMealLabel },
            { label: t.lastMeal || 'Last Meal', value: analysis.lastMealLabel },
            { label: t.eatingWindow || 'Window', value: analysis.windowHours > 0 ? `${analysis.windowHours}h` : '--' },
          ].map(m => (
            <div key={m.label} className="bg-white/80 p-2.5 rounded-2xl border border-sky-100 text-center space-y-0.5">
              <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{m.label}</p>
              <p className="text-sm font-black text-foreground">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Status Banner */}
        <div className={`p-3 rounded-2xl border flex items-start gap-2.5 ${analysis.colorClass}`}>
          {analysis.status === 'late_eating'
            ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            : analysis.status === 'optimal'
            ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            : <Utensils className="w-4 h-4 shrink-0 mt-0.5" />
          }
          <div className="space-y-0.5 text-xs">
            <p className="font-black">{isId ? analysis.windowLabelId : analysis.windowLabel}</p>
            <p className="leading-snug opacity-90">{isId ? analysis.adviceId : analysis.advice}</p>
          </div>
        </div>

        {/* Optimal window note */}
        <p className="text-[10px] text-muted-foreground font-bold text-center">
          {isId
            ? `Jendela optimal: ${analysis.optimalWindowStart} – ${analysis.optimalWindowEnd}`
            : `Optimal window: ${analysis.optimalWindowStart} – ${analysis.optimalWindowEnd}`}
        </p>
      </CardContent>
    </Card>
  );
}
