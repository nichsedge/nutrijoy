"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Sparkles, Play, Pause, RotateCcw, Droplets, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { BEAUTY_TEAS, getRecommendedTea } from '@/lib/beautyTeas';
import { BeautyTea, SkinCondition } from '@/lib/types';
import { getCyclePhase } from '@/lib/cycleSync';
import { playChime, playGong, playSuccessChord } from '@/lib/soundEffects';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export function BeautyTeaCard() {
  const { state, addWaterLog } = useApp();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  // Determine current phase and skin condition
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = today + 86400000;
  const cycleLog = (state.cycleLogs || []).find(l => l.timestamp >= today && l.timestamp < tomorrow);
  const phaseInfo = getCyclePhase(cycleLog?.cycleDay ?? 1, state.profile?.language || 'en');
  const lastSkin = (state.cycleLogs || []).reverse().find(l => l.skinCondition)?.skinCondition;

  const defaultTea = getRecommendedTea(phaseInfo.phase, lastSkin);
  const [selectedTea, setSelectedTea] = useState<BeautyTea>(defaultTea);
  const [showAllTeas, setShowAllTeas] = useState(false);

  // Steep timer state
  const steepSecondsTotal = selectedTea.steepMinutes * 60;
  const [steepSecondsLeft, setSteepSecondsLeft] = useState(steepSecondsTotal);
  const [isSteeping, setIsSteeping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update steep timer when selected tea changes
  useEffect(() => {
    setIsSteeping(false);
    setSteepSecondsLeft(selectedTea.steepMinutes * 60);
  }, [selectedTea]);

  // Steep timer countdown
  useEffect(() => {
    if (!isSteeping) return;

    timerRef.current = setInterval(() => {
      setSteepSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsSteeping(false);
          playGong();
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
          toast({
            title: `🍵 ${isId ? selectedTea.nameId : selectedTea.name} ${isId ? 'Siap Dinikmati!' : 'Ready!'}`,
            description: isId ? 'Seduhan teh sempurna. Nikmati selagi hangat untuk manfaat antioksidan maksimal!' : 'Perfect extraction. Sip while warm for maximum antioxidant bioavailability!'
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSteeping, selectedTea, isId, toast]);

  const handleLogTea = () => {
    playChime();
    addWaterLog({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      amountMl: 250
    });
    toast({
      title: `🍵 ${isId ? selectedTea.nameId : selectedTea.name} ${isId ? 'Dicatat' : 'Logged'}`,
      description: `+250ml ${isId ? 'air hidrasi & ' : 'hydration & '}+${selectedTea.antioxidantMg}mg ${isId ? 'antioksidan alami' : 'antioxidants'}`,
    });
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const steepPercent = ((steepSecondsTotal - steepSecondsLeft) / steepSecondsTotal) * 100;

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-amber-500/10 rounded-[2rem] border border-rose-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-700 font-black">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <span className="text-base">🫖</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">{t.beautyTeas || 'Botanical Beauty Apothecary'}</p>
              <p className="text-[10px] text-muted-foreground font-bold">
                {isId ? `Rekomendasi Fase ${phaseInfo.phaseName}` : `Synced to ${phaseInfo.phaseName} Phase`}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAllTeas(!showAllTeas)}
            className="h-7 px-2 text-[10px] font-bold text-rose-700 hover:bg-rose-100/60 rounded-full"
          >
            {showAllTeas ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <ChevronDown className="w-3.5 h-3.5 mr-1" />}
            {showAllTeas ? (isId ? 'Tutup' : 'Close') : (isId ? 'Pilih Teh' : 'All Blends')}
          </Button>
        </div>

        {/* Blend Selector Dropdown */}
        {showAllTeas && (
          <div className="bg-white p-3 rounded-2xl border border-rose-200/80 shadow-xs space-y-2 animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-800">
              {isId ? 'Koleksi Seduhan Cantik' : 'Beauty Tea Collection'}
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {BEAUTY_TEAS.map(tea => (
                <button
                  key={tea.id}
                  type="button"
                  onClick={() => {
                    setSelectedTea(tea);
                    setShowAllTeas(false);
                    playChime();
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all active:scale-[0.99] ${
                    selectedTea.id === tea.id
                      ? 'bg-rose-50 border-rose-300 shadow-2xs'
                      : 'bg-white hover:bg-rose-50/50 border-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl">{tea.icon}</span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-rose-950 truncate">{isId ? tea.nameId : tea.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{isId ? tea.taglineId : tea.tagline}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 shrink-0 ml-2">
                    {tea.steepMinutes} min
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Tea Featured Card */}
        <div className="bg-white/90 p-4 rounded-2xl border border-rose-100/80 shadow-2xs space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl">{selectedTea.icon}</span>
                <h4 className="text-sm font-black text-rose-950">
                  {isId ? selectedTea.nameId : selectedTea.name}
                </h4>
              </div>
              <p className="text-xs text-rose-700 font-bold">
                {isId ? selectedTea.taglineId : selectedTea.tagline}
              </p>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-[10px] font-black text-rose-800 shrink-0">
              +{selectedTea.antioxidantMg}mg {isId ? 'Antioksidan' : 'Antioxidants'}
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {isId ? selectedTea.beautyBenefitsId : selectedTea.beautyBenefits}
          </p>

          {/* Ingredients list */}
          <div className="flex flex-wrap gap-1 pt-1">
            {(isId ? selectedTea.ingredientsId : selectedTea.ingredients).map((ing, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-rose-50 text-[10px] text-rose-800 font-bold border border-rose-200/50">
                🌿 {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Steep Timer & Quick Log Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Steep Countdown */}
          <div className="bg-white/80 p-3 rounded-2xl border border-rose-100 space-y-2 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                {t.steepTimer || 'Steep Timer'}
              </span>
              <span className="text-xs font-black font-mono text-rose-700">
                {formatTimer(steepSecondsLeft)}
              </span>
            </div>

            <div className="h-1.5 bg-rose-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${steepPercent}%` }}
              />
            </div>

            <Button
              size="sm"
              onClick={() => {
                playChime();
                setIsSteeping(!isSteeping);
              }}
              className="w-full rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-7 shadow-xs"
            >
              {isSteeping ? (
                <><Pause className="w-3 h-3 mr-1" /> {isId ? 'Jeda' : 'Pause'}</>
              ) : (
                <><Play className="w-3 h-3 mr-1" /> {steepSecondsLeft === steepSecondsTotal ? (isId ? 'Mulai Seduh' : 'Start Steep') : (isId ? 'Lanjutkan' : 'Resume')}</>
              )}
            </Button>
          </div>

          {/* Quick Log Cup Button */}
          <div className="bg-white/80 p-3 rounded-2xl border border-rose-100 space-y-2 flex flex-col justify-between text-center">
            <div>
              <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                {isId ? 'Catat Asupan' : 'Hydration Log'}
              </span>
              <p className="text-xs font-black text-rose-950 mt-0.5">
                +250ml {isId ? 'Air & Nutrisi' : 'Water & Polyphenols'}
              </p>
            </div>

            <Button
              size="sm"
              onClick={handleLogTea}
              className="w-full rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs h-7 shadow-xs"
            >
              <Droplets className="w-3 h-3 mr-1" />
              {t.logTea || 'Log Cup (+250ml)'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
