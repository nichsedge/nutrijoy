"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Flame, Sparkles, Play, Pause, RotateCcw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { RESTORATIVE_YOGA_POSES, CRAMP_RELIEF_FOODS } from '@/lib/periodRelief';
import { RestorativeYogaPose } from '@/lib/types';
import { playChime, playSuccessChord, startSolfeggioTone, stopSolfeggioTone } from '@/lib/soundEffects';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export function PeriodReliefCard() {
  const { state } = useApp();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [showYoga, setShowYoga] = useState(false);
  const [activeYogaPose, setActiveYogaPose] = useState<RestorativeYogaPose>(RESTORATIVE_YOGA_POSES[0]);

  // Heat Pack 15-Minute Timer (900 seconds)
  const HEAT_DURATION = 900;
  const [heatSecondsLeft, setHeatSecondsLeft] = useState(HEAT_DURATION);
  const [isHeatRunning, setIsHeatRunning] = useState(false);
  const heatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleToggleHeatTimer = () => {
    if (isHeatRunning) {
      setIsHeatRunning(false);
      stopSolfeggioTone();
    } else {
      setIsHeatRunning(true);
      startSolfeggioTone(432, 0.05); // Play gentle 432Hz ambient sound while resting with heat pack
      playChime();
    }
  };

  useEffect(() => {
    if (!isHeatRunning) return;

    heatTimerRef.current = setInterval(() => {
      setHeatSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(heatTimerRef.current!);
          setIsHeatRunning(false);
          stopSolfeggioTone();
          playSuccessChord();
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
          toast({
            title: isId ? "♨️ Sesi Kompres Hangat Selesai!" : "♨️ Warm Heat Pack Session Complete!",
            description: isId ? "Otot panggul telah rileks dan sirkulasi darah membaik." : "Pelvic muscles relaxed and uterine circulation soothed."
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (heatTimerRef.current) clearInterval(heatTimerRef.current);
    };
  }, [isHeatRunning, isId, toast]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSolfeggioTone();
    };
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const heatPercent = ((HEAT_DURATION - heatSecondsLeft) / HEAT_DURATION) * 100;

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-rose-500/10 via-red-500/5 to-amber-500/10 rounded-[2rem] border border-rose-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-800 font-black">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <span className="text-base">🧸</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">{t.periodSanctuary || 'Gentle Flow Period Sanctuary'}</p>
              <p className="text-[10px] text-muted-foreground font-bold">
                {isId ? 'Pereda kram & kenyamanan tubuh' : 'Cramp relief & restorative comfort'}
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-200">
            {isId ? 'Mode Nyaman' : 'Gentle Mode'}
          </div>
        </div>

        {/* 15-Minute Heat Pack & 432Hz Soundscape Card */}
        <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-rose-950">
                  {t.heatPackTimer || '15-Min Heat Pack & 432Hz Calm'}
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  {isId ? 'Kompres perut bawah + suara frekuensi pereda kram' : 'Warm abdomen compress + 432Hz relaxation tone'}
                </p>
              </div>
            </div>
            <span className="text-sm font-black font-mono text-rose-700">
              {formatTimer(heatSecondsLeft)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-rose-100/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${heatPercent}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleToggleHeatTimer}
              className={`flex-1 rounded-xl font-bold text-xs h-8 shadow-xs ${
                isHeatRunning
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {isHeatRunning ? (
                <><Pause className="w-3.5 h-3.5 mr-1" /> {isId ? 'Jeda Kompres' : 'Pause Session'}</>
              ) : (
                <><Play className="w-3.5 h-3.5 mr-1" /> {heatSecondsLeft === HEAT_DURATION ? (isId ? 'Mulai Kompres Hangat' : 'Start Heat Pack') : (isId ? 'Lanjutkan' : 'Resume')}</>
              )}
            </Button>

            {heatSecondsLeft < HEAT_DURATION && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsHeatRunning(false);
                  stopSolfeggioTone();
                  setHeatSecondsLeft(HEAT_DURATION);
                }}
                className="rounded-xl border-rose-200 text-rose-700 font-bold text-xs h-8 px-3"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Restorative Yoga Poses Collapsible */}
        <div className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowYoga(!showYoga)}
            className="w-full h-8 rounded-full border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-50"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            {t.restorativeYoga || 'Restorative Yoga for Cramps'}
            {showYoga ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </Button>

          {showYoga && (
            <div className="bg-white p-3.5 rounded-2xl border border-rose-200 shadow-2xs space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {RESTORATIVE_YOGA_POSES.map(pose => (
                  <button
                    key={pose.id}
                    type="button"
                    onClick={() => { setActiveYogaPose(pose); playChime(); }}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold shrink-0 transition-all ${
                      activeYogaPose.id === pose.id
                        ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                        : 'bg-white text-rose-900 border-rose-200 hover:bg-rose-50'
                    }`}
                  >
                    {pose.icon} {isId ? pose.nameId.split('(')[0] : pose.name}
                  </button>
                ))}
              </div>

              {/* Active Pose Detail */}
              <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200/80 space-y-1.5">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-black text-rose-950">
                    {isId ? activeYogaPose.nameId : activeYogaPose.name} ({activeYogaPose.sanskrit})
                  </h5>
                  <span className="text-[10px] font-bold text-rose-700">{Math.round(activeYogaPose.durationSec / 60)} min</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {isId ? activeYogaPose.instructionsId : activeYogaPose.instructionsEn}
                </p>
                <p className="text-[10px] font-bold text-rose-800">
                  ✨ {isId ? activeYogaPose.benefitId : activeYogaPose.benefitEn}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Anti-Cramp Nutrition Quick Tips */}
        <div className="bg-white/80 p-3 rounded-2xl border border-rose-100 space-y-1.5">
          <p className="text-[10px] font-black uppercase tracking-wider text-rose-800">
            {isId ? 'Nutrisi Penenang Kram:' : 'Anti-Spasmodic Nutrients:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {CRAMP_RELIEF_FOODS.map((f, i) => (
              <div key={i} className="p-2 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center gap-1.5">
                <span className="text-base">{f.icon}</span>
                <p className="text-[10px] font-bold text-rose-950 truncate">{isId ? f.nameId : f.nameEn}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
