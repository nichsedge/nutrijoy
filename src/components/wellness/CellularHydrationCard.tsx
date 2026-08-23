"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Droplets, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { CELLULAR_HYDRATION_PRESETS, calculateHydrationMultiplier } from '@/lib/cellularHydration';
import { CellularHydrationItem } from '@/lib/types';
import { playChime, playSuccessChord } from '@/lib/soundEffects';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export function CellularHydrationCard() {
  const { state, addWaterLog } = useApp();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [electrolyteCount, setElectrolyteCount] = useState<number>(0);

  // Compute today's plain water total
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = today + 86400000;
  const todayWaterLogs = (state.waterLogs || []).filter(l => l.timestamp >= today && l.timestamp < tomorrow);
  const totalPlainWaterMl = todayWaterLogs.reduce((sum, l) => sum + l.amountMl, 0);

  const hydrationMultiplier = calculateHydrationMultiplier(totalPlainWaterMl, electrolyteCount);

  const handleLogMineralDrink = (item: CellularHydrationItem) => {
    playChime();
    addWaterLog({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      amountMl: item.waterMl
    });

    setElectrolyteCount(prev => {
      const next = prev + 1;
      if (next === 2) {
        playSuccessChord();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      }
      return next;
    });

    toast({
      title: `${item.icon} ${isId ? item.nameId : item.nameEn}`,
      description: `+${item.waterMl}ml · ${isId ? item.benefitId : item.benefitEn}`
    });
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-cyan-500/10 rounded-[2rem] border border-amber-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 font-black">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">{t.cellularHydration || 'Cellular Hydration & Minerals'}</p>
              <p className="text-[10px] text-muted-foreground font-bold">
                {isId ? 'Elektrolit untuk kekenyalan sel kulit' : 'Aquaporin intracellular plumping'}
              </p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full border border-amber-300 bg-amber-50 text-[10px] font-black text-amber-800">
            {hydrationMultiplier.multiplier}x {isId ? 'Penyerapan' : 'Absorption'}
          </div>
        </div>

        {/* Multiplier Stats Card */}
        <div className="bg-white/90 p-4 rounded-2xl border border-amber-100 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                {isId ? 'Efektivitas Hidrasi Sel' : 'Effective Cellular Hydration'}
              </p>
              <h3 className="text-xl font-black text-amber-950">
                {hydrationMultiplier.effectiveHydrationMl} ml
                {hydrationMultiplier.bonusMl > 0 && (
                  <span className="text-xs text-emerald-600 font-bold ml-1.5">
                    (+{hydrationMultiplier.bonusMl}ml bonus)
                  </span>
                )}
              </h3>
            </div>
            <span className="text-2xl">⚡</span>
          </div>

          <p className="text-xs font-bold text-amber-800">
            {isId ? hydrationMultiplier.statusId : hydrationMultiplier.statusEn}
          </p>
        </div>

        {/* 1-Tap Mineral Log Presets */}
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-900">
            {isId ? 'Pilihan Minuman Kaya Mineral:' : '1-Tap Mineral Boost Options:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CELLULAR_HYDRATION_PRESETS.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLogMineralDrink(item)}
                className="p-2.5 rounded-xl border border-amber-100 bg-white hover:bg-amber-50/60 text-left flex items-start justify-between transition-all active:scale-[0.98] shadow-2xs"
              >
                <div className="flex items-start gap-2 min-w-0">
                  <span className="text-lg">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-amber-950 truncate">{isId ? item.nameId : item.nameEn}</p>
                    <p className="text-[9px] text-muted-foreground font-bold">
                      +{item.waterMl}ml · Na {item.minerals.sodiumMg}mg · K {item.minerals.potassiumMg}mg
                    </p>
                  </div>
                </div>
                <Plus className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
