"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Footprints, Play, Pause, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { GLUCOSE_SEQUENCING_STEPS, getGlucoseSequenceScore } from '@/lib/glucoseCoach';
import { PlateSequenceCheck } from '@/lib/types';
import { playChime, playSuccessChord } from '@/lib/soundEffects';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export function GlucoseCoachCard() {
  const { state } = useApp();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  // Checklist state
  const [checklist, setChecklist] = useState<PlateSequenceCheck>({
    veggiesFirst: false,
    proteinSecond: false,
    carbsLast: false
  });

  // Post-meal walk timer state (10 mins = 600s)
  const WALK_DURATION_SEC = 600;
  const [walkSecondsLeft, setWalkSecondsLeft] = useState(WALK_DURATION_SEC);
  const [isWalkRunning, setIsWalkRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scoreInfo = getGlucoseSequenceScore(checklist);

  const toggleCheck = (key: keyof PlateSequenceCheck) => {
    playChime();
    setChecklist(prev => {
      const next = { ...prev, [key]: !prev[key] };
      const allDone = next.veggiesFirst && next.proteinSecond && next.carbsLast;
      if (allDone) {
        playSuccessChord();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        toast({
          title: "✨ " + (isId ? "Urutan Makan Sempurna!" : "Anti-Glycation Master!"),
          description: isId ? "Kolagen kulit terlindungi dari lonjakan gula darah." : "Collagen protected from sugar-spike glycation."
        });
      }
      return next;
    });
  };

  // Walk timer loop
  useEffect(() => {
    if (!isWalkRunning) return;

    timerRef.current = setInterval(() => {
      setWalkSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsWalkRunning(false);
          playSuccessChord();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
          toast({
            title: isId ? "🚶‍♀️ Jalan Pasca Makan Selesai!" : "🚶‍♀️ Post-Meal Walk Complete!",
            description: isId ? "Glukosa telah diserap langsung ke sel otot tanpa lonjakan insulin." : "Muscles cleared postprandial glucose with zero insulin spike."
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isWalkRunning, isId, toast]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const walkPercent = ((WALK_DURATION_SEC - walkSecondsLeft) / WALK_DURATION_SEC) * 100;

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-sky-500/10 rounded-[2rem] border border-teal-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-800 font-black">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">{t.glucoseCoach || 'Food Sequencing & Anti-Glycation'}</p>
              <p className="text-[10px] text-muted-foreground font-bold">
                {isId ? 'Lindungi kolagen dari lonjakan gula' : 'Protect collagen from glucose spikes'}
              </p>
            </div>
          </div>

          <div className={`px-2.5 py-1 rounded-full border text-[10px] font-black ${scoreInfo.color}`}>
            {scoreInfo.score}%
          </div>
        </div>

        {/* 3-Step Meal Sequencing Checklist */}
        <div className="space-y-2">
          {GLUCOSE_SEQUENCING_STEPS.map((s, idx) => {
            const key = idx === 0 ? 'veggiesFirst' : idx === 1 ? 'proteinSecond' : 'carbsLast';
            const isChecked = checklist[key as keyof PlateSequenceCheck];

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => toggleCheck(key as keyof PlateSequenceCheck)}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start gap-3 active:scale-[0.99] ${
                  isChecked
                    ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs'
                    : 'bg-white/80 border-teal-100 hover:border-teal-300 shadow-2xs'
                }`}
              >
                <div className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  isChecked ? 'bg-emerald-600 text-white' : 'border-2 border-muted-foreground/30'
                }`}>
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{s.icon}</span>
                    <p className={`text-xs font-black ${isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-foreground'}`}>
                      {isId ? s.titleId : s.title}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {isId ? s.descId : s.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Benefit Callout */}
        <div className={`p-3 rounded-2xl border text-xs font-bold leading-snug ${scoreInfo.color}`}>
          {isId ? scoreInfo.benefitId : scoreInfo.benefit}
        </div>

        {/* 10-Minute Post-Meal Walk Timer */}
        <div className="bg-white/90 p-4 rounded-2xl border border-teal-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-teal-600" />
              <div>
                <h4 className="text-xs font-black text-teal-950">
                  {t.postMealWalk || '10-Min Post-Meal Glow Walk'}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  {isId ? 'Gerakan ringan untuk meredam insulin pasca makan' : 'Clears postprandial glucose without insulin spikes'}
                </p>
              </div>
            </div>
            <span className="text-sm font-black font-mono text-teal-800">
              {formatTimer(walkSecondsLeft)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-teal-100/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${walkPercent}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                playChime();
                setIsWalkRunning(!isWalkRunning);
              }}
              className="flex-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs h-8 shadow-xs"
            >
              {isWalkRunning ? (
                <><Pause className="w-3.5 h-3.5 mr-1" /> {isId ? 'Jeda' : 'Pause'}</>
              ) : (
                <><Play className="w-3.5 h-3.5 mr-1" /> {walkSecondsLeft === WALK_DURATION_SEC ? (isId ? 'Mulai Jalan' : 'Start Walk') : (isId ? 'Lanjutkan' : 'Resume')}</>
              )}
            </Button>

            {walkSecondsLeft < WALK_DURATION_SEC && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsWalkRunning(false);
                  setWalkSecondsLeft(WALK_DURATION_SEC);
                }}
                className="rounded-xl border-teal-200 text-teal-700 font-bold text-xs h-8 px-3"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
