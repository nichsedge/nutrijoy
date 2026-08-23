"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Moon, Clock, Plus, Trash2, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTranslation } from '@/lib/translations';
import { useAppState } from '../AppContext';
import { CaffeineLogEntry } from '@/lib/types';
import { CAFFEINE_PRESETS, CaffeinePreset, calculateRemainingCaffeine, getCaffeineCutoffHour, getSleepImpact } from '@/lib/caffeine';
import { playChime, playSuccessChord } from '@/lib/soundEffects';

export function CaffeineTrackerCard() {
  const state = useAppState();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [logs, setLogs] = useState<CaffeineLogEntry[]>([]);
  const [showPresets, setShowPresets] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nutrijoy_caffeine_logs');
      if (saved) {
        setLogs(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today).setHours(24, 0, 0, 0);
  const todaysLogs = logs.filter(l => l.timestamp >= today && l.timestamp < tomorrow);

  // Calculate remaining caffeine now and at 11:00 PM
  const now = Date.now();
  const bedtime = new Date(today).setHours(23, 0, 0, 0);
  const activeNowMg = calculateRemainingCaffeine(todaysLogs, now);
  const remainingAtBedtimeMg = calculateRemainingCaffeine(todaysLogs, bedtime);

  const cutoffInfo = getCaffeineCutoffHour(23);
  const sleepImpact = getSleepImpact(remainingAtBedtimeMg);

  const handleAddCaffeine = (preset: CaffeinePreset) => {
    const newEntry: CaffeineLogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      name: isId ? preset.nameId : preset.name,
      caffeineMg: preset.caffeineMg,
      icon: preset.icon
    };

    const updated = [newEntry, ...logs];
    setLogs(updated);
    try {
      localStorage.setItem('nutrijoy_caffeine_logs', JSON.stringify(updated));
    } catch {
      // ignore
    }

    playChime();
    toast({
      title: `${preset.icon} ${isId ? preset.nameId : preset.name} ${isId ? 'Dicatat' : 'Logged'}`,
      description: `+${preset.caffeineMg}mg ${isId ? 'kafein' : 'caffeine'}`,
    });
    setShowPresets(false);
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    try {
      localStorage.setItem('nutrijoy_caffeine_logs', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-purple-500/10 rounded-[2rem] border border-amber-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-700 font-black">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Coffee className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider">{t.caffeineTracker || 'Caffeine & Sleep Cutoff'}</span>
              <p className="text-[10px] text-muted-foreground font-bold">{todaysLogs.length} {isId ? 'minuman hari ini' : 'drinks today'}</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setShowPresets(!showPresets)}
            className="rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold h-8 px-3 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {t.logCaffeine || 'Log Coffee'}
          </Button>
        </div>

        {/* Quick Presets Picker */}
        {showPresets && (
          <div className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-xs space-y-2 animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-800">
              {isId ? 'Pilih Minuman' : 'Select Beverage'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CAFFEINE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleAddCaffeine(p)}
                  className="p-2 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200/60 text-left transition-all flex items-center gap-2 active:scale-95"
                >
                  <span className="text-lg">{p.icon}</span>
                  <div className="truncate min-w-0">
                    <p className="text-xs font-bold text-amber-950 truncate">{isId ? p.nameId : p.name}</p>
                    <p className="text-[10px] font-bold text-amber-700">{p.caffeineMg} mg</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Active Now */}
          <div className="bg-white/80 p-3 rounded-2xl border border-amber-100 shadow-2xs text-center space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{t.activeCaffeine || 'Active Now'}</span>
            <p className="text-lg font-black text-amber-700">{activeNowMg}<span className="text-[10px] font-bold">mg</span></p>
          </div>

          {/* At Bedtime */}
          <div className="bg-white/80 p-3 rounded-2xl border border-amber-100 shadow-2xs text-center space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{t.atBedtime || 'At Bedtime'}</span>
            <p className={`text-lg font-black ${remainingAtBedtimeMg > 50 ? 'text-rose-600' : 'text-purple-700'}`}>
              {remainingAtBedtimeMg}<span className="text-[10px] font-bold">mg</span>
            </p>
          </div>

          {/* Cutoff Window */}
          <div className="bg-white/80 p-3 rounded-2xl border border-amber-100 shadow-2xs text-center space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{t.caffeineCutoff || 'Cutoff'}</span>
            <p className="text-xs font-black text-foreground pt-1">{cutoffInfo.cutoffTimeStr}</p>
          </div>
        </div>

        {/* Sleep Impact Status Banner */}
        <div className={`p-3 rounded-2xl border ${sleepImpact.color} flex items-start gap-2.5 transition-all`}>
          <Moon className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-black">{isId ? sleepImpact.labelId : sleepImpact.label}</p>
            <p className="leading-snug opacity-90">{isId ? sleepImpact.adviceId : sleepImpact.advice}</p>
          </div>
        </div>

        {/* Recent logs */}
        {todaysLogs.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex gap-1.5 flex-wrap">
              {todaysLogs.map((log) => (
                <div key={log.id} className="bg-white px-2.5 py-1 rounded-full border border-amber-200/60 shadow-2xs flex items-center gap-1.5 text-xs font-bold text-amber-900 group">
                  <span>{log.icon || '☕'}</span>
                  <span>{log.name}</span>
                  <span className="text-[10px] text-muted-foreground">({log.caffeineMg}mg)</span>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                    title="Delete log"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
