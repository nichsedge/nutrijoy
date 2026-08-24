'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause, Radio, Sparkles, Timer } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { SolfeggioPreset } from '@/lib/types';
import { startSolfeggioTone, stopSolfeggioTone, playChime } from '@/lib/soundEffects';

const SOLFEGGIO_PRESETS: SolfeggioPreset[] = [
  {
    freq: 432,
    name: '432 Hz — Cellular Calm',
    nameId: '432 Hz — Ketenangan Seluler',
    purpose: 'Downregulates sympathetic cortisol, relaxes vascular tone, and soothes facial tension.',
    purposeId: 'Menenangkan kortisol, merelaksasi ketegangan pembuluh darah, dan melepas stres wajah.',
    icon: '🌿',
    color: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  },
  {
    freq: 528,
    name: '528 Hz — Miracle & Collagen Repair',
    nameId: '528 Hz — Perbaikan Kolagen & DNA',
    purpose: 'Resonant harmonic associated with cellular longevity, collagen synthesis, and deep renewal.',
    purposeId: 'Frekuensi resonansi untuk regenerasi seluler, sintesis kolagen, dan peremajaan mendalam.',
    icon: '✨',
    color: 'border-purple-300 bg-purple-50 text-purple-900',
  },
  {
    freq: 639,
    name: '639 Hz — Heart & Love Harmonics',
    nameId: '639 Hz — Harmoni Hati & Kasih',
    purpose: 'Fosters inner warmth, relational connection, and release of emotional constriction.',
    purposeId: 'Membuka kehangatan batin, kedekatan relasi cinta, dan melepas beban emosional.',
    icon: '💖',
    color: 'border-rose-300 bg-rose-50 text-rose-900',
  },
  {
    freq: 963,
    name: '963 Hz — Pure Radiance & Mind Clarity',
    nameId: '963 Hz — Kejernihan & Kesadaran Murni',
    purpose: 'Elevates mental clarity, dissolves afternoon brain fog, and awakens spiritual lightness.',
    purposeId: 'Tingkatkan fokus jernih, hilangkan kantuk/kabut otak, dan bangkitkan ketenangan pikiran.',
    icon: '👑',
    color: 'border-sky-300 bg-sky-50 text-sky-900',
  },
];

export function SolfeggioPlayerCard() {
  const { state } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [selectedFreq, setSelectedFreq] = useState<number>(528);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState<number>(5);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(300);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activePreset = SOLFEGGIO_PRESETS.find((p) => p.freq === selectedFreq) || SOLFEGGIO_PRESETS[1];

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSolfeggioTone();
      setIsPlaying(false);
    } else {
      startSolfeggioTone(selectedFreq, 0.08);
      setIsPlaying(true);
      setTimerSecondsLeft(timerMinutes * 60);
    }
  };

  const handleChangeFreq = (freq: number) => {
    setSelectedFreq(freq);
    playChime();
    if (isPlaying) {
      startSolfeggioTone(freq, 0.08);
    }
  };

  // Timer loop
  useEffect(() => {
    if (!isPlaying || timerMinutes === 0) return;

    timerRef.current = setInterval(() => {
      setTimerSecondsLeft((prev) => {
        if (prev <= 1) {
          stopSolfeggioTone();
          setIsPlaying(false);
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timerMinutes]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSolfeggioTone();
    };
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 rounded-[2rem] border border-indigo-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-800 font-black">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center">
              <Radio className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">{t.solfeggioTitle || 'Harmonic Frequency Soundscapes'}</p>
              <p className="text-[10px] text-muted-foreground font-bold">
                {isId ? 'Gelombang suara terapeutik offline' : 'Pure acoustic healing waves (100% offline)'}
              </p>
            </div>
          </div>

          {isPlaying && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-700 text-[10px] font-mono font-black animate-pulse">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              {formatTimer(timerSecondsLeft)}
            </div>
          )}
        </div>

        {/* Frequency Preset Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {SOLFEGGIO_PRESETS.map((preset) => {
            const isSelected = preset.freq === selectedFreq;
            return (
              <button
                key={preset.freq}
                type="button"
                onClick={() => handleChangeFreq(preset.freq)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2 active:scale-95 ${
                  isSelected
                    ? `${preset.color} shadow-xs border-2`
                    : 'bg-white/80 border-indigo-100/60 hover:bg-white text-foreground'
                }`}
              >
                <span className="text-xl">{preset.icon}</span>
                <div className="min-w-0 truncate">
                  <p className="text-xs font-black truncate">{preset.freq} Hz</p>
                  <p className="text-[9px] text-muted-foreground font-bold truncate">
                    {isId ? preset.nameId.split('—')[1]?.trim() : preset.name.split('—')[1]?.trim()}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Preset Details */}
        <div className="bg-white/90 p-3.5 rounded-2xl border border-indigo-100/80 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950">
            <span>{activePreset.icon}</span>
            <span>{isId ? activePreset.nameId : activePreset.name}</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            {isId ? activePreset.purposeId : activePreset.purpose}
          </p>
        </div>

        {/* Player Controls & Duration Selector */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {/* Duration Pills */}
          <div className="flex gap-1">
            {[5, 10, 15].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => {
                  setTimerMinutes(mins);
                  setTimerSecondsLeft(mins * 60);
                  playChime();
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                  timerMinutes === mins
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-indigo-100 text-indigo-800 hover:bg-indigo-50'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>

          {/* Main Play / Pause Button */}
          <Button
            size="sm"
            onClick={handleTogglePlay}
            className={`rounded-full px-5 h-9 font-bold text-xs shadow-md transition-all ${
              isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 mr-1.5 fill-current" /> {t.stopSound || 'Pause'}
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> {t.startSound || 'Play Frequency'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
