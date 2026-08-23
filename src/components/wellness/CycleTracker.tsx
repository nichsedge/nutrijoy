"use client";

import React, { useState } from 'react';
import { useAppState, useAppActions } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { getCyclePhase } from '@/lib/cycleSync';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Flower2, Sparkles, Utensils, Dumbbell, ChevronDown, ChevronUp, ShieldCheck, Heart } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { SkinCondition } from '@/lib/types';

export function CycleTracker() {
  const state = useAppState();
  const { addCycleLog } = useAppActions();
  const t = getTranslation(state.profile?.language || 'en');

  const [day, setDay] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedSkinCondition, setSelectedSkinCondition] = useState<SkinCondition | undefined>(undefined);
  const [showPhaseGuide, setShowPhaseGuide] = useState(true);

  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today).setHours(24, 0, 0, 0);
  const todaysLog = state.cycleLogs?.find(s => s.timestamp >= today && s.timestamp < tomorrow);

  const activeCycleDay = todaysLog?.cycleDay || day;
  const phaseInfo = getCyclePhase(activeCycleDay, state.profile?.language || 'en');

  const symptomList = [
    { id: 'bloating', label: t.bloating },
    { id: 'cramps', label: t.cramps },
    { id: 'acne', label: t.acne },
    { id: 'moodSwings', label: t.moodSwings },
    { id: 'fatigue', label: t.fatigue },
  ];

  const skinConditions: { id: SkinCondition; label: string; emoji: string }[] = [
    { id: 'radiant', label: t.skinRadiant || 'Radiant ✨', emoji: '✨' },
    { id: 'clear', label: t.skinClear || 'Clear 🌿', emoji: '🌿' },
    { id: 'dry', label: t.skinDry || 'Dry 💧', emoji: '💧' },
    { id: 'breakout', label: t.skinBreakout || 'Breakout 🫧', emoji: '🫧' },
    { id: 'puffy', label: t.skinPuffy || 'Puffy 🧊', emoji: '🧊' },
  ];

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleLogCycle = () => {
    addCycleLog({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      cycleDay: day,
      symptoms: selectedSymptoms,
      skinCondition: selectedSkinCondition
    });
  };

  if (state.profile?.sex !== 'female') return null;

  return (
    <div className="space-y-4">
      {todaysLog ? (
        <Card className="border-none shadow-sm bg-rose-500/10 border-2 border-rose-500/20 rounded-[2rem]">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center shadow-xs">
                  <Flower2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{t.cycle}</p>
                    <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full">
                      {phaseInfo.phaseName}
                    </span>
                  </div>
                  <p className="text-base font-black">{t.cycleDay} {todaysLog.cycleDay} <span className="text-xs font-normal opacity-60">({phaseInfo.daysRange})</span></p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 justify-end max-w-[130px]">
                {todaysLog.skinCondition && (
                  <span className="text-[10px] font-black bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">
                    {skinConditions.find(s => s.id === todaysLog.skinCondition)?.emoji} {todaysLog.skinCondition}
                  </span>
                )}
                {todaysLog.symptoms.slice(0, 2).map(s => (
                  <span key={s} className="text-[9px] font-bold bg-rose-500/20 text-rose-600 px-1.5 py-0.5 rounded-full">
                    {symptomList.find(sl => sl.id === s)?.label || s}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-sm bg-rose-500/5 rounded-[2rem] border border-rose-500/10">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between text-rose-500 font-bold">
              <div className="flex items-center gap-2">
                <Flower2 className="w-5 h-5" />
                <span className="text-sm uppercase tracking-tighter">{t.cycle}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-rose-500/10 px-2.5 py-1 rounded-full text-rose-600">
                {phaseInfo.phaseName}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-bold">{t.cycleDay}</p>
                  <Input 
                    type="number" 
                    value={day} 
                    min={1}
                    max={45}
                    onChange={(e) => setDay(Math.max(1, parseInt(e.target.value) || 1))}
                    className="rounded-xl border-rose-100 focus-visible:ring-rose-500 bg-white"
                  />
                </div>
              </div>

              {/* Skin Condition Tagging */}
              <div className="space-y-2">
                <p className="text-xs font-bold flex items-center gap-1.5 text-rose-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.skinCondition || 'Skin State Today'}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skinConditions.map(sc => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setSelectedSkinCondition(prev => prev === sc.id ? undefined : sc.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedSkinCondition === sc.id ? 'bg-rose-500 border-rose-500 text-white shadow-sm' : 'bg-white border-rose-100 text-rose-600 hover:border-rose-300'}`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold">{t.symptoms}</p>
                <div className="flex flex-wrap gap-1.5">
                  {symptomList.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSymptom(s.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedSymptoms.includes(s.id) ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'bg-white border-rose-100 text-rose-400 hover:border-rose-300'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleLogCycle} 
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-5 rounded-2xl shadow-lg shadow-rose-500/20"
              >
                {t.logCycle}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cycle Phase Guidance Card */}
      <Card className="border-none shadow-sm bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-purple-500/5 rounded-[2rem] border border-rose-500/15 overflow-hidden">
        <Collapsible open={showPhaseGuide} onOpenChange={setShowPhaseGuide}>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 font-black text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>{t.cycleSyncTitle || 'Hormone & Phase Wisdom'}</span>
              </div>
              <CollapsibleTrigger asChild>
                <button className="p-1 hover:bg-white/60 rounded-full transition-colors">
                  {showPhaseGuide ? <ChevronUp className="w-4 h-4 text-rose-500" /> : <ChevronDown className="w-4 h-4 text-rose-500" />}
                </button>
              </CollapsibleTrigger>
            </div>

            <p className="text-xs font-medium text-foreground/80 leading-relaxed">
              {phaseInfo.summary}
            </p>

            <CollapsibleContent className="space-y-3 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="bg-white/80 p-3 rounded-xl border border-rose-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                    <Utensils className="w-3.5 h-3.5" />
                    <span>{t.nutritionForPhase || 'Phase Nutrition'}</span>
                  </div>
                  <ul className="text-[11px] text-muted-foreground space-y-1 list-disc pl-4">
                    {phaseInfo.nutritionAdvice.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-rose-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600">
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>{t.workoutForPhase || 'Phase Movement'}</span>
                  </div>
                  <ul className="text-[11px] text-muted-foreground space-y-1 list-disc pl-4">
                    {phaseInfo.workoutAdvice.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/15 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-rose-700">{t.skinForPhase || 'Skin & Glow Focus'}</p>
                  <p className="text-[11px] text-rose-900/80 leading-snug">{phaseInfo.skinAdvice}</p>
                </div>
              </div>
            </CollapsibleContent>
          </CardContent>
        </Collapsible>
      </Card>
    </div>
  );
}