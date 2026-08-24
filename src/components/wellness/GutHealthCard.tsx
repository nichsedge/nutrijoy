'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Plus, Trash2, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { PROBIOTIC_PRESETS, calculateGutScore, getTodayFiber, getGutSkinInsight } from '@/lib/gutHealth';
import { ProbioticLogEntry, SkinCondition } from '@/lib/types';
import { playChime } from '@/lib/soundEffects';

export function GutHealthCard() {
  const { state } = useApp();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [probioticLogs, setProbioticLogs] = useState<ProbioticLogEntry[]>([]);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nutrijoy_probiotic_logs');
      if (saved) setProbioticLogs(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = today + 86400000;
  const todaysProbiotics = probioticLogs.filter((l) => l.timestamp >= today && l.timestamp < tomorrow);
  const probioticServings = todaysProbiotics.reduce((s, l) => s + l.servings, 0);

  // Fiber from food logs
  const fiberG = getTodayFiber(state.foodLogs || [], today, tomorrow);

  const score = calculateGutScore(fiberG, probioticServings);

  // Gut-skin correlation
  const lastWeekSkins: SkinCondition[] = (state.cycleLogs || [])
    .filter((l) => l.timestamp >= today - 7 * 86400000 && l.skinCondition)
    .map((l) => l.skinCondition!);
  const breakoutDays = lastWeekSkins.filter((c) => c === 'breakout').length;
  const gutInsight = getGutSkinInsight(
    score.total,
    breakoutDays,
    lastWeekSkins.length,
    state.profile?.language || 'en'
  );

  const handleAddProbiotic = (preset: (typeof PROBIOTIC_PRESETS)[0]) => {
    const entry: ProbioticLogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      foodName: preset.name,
      foodNameId: preset.nameId,
      icon: preset.icon,
      servings: 1,
    };
    const updated = [entry, ...probioticLogs];
    setProbioticLogs(updated);
    try {
      localStorage.setItem('nutrijoy_probiotic_logs', JSON.stringify(updated));
    } catch {
      /* ignore */
    }

    playChime();
    toast({
      title: `${preset.icon} ${isId ? preset.nameId : preset.name}`,
      description: isId ? preset.benefitId : preset.benefit,
    });
    setShowPresets(false);
  };

  const handleDelete = (id: string) => {
    const updated = probioticLogs.filter((l) => l.id !== id);
    setProbioticLogs(updated);
    try {
      localStorage.setItem('nutrijoy_probiotic_logs', JSON.stringify(updated));
    } catch {
      /* ignore */
    }
  };

  const fiberBarW = Math.min(score.fiberPercent, 100);
  const probioticBarW = Math.min((probioticServings / 2) * 100, 100);

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 rounded-[2rem] border border-emerald-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 font-black">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">{t.gutHealth || 'Gut-Skin Axis'}</p>
              <p className="text-[10px] text-muted-foreground font-bold">
                {t.gutHealthDesc || 'Fiber & probiotic nutrition'}
              </p>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-full border text-[10px] font-black ${score.colorClass}`}>
            {score.total}%
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          {/* Fiber */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-black text-foreground/80">
              <span>{t.fiberProgress || 'Daily Fiber'}</span>
              <span className={fiberG >= 25 ? 'text-emerald-600' : 'text-amber-600'}>
                {fiberG.toFixed(1)}g / {score.fiberTarget}g
              </span>
            </div>
            <div className="h-2.5 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
                style={{ width: `${fiberBarW}%` }}
              />
            </div>
          </div>

          {/* Probiotics */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-black text-foreground/80">
              <span>{t.probioticServings || 'Probiotic Servings'}</span>
              <span className={probioticServings >= 2 ? 'text-emerald-600' : 'text-amber-600'}>
                {probioticServings} / {score.probioticTarget}
              </span>
            </div>
            <div className="h-2.5 bg-emerald-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-700"
                style={{ width: `${probioticBarW}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status Tip */}
        <div className={`p-3 rounded-2xl border text-xs font-bold leading-snug ${score.colorClass}`}>
          {isId ? score.tipId : score.tip}
        </div>

        {/* Gut-Skin insight */}
        {gutInsight && (
          <div className="bg-green-50/80 border border-green-200/60 rounded-2xl p-3 flex items-start gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-green-900 font-bold leading-snug">{gutInsight}</p>
          </div>
        )}

        {/* Probiotic Logger */}
        <div className="space-y-2">
          <Button
            size="sm"
            onClick={() => setShowPresets(!showPresets)}
            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            {t.logProbiotic || 'Add Probiotic'}
          </Button>

          {showPresets && (
            <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
              {PROBIOTIC_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAddProbiotic(p)}
                  className="p-2 rounded-xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/60 text-left flex items-center gap-2 active:scale-95 transition-all"
                >
                  <span className="text-lg">{p.icon}</span>
                  <div className="truncate min-w-0">
                    <p className="text-[11px] font-bold text-emerald-950 truncate">{isId ? p.nameId : p.name}</p>
                    <p className="text-[9px] text-emerald-700 font-bold">
                      {p.isPrebiotic ? (isId ? 'Prebiotik' : 'Prebiotic') : isId ? 'Probiotik' : 'Probiotic'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Today's logged probiotics */}
          {todaysProbiotics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {todaysProbiotics.map((l) => (
                <div
                  key={l.id}
                  className="bg-white px-2.5 py-1 rounded-full border border-emerald-200 text-[11px] font-bold text-emerald-900 flex items-center gap-1.5"
                >
                  <span>{l.icon}</span>
                  <span>{isId ? l.foodNameId : l.foodName}</span>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
