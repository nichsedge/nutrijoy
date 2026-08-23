"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sparkles, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useAppState } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { calculateSleepScore, getSleepSkinCorrelation } from '@/lib/sleepQuality';
import { SkinJournalEntry } from '@/lib/types';

interface SleepQualityCardProps {
  skinJournalEntries?: SkinJournalEntry[];
}

export function SleepQualityCard({ skinJournalEntries = [] }: SleepQualityCardProps) {
  const state = useAppState();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';
  const [showTips, setShowTips] = useState(false);

  const todaySleep = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const tomorrow = today + 86400000;
    return (state.sleepLogs || []).find(l => l.timestamp >= today && l.timestamp < tomorrow);
  }, [state.sleepLogs]);

  const score = useMemo(() => {
    if (!todaySleep) return null;
    return calculateSleepScore(todaySleep, 0);
  }, [todaySleep]);

  const correlation = useMemo(() => {
    return getSleepSkinCorrelation(state.sleepLogs || [], skinJournalEntries, state.profile?.language || 'en');
  }, [state.sleepLogs, skinJournalEntries, state.profile?.language]);

  const tips = isId ? [
    '🌙 Sarung bantal sutra mengurangi gesekan wajah dan mencegah kerutan tidur',
    '🍵 Teh chamomile atau magnesium glisin 30 menit sebelum tidur memperdalam siklus tidur',
    '📵 Hindari layar biru setelah pukul 21:00 — cahaya biru menekan produksi melatonin',
    '🌡️ Kamar tidur sejuk (18–20°C) membantu masuk ke fase tidur nyenyak lebih cepat',
    '☕ Batasi kafein setelah pukul 13:00 — setengah umur kafein adalah 5 jam',
  ] : [
    '🌙 Silk pillowcases reduce facial friction and prevent sleep creases from deepening',
    '🍵 Chamomile tea or magnesium glycinate 30min before bed deepens sleep cycles',
    '📵 No blue light screens after 9pm — blue light suppresses melatonin production',
    '🌡️ Cool bedroom (64–68°F / 18–20°C) triggers sleep onset and deepens delta waves',
    '☕ Cut off caffeine after 1pm — caffeine has a 5-hour metabolic half-life',
  ];

  const circumference = 2 * Math.PI * 48;
  const strokeDash = score ? (score.total / 100) * circumference : 0;

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-violet-500/10 rounded-[2rem] border border-indigo-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 text-indigo-700 font-black">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center">
            <Moon className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider">{t.sleepScore || 'Sleep Quality Score'}</p>
            {todaySleep && (
              <p className="text-[10px] text-muted-foreground font-bold">
                {todaySleep.durationHours}h · {isId ? 'Kualitas' : 'Quality'} {todaySleep.restednessScore}/5
              </p>
            )}
          </div>
        </div>

        {!todaySleep ? (
          <div className="text-center py-6 space-y-2">
            <Moon className="w-10 h-10 mx-auto text-indigo-300" />
            <p className="text-xs text-muted-foreground font-bold">
              {isId ? 'Catat tidurmu di Jurnal untuk melihat skor kualitas tidurmu.' : 'Log your sleep in Check-In to see your beauty sleep quality score.'}
            </p>
          </div>
        ) : score ? (
          <>
            {/* Score Arc */}
            <div className="flex items-center gap-5">
              <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 110 110" className="w-full h-full -rotate-90">
                  <circle cx="55" cy="55" r="48" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="10" />
                  <circle
                    cx="55" cy="55" r="48" fill="none"
                    stroke={score.total >= 80 ? '#6366f1' : score.total >= 60 ? '#8b5cf6' : score.total >= 40 ? '#f59e0b' : '#f43f5e'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${strokeDash} ${circumference}`}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-foreground">{score.total}</span>
                  <span className="text-[9px] font-black text-muted-foreground uppercase">/100</span>
                </div>
              </div>

              <div className="space-y-2 flex-1 min-w-0">
                <div className={`px-2.5 py-1.5 rounded-xl border text-xs font-black ${score.colorClass}`}>
                  {isId ? score.labelId : score.label}
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">{isId ? score.tipId : score.tip}</p>

                {/* Sub-scores */}
                <div className="grid grid-cols-2 gap-1 pt-1">
                  {[
                    { label: isId ? 'Durasi' : 'Duration', val: score.durationScore, max: 50 },
                    { label: isId ? 'Kenyamanan' : 'Restedness', val: score.restednessScore, max: 35 },
                  ].map(s => (
                    <div key={s.label} className="bg-white/70 px-2 py-1 rounded-lg text-center">
                      <p className="text-[9px] text-muted-foreground font-bold uppercase">{s.label}</p>
                      <p className="text-xs font-black text-foreground">{s.val}<span className="text-[9px] text-muted-foreground">/{s.max}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Correlation insight */}
            {correlation && (
              <div className="bg-indigo-50/80 border border-indigo-200/60 rounded-2xl p-3 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-indigo-900 font-bold leading-snug">{correlation}</p>
              </div>
            )}
          </>
        ) : null}

        {/* Tips Toggle */}
        <button
          type="button"
          onClick={() => setShowTips(v => !v)}
          className="w-full flex items-center justify-between text-indigo-700 text-xs font-black py-1 hover:opacity-80 transition-opacity"
        >
          <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" />{t.beautySleepTips || 'Beauty Sleep Tips'}</span>
          {showTips ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showTips && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
            {tips.map((tip, i) => (
              <div key={i} className="bg-white/70 px-3 py-2 rounded-xl text-[11px] text-foreground/80 font-bold leading-snug">
                {tip}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
