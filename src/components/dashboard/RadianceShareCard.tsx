'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Share2, Copy, Check, Flame, Droplets, Moon, Flower2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTranslation } from '@/lib/translations';
import { useAppState } from '../AppContext';
import { calculateSkinGlowScore, calculateTDEE } from '@/lib/nutrition';
import { calculateStreak } from '@/lib/types';
import { getCyclePhase } from '@/lib/cycleSync';
import { playSuccessChord } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';

export function RadianceShareCard() {
  const state = useAppState();
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  if (!state.profile) return null;

  const t = getTranslation(state.profile.language || 'en');
  const isId = state.profile.language === 'id';

  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today).setHours(24, 0, 0, 0);

  const todaysFood = state.foodLogs.filter((log) => log.timestamp >= today && log.timestamp < tomorrow);
  const todaysWater = state.waterLogs?.filter((log) => log.timestamp >= today && log.timestamp < tomorrow) || [];
  const todaysSleep = state.sleepLogs?.filter((log) => log.timestamp >= today && log.timestamp < tomorrow) || [];
  const todaysCycle = state.cycleLogs?.find((log) => log.timestamp >= today && log.timestamp < tomorrow);

  const waterConsumed = todaysWater.reduce((acc, curr) => acc + curr.amountMl, 0);
  const glowScore = calculateSkinGlowScore(todaysFood, todaysWater, todaysSleep, state.profile, state.profile.language);
  const streak = calculateStreak(state);

  const activeDay = todaysCycle?.cycleDay || 1;
  const phaseInfo = getCyclePhase(activeDay, state.profile.language);

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getShareText = () => {
    return `✨ My NutriJoy Radiance Card ✨
📅 Date: ${formattedDate}
🌟 Skin Glow Index: ${glowScore.score}% (${glowScore.label})
💧 Hydration: ${waterConsumed}ml / 2500ml
🔥 Streak: ${streak} Days
🩸 Phase: ${phaseInfo.phaseName}
🌸 Goal: Radiant, healthy & vibrant!

Tracked with NutriJoy 🥗`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      playSuccessChord();
      toast({
        title: '✨ Copied!',
        description: t.summaryCopied || 'Radiance summary copied to clipboard!',
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    playSuccessChord();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${state.profile?.name}'s Radiance Summary`,
          text: getShareText(),
          url: window.location.origin,
        });
      } catch {
        // user dismissed share dialog
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-pink-500/15 via-rose-500/10 to-amber-500/15 rounded-[2.5rem] border border-pink-500/20 overflow-hidden relative group">
      <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-pink-500/10 filter blur-xl pointer-events-none" />

      <CardContent className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 font-black">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-rose-500" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest">
                {t.radianceCardTitle || 'Weekly Radiance Summary'}
              </span>
              <p className="text-[10px] text-muted-foreground font-bold">{formattedDate}</p>
            </div>
          </div>

          <span className="text-[10px] font-black uppercase tracking-widest bg-rose-500/15 text-rose-700 px-2.5 py-1 rounded-full border border-rose-300/40">
            NutriJoy Glow
          </span>
        </div>

        {/* Glow Score Large Display */}
        <div className="bg-white/80 p-4 rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Skin Glow Score</p>
            <h3 className="text-2xl font-black text-rose-600">{glowScore.score}%</h3>
            <p className="text-xs font-bold text-foreground/80">{glowScore.label}</p>
          </div>

          <div className="text-right space-y-1">
            {streak > 0 && (
              <div className="inline-flex items-center gap-1 bg-orange-500/10 text-orange-600 px-2.5 py-1 rounded-full text-xs font-black border border-orange-500/20">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                <span>{streak} Days</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 justify-end">
              <Droplets className="w-3.5 h-3.5" />
              <span>{waterConsumed}ml</span>
            </div>
          </div>
        </div>

        {/* Pillars Mini Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <div className="bg-white/60 p-2.5 rounded-xl border border-rose-100 flex items-center gap-2">
            <Flower2 className="w-4 h-4 text-rose-500 shrink-0" />
            <div className="truncate">
              <p className="text-[9px] uppercase text-muted-foreground">Phase</p>
              <p className="truncate text-rose-700">{phaseInfo.phaseName}</p>
            </div>
          </div>

          <div className="bg-white/60 p-2.5 rounded-xl border border-rose-100 flex items-center gap-2">
            <Moon className="w-4 h-4 text-purple-500 shrink-0" />
            <div className="truncate">
              <p className="text-[9px] uppercase text-muted-foreground">Sleep Pillar</p>
              <p className="truncate text-purple-700">{glowScore.sleepScore}/25 pts</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="flex-1 rounded-2xl h-11 text-xs font-bold border-rose-200 bg-white hover:bg-rose-50 text-rose-700 shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 mr-1.5 text-emerald-600" /> : <Copy className="w-4 h-4 mr-1.5" />}
            {copied ? (isId ? 'Tersalin!' : 'Copied!') : isId ? 'Salin Teks' : 'Copy Summary'}
          </Button>

          <Button
            type="button"
            onClick={handleShare}
            className="flex-1 rounded-2xl h-11 text-xs font-black bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20"
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            {isId ? 'Bagikan' : 'Share Card'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
