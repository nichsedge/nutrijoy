'use client';

import React from 'react';
import { useAppState, useAppActions } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Utensils,
  Activity,
  ChevronLeft,
  Trash2,
  Droplets,
  Sparkles,
  Moon,
  Ruler,
  Dna,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import type { HistoryLogEntry } from '@/lib/types';
import { RadianceShareCard } from '@/components/dashboard/RadianceShareCard';
import { MonthlyReportCard } from '@/components/dashboard/MonthlyReportCard';

function getLogDetail(log: HistoryLogEntry): string {
  switch (log.type) {
    case 'food':
      return log.quantity;
    case 'activity':
      return `${log.duration} mins`;
    case 'water':
      return `${log.amountMl}ml`;
    case 'sleep':
      return `${log.durationHours} hrs`;
    case 'cycle':
      return `Day ${log.cycleDay}`;
    case 'selfCare':
      return `${log.checkedItems.length} items`;
    case 'measurement':
      return `${log.weight} kg`;
  }
}

function getLogKcal(log: HistoryLogEntry): string {
  if (log.type === 'food') return `+${log.calories} kcal`;
  if (log.type === 'activity') return `-${log.caloriesBurned} kcal`;
  if (log.type === 'measurement') return `${log.weight}kg`;
  return '';
}

export default function HistoryPage() {
  const state = useAppState();
  const {
    removeFoodLog,
    removeActivity,
    removeWaterLog,
    removeSleepLog,
    removeCycleLog,
    removeSelfCareLog,
    removeMeasurement,
  } = useAppActions();
  const t = getTranslation(state.profile?.language || 'en');

  const allLogs: HistoryLogEntry[] = [
    ...state.foodLogs.map((log) => ({ ...log, type: 'food' as const })),
    ...state.activities.map((act) => ({ ...act, type: 'activity' as const })),
    ...(state.waterLogs || []).map((w) => ({ ...w, type: 'water' as const, name: t.water })),
    ...(state.sleepLogs || []).map((s) => ({ ...s, type: 'sleep' as const, name: t.sleep })),
    ...(state.cycleLogs || []).map((c) => ({ ...c, type: 'cycle' as const, name: t.cycle })),
    ...(state.selfCareLogs || []).map((sc) => ({ ...sc, type: 'selfCare' as const, name: t.selfCare })),
    ...(state.measurements || []).map((m) => ({ ...m, type: 'measurement' as const, name: t.measurements })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  const handleRemoveLog = (id: string, type: HistoryLogEntry['type']) => {
    switch (type) {
      case 'food':
        removeFoodLog(id);
        break;
      case 'activity':
        removeActivity(id);
        break;
      case 'water':
        removeWaterLog(id);
        break;
      case 'sleep':
        removeSleepLog(id);
        break;
      case 'cycle':
        removeCycleLog(id);
        break;
      case 'selfCare':
        removeSelfCareLog(id);
        break;
      case 'measurement':
        removeMeasurement(id);
        break;
    }
  };

  const groupedLogs: Record<string, HistoryLogEntry[]> = {};
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  allLogs.forEach((log) => {
    const date = dateFormatter.format(new Date(log.timestamp));
    if (!groupedLogs[date]) {
      groupedLogs[date] = [];
    }
    groupedLogs[date].push(log);
  });

  // Compute skin condition correlations
  const skinLogs = (state.cycleLogs || []).filter((c) => !!c.skinCondition);
  const totalSkinLogs = skinLogs.length;
  const radiantOrClearLogs = skinLogs.filter((c) => c.skinCondition === 'radiant' || c.skinCondition === 'clear');
  const radiantPct = totalSkinLogs > 0 ? Math.round((radiantOrClearLogs.length / totalSkinLogs) * 100) : 0;

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

        {/* Skin Health & Habit Correlator Widget */}
        <Card className="border-none shadow-sm bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 rounded-[2rem] border border-pink-500/15 overflow-hidden">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-black">
                <div className="w-7 h-7 rounded-xl bg-rose-500/15 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                </div>
                <span className="text-xs uppercase tracking-wider">
                  {t.skinCorrelatorTitle || 'Skin Health & Habit Insights'}
                </span>
              </div>
              {totalSkinLogs > 0 && (
                <span className="text-xs font-black bg-rose-500 text-white px-2.5 py-0.5 rounded-full">
                  {radiantPct}% Radiant
                </span>
              )}
            </div>

            {totalSkinLogs > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-foreground/85 leading-relaxed font-medium">
                  {radiantPct >= 70
                    ? state.profile?.language === 'id'
                      ? `Luar biasa! Kulitmu berstatus Bercahaya / Bersih pada ${radiantPct}% hari pencatatan. Hidrasi dan nutrisi antioksidanmu sangat efektif mendukung barrier kulit.`
                      : `Outstanding! Your skin was Radiant or Clear on ${radiantPct}% of logged days. High hydration and antioxidant consistency are effectively supporting your barrier.`
                    : state.profile?.language === 'id'
                      ? `Pola pencatatan menunjukkan hidrasi \(\ge 2000\)ml dan tidur cukup sangat berkorelasi langsung dengan berkurangnya kemerahan dan sembap.`
                      : `Data shows that days with \(\ge 2000\)ml water and \(\ge 7\)h sleep directly correlate with lower facial puffiness and faster breakout clearing.`}
                </p>
                <div className="flex gap-1.5 flex-wrap pt-1">
                  {skinLogs.slice(0, 5).map((log) => (
                    <span
                      key={log.id}
                      className="text-[10px] font-bold bg-white/80 border border-rose-100 text-rose-800 px-2 py-0.5 rounded-full shadow-2xs"
                    >
                      Day {log.cycleDay}: {log.skinCondition}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {state.profile?.language === 'id'
                  ? 'Catat kondisi kulitmu (Bercahaya, Bersih, Sembap, Jerawat) di Ritual Harian untuk melihat korelasi otomatis dengan pola makan, hidrasi, dan tidurmu.'
                  : 'Tag your daily skin state (Radiant, Clear, Puffy, Breakout) in the Daily Ritual check-in to unlock automated correlation insights with hydration, sleep, and meals.'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* 📊 Monthly Transformation Report */}
        <MonthlyReportCard />

        {/* Weekly Radiance Summary Share Card */}
        <RadianceShareCard />

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
                    <Card
                      key={log.id}
                      className="border-none shadow-sm rounded-3xl overflow-hidden active:bg-accent/5 transition-all"
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              log.type === 'food'
                                ? 'bg-primary/10 text-primary'
                                : log.type === 'activity'
                                  ? 'bg-secondary/10 text-secondary'
                                  : log.type === 'water'
                                    ? 'bg-blue-500/10 text-blue-500'
                                    : log.type === 'sleep'
                                      ? 'bg-indigo-500/10 text-indigo-500'
                                      : log.type === 'cycle'
                                        ? 'bg-rose-500/10 text-rose-500'
                                        : log.type === 'selfCare'
                                          ? 'bg-emerald-500/10 text-emerald-500'
                                          : 'bg-orange-500/10 text-orange-500'
                            }`}
                          >
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
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                              {getLogDetail(log)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p
                              className={`font-black text-sm ${
                                log.type === 'food'
                                  ? 'text-primary'
                                  : log.type === 'activity'
                                    ? 'text-secondary'
                                    : log.type === 'water'
                                      ? 'text-blue-500'
                                      : 'text-muted-foreground'
                              }`}
                            >
                              {getLogKcal(log)}
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
