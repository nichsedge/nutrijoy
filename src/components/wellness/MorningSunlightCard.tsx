'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, CloudSun, Play, Pause, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { getSunlightRecommendedMinutes, getCircadianPhaseBenefits } from '@/lib/circadianSunlight';
import { playChime, playSuccessChord } from '@/lib/soundEffects';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export function MorningSunlightCard() {
  const { state } = useApp();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [isOvercast, setIsOvercast] = useState(false);
  const targetMinutes = getSunlightRecommendedMinutes(isOvercast);
  const totalSeconds = targetMinutes * 60;

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update timer target when weather condition changes
  useEffect(() => {
    setIsRunning(false);
    setSecondsLeft(getSunlightRecommendedMinutes(isOvercast) * 60);
  }, [isOvercast]);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          playSuccessChord();
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
          toast({
            title: isId ? '☀️ Sinkronisasi Cahaya Pagi Selesai!' : '☀️ Morning Lux Sync Complete!',
            description: isId
              ? 'Jam biologis master (SCN) telah terkunci untuk energi prima hari ini dan tidur nyenyak malam nanti.'
              : 'Suprachiasmatic nucleus master clock locked for daytime alertness and restorative sleep tonight.',
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isId, toast]);

  const elapsedSeconds = totalSeconds - secondsLeft;
  const elapsedMinutes = elapsedSeconds / 60;
  const benefits = getCircadianPhaseBenefits(elapsedMinutes, targetMinutes);
  const progressPercent = Math.min(100, (elapsedSeconds / totalSeconds) * 100);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-yellow-500/10 rounded-[2rem] border border-amber-500/20 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 font-black">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-600 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">
                {t.morningSunlight || 'Morning Sunlight & Circadian Sync'}
              </p>
              <p className="text-[10px] text-muted-foreground font-bold">
                {isId ? 'Sinkronisasi jam biologis & hormon melatonin' : 'Retinal ipRGC lux synchronization'}
              </p>
            </div>
          </div>

          {/* Weather Toggle */}
          <div className="flex gap-1 bg-white/70 p-1 rounded-xl border border-amber-200/80">
            <button
              type="button"
              onClick={() => {
                setIsOvercast(false);
                playChime();
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                !isOvercast ? 'bg-amber-500 text-white shadow-2xs' : 'text-muted-foreground hover:text-amber-800'
              }`}
            >
              ☀️ 10m {isId ? 'Cerah' : 'Sunny'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOvercast(true);
                playChime();
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                isOvercast ? 'bg-amber-500 text-white shadow-2xs' : 'text-muted-foreground hover:text-amber-800'
              }`}
            >
              ⛅ 20m {isId ? 'Berawan' : 'Cloudy'}
            </button>
          </div>
        </div>

        {/* Circular Sun Timer Visual */}
        <div className="bg-white/90 p-4 rounded-2xl border border-amber-100 shadow-2xs flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full bg-amber-400/20 ${isRunning ? 'animate-ping' : ''}`}
              style={{ animationDuration: '3s' }}
            />
            <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-md">
              <Sun className="w-8 h-8 text-white drop-shadow-xs" />
            </div>
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-xl font-black font-mono text-amber-950">{formatTimer(secondsLeft)}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {Math.round(progressPercent)}%
              </span>
            </div>

            <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[10px] text-muted-foreground font-bold">
              {isId
                ? 'Pandang ke arah langit terbuka (tanpa kacamata hitam)'
                : 'Face outdoor open sky (no sunglasses, natural light)'}
            </p>
          </div>
        </div>

        {/* Photobiology Status Banner */}
        <div className={`p-3 rounded-2xl border text-xs font-bold leading-snug space-y-0.5 ${benefits.colorClass}`}>
          <p className="font-black">{isId ? benefits.statusId : benefits.statusEn}</p>
          <p className="text-[11px] opacity-90">{isId ? benefits.descId : benefits.descEn}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              playChime();
              setIsRunning(!isRunning);
            }}
            className={`flex-1 rounded-xl font-bold text-xs h-8 shadow-xs ${
              isRunning ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 mr-1" /> {isId ? 'Jeda' : 'Pause'}
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1" />{' '}
                {secondsLeft === totalSeconds
                  ? isId
                    ? 'Mulai Berjemur Pagi'
                    : 'Start Sun Sync'
                  : isId
                    ? 'Lanjutkan'
                    : 'Resume'}
              </>
            )}
          </Button>

          {secondsLeft < totalSeconds && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsRunning(false);
                setSecondsLeft(totalSeconds);
              }}
              className="rounded-xl border-amber-200 text-amber-800 font-bold text-xs h-8 px-3"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
