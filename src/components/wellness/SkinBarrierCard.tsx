'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, AlertCircle, Sparkles, Check, ChevronDown, ChevronUp, Droplets } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { calculateSkinBarrierScore, BARRIER_RESCUE_STEPS } from '@/lib/skinBarrier';
import { playChime, playSuccessChord } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';

export function SkinBarrierCard() {
  const { state } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [showRescuePlan, setShowRescuePlan] = useState(false);
  const [acHours, setAcHours] = useState(2);
  const [rescueChecks, setRescueChecks] = useState<Record<number, boolean>>({});

  // Compute today's nutrients from food & water logs
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = today + 86400000;

  const todayFoods = useMemo(
    () => (state.foodLogs || []).filter((l) => l.timestamp >= today && l.timestamp < tomorrow),
    [state.foodLogs, today, tomorrow]
  );

  const todayWater = useMemo(
    () =>
      (state.waterLogs || [])
        .filter((l) => l.timestamp >= today && l.timestamp < tomorrow)
        .reduce((sum, l) => sum + l.amountMl, 0),
    [state.waterLogs, today, tomorrow]
  );

  const omega3Total = todayFoods.reduce((s, f) => s + (f.omega3 ?? 0), 0);
  const vitETotal = todayFoods.reduce((s, f) => s + (f.vitaminE ?? 0), 0);

  const barrierScore = calculateSkinBarrierScore(omega3Total, vitETotal, todayWater, true, acHours);

  const toggleRescueStep = (stepIdx: number) => {
    playChime();
    setRescueChecks((prev) => {
      const next = { ...prev, [stepIdx]: !prev[stepIdx] };
      const allDone = BARRIER_RESCUE_STEPS.every((_, i) => next[i]);
      if (allDone) {
        playSuccessChord();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
      return next;
    });
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDash = (barrierScore.score / 100) * circumference;

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-emerald-500/10 rounded-[2rem] border border-teal-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-800 font-black">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">{t.skinBarrier || 'Skin Barrier Resilience'}</p>
              <p className="text-[10px] text-muted-foreground font-bold">
                {isId ? 'Ketahanan lipid & perlindungan TEWL' : 'Stratum corneum lipid protection'}
              </p>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-full border text-[10px] font-black ${barrierScore.colorClass}`}>
            {barrierScore.score}%
          </div>
        </div>

        {/* Circular Gauge & Status */}
        <div className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl border border-teal-100/80 shadow-2xs">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90">
              <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(20,184,166,0.12)" strokeWidth="8" />
              <circle
                cx="45"
                cy="45"
                r="40"
                fill="none"
                stroke={
                  barrierScore.score >= 80
                    ? '#10b981'
                    : barrierScore.score >= 55
                      ? '#06b6d4'
                      : barrierScore.score >= 35
                        ? '#f59e0b'
                        : '#f43f5e'
                }
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${strokeDash} ${circumference}`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-foreground">{barrierScore.score}</span>
              <span className="text-[8px] font-black text-muted-foreground uppercase">/100</span>
            </div>
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <h4 className="text-xs font-black text-foreground truncate">
              {isId ? barrierScore.labelId : barrierScore.labelEn}
            </h4>
            <p className="text-[10px] text-teal-700 font-bold">TEWL: {barrierScore.tewlLevel}</p>
            <p className="text-[11px] text-muted-foreground leading-snug">
              {isId ? barrierScore.tipId : barrierScore.tipEn}
            </p>
          </div>
        </div>

        {/* AC / Dry Air Slider */}
        <div className="bg-white/70 p-3 rounded-2xl border border-teal-100 flex items-center justify-between text-xs font-bold text-teal-900">
          <span>{isId ? 'Paparan AC / Udara Kering:' : 'AC / Dry Air Exposure:'}</span>
          <div className="flex gap-1">
            {[0, 4, 8, 12].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => {
                  setAcHours(h);
                  playChime();
                }}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  acHours === h
                    ? 'bg-teal-600 text-white'
                    : 'bg-white border border-teal-200 text-teal-800 hover:bg-teal-50'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Barrier Rescue Mode Toggle */}
        <div className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowRescuePlan(!showRescuePlan)}
            className="w-full h-8 rounded-full border-teal-200 text-teal-700 text-xs font-bold hover:bg-teal-50"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            {t.barrierRescueMode || 'Barrier Rescue Mode (48h Protocol)'}
            {showRescuePlan ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </Button>

          {showRescuePlan && (
            <div className="bg-white p-3.5 rounded-2xl border border-teal-200 shadow-2xs space-y-2.5 animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] font-black uppercase tracking-wider text-teal-800">
                {isId ? 'Protokol Pemulihan Lapisan Lipid:' : 'Lipid Bilayer Restoration Protocol:'}
              </p>
              {BARRIER_RESCUE_STEPS.map((s, idx) => {
                const isChecked = rescueChecks[idx];
                return (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => toggleRescueStep(idx)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all active:scale-[0.99] ${
                      isChecked ? 'bg-teal-50/80 border-teal-300' : 'bg-white border-teal-100 hover:bg-teal-50/40'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked ? 'bg-teal-600 text-white' : 'border border-muted-foreground/40'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p
                        className={`text-xs font-bold ${isChecked ? 'text-teal-950 line-through opacity-80' : 'text-foreground'}`}
                      >
                        {isId ? s.titleId : s.titleEn}
                      </p>
                      <p className="text-[10px] text-muted-foreground leading-snug">{isId ? s.descId : s.descEn}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
