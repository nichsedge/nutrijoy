'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { calculateHairNailScore, getPhaseHairTip, HairNailAssessment } from '@/lib/hairNailHealth';
import { getCyclePhase } from '@/lib/cycleSync';
import { playChime } from '@/lib/soundEffects';

export function HairNailVitalityCard() {
  const { state } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessment, setAssessment] = useState<Partial<HairNailAssessment>>({});

  // Load saved assessment
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nutrijoy_hair_assessment');
      if (saved) setAssessment(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  // Current cycle phase
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = today + 86400000;
  const cycleLog = (state.cycleLogs || []).find((l) => l.timestamp >= today && l.timestamp < tomorrow);
  const phaseInfo = getCyclePhase(cycleLog?.cycleDay ?? 1, state.profile?.language || 'en');

  // Today's food nutrition
  const todayFoods = useMemo(
    () => (state.foodLogs || []).filter((l) => l.timestamp >= today && l.timestamp < tomorrow),
    [state.foodLogs, today, tomorrow]
  );

  const totals = useMemo(
    () => ({
      biotin: todayFoods.reduce((s, f) => s + (f.biotin ?? 0), 0),
      zinc: todayFoods.reduce((s, f) => s + (f.zinc ?? 0), 0),
      omega3: todayFoods.reduce((s, f) => s + (f.omega3 ?? 0), 0),
      vitaminE: todayFoods.reduce((s, f) => s + (f.vitaminE ?? 0), 0),
    }),
    [todayFoods]
  );

  const score = useMemo(
    () => calculateHairNailScore(totals.biotin, totals.zinc, totals.omega3, totals.vitaminE),
    [totals]
  );

  const phaseTip = getPhaseHairTip(phaseInfo.phase, state.profile?.language || 'en');

  const nutrients = [
    { label: 'Biotin 🧬', score: score.biotinScore, target: '30mcg', actual: `${totals.biotin.toFixed(0)}mcg` },
    { label: 'Zinc ⚡', score: score.zincScore, target: '8mg', actual: `${totals.zinc.toFixed(1)}mg` },
    { label: 'Omega-3 🐟', score: score.omega3Score, target: '1100mg', actual: `${totals.omega3.toFixed(0)}mg` },
    { label: 'Vit E 🫒', score: score.vitaminEScore, target: '15mg', actual: `${totals.vitaminE.toFixed(1)}mg` },
  ];

  const handleSaveAssessment = (key: keyof HairNailAssessment, val: string) => {
    const updated = { ...assessment, [key]: val, id: crypto.randomUUID(), timestamp: Date.now() };
    setAssessment(updated);
    try {
      localStorage.setItem('nutrijoy_hair_assessment', JSON.stringify(updated));
    } catch {
      /* ignore */
    }
    playChime();
  };

  const assessmentOptions = {
    shedding: [
      { val: 'normal', label: isId ? 'Normal ✅' : 'Normal ✅' },
      { val: 'increased', label: isId ? 'Sedikit Rontok ⚠️' : 'Slightly Increased ⚠️' },
      { val: 'significant', label: isId ? 'Banyak Rontok 🆘' : 'Significant 🆘' },
    ],
    nailCondition: [
      { val: 'strong', label: isId ? 'Kuat & Sehat 💅' : 'Strong & Healthy 💅' },
      { val: 'brittle', label: isId ? 'Rapuh & Mudah Patah ⚠️' : 'Brittle & Breaking ⚠️' },
      { val: 'ridged', label: isId ? 'Ada Alur/Garis 🔍' : 'Ridged/Lined 🔍' },
    ],
    scalpCondition: [
      { val: 'healthy', label: isId ? 'Sehat & Nyaman ✅' : 'Healthy & Comfortable ✅' },
      { val: 'dry', label: isId ? 'Kering & Ketombe ❄️' : 'Dry & Flaky ❄️' },
      { val: 'oily', label: isId ? 'Berminyak 💦' : 'Oily 💦' },
      { val: 'irritated', label: isId ? 'Gatal/Iritasi 🔥' : 'Itchy/Irritated 🔥' },
    ],
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-violet-500/10 via-pink-500/5 to-rose-500/10 rounded-[2rem] border border-violet-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-violet-700 font-black">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">{t.hairNailVitality || 'Hair & Nail Vitality'}</p>
              <p className="text-[10px] text-muted-foreground font-bold">{phaseInfo.phaseName} phase</p>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full border text-[10px] font-black ${score.colorClass}`}>
            {score.total}%
          </div>
        </div>

        {/* Nutrient micro bars */}
        <div className="grid grid-cols-2 gap-2.5">
          {nutrients.map((n) => (
            <div key={n.label} className="bg-white/80 p-2.5 rounded-2xl border border-violet-100 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-foreground/80 truncate">{n.label}</span>
                <span className={`text-[10px] font-black ${n.score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {n.actual}
                </span>
              </div>
              <div className="h-1.5 bg-violet-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-400 to-violet-600 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(n.score, 100)}%` }}
                />
              </div>
              <p className="text-[9px] text-muted-foreground">Target: {n.target}</p>
            </div>
          ))}
        </div>

        {/* Score tip */}
        <div className={`p-3 rounded-2xl border text-[11px] font-bold leading-snug ${score.colorClass}`}>
          {isId ? score.tipId : score.tip}
        </div>

        {/* Phase tip */}
        <div className="bg-violet-50/80 border border-violet-200/60 rounded-2xl p-3 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-violet-900 font-bold leading-snug">{phaseTip}</p>
        </div>

        {/* Weekly Assessment Toggle */}
        <button
          type="button"
          onClick={() => setShowAssessment((v) => !v)}
          className="w-full flex items-center justify-between text-violet-700 text-xs font-black py-1 hover:opacity-80 transition-opacity"
        >
          <span>{t.weeklyAssessment || 'Weekly Self-Assessment'}</span>
          {showAssessment ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAssessment && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            {[
              {
                key: 'shedding' as const,
                label: t.hairShedding || 'Hair Shedding',
                options: assessmentOptions.shedding,
              },
              {
                key: 'nailCondition' as const,
                label: t.nailCondition || 'Nail Condition',
                options: assessmentOptions.nailCondition,
              },
              {
                key: 'scalpCondition' as const,
                label: t.scalpHealth || 'Scalp Health',
                options: assessmentOptions.scalpCondition,
              },
            ].map(({ key, label, options }) => (
              <div key={key} className="space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {options.map((o) => (
                    <button
                      key={o.val}
                      type="button"
                      onClick={() => handleSaveAssessment(key, o.val)}
                      className={`px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all active:scale-95 ${
                        assessment[key] === o.val
                          ? 'bg-violet-600 border-violet-600 text-white'
                          : 'bg-white border-violet-200 text-violet-800 hover:border-violet-400'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
