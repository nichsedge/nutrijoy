'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Share2, Copy, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { generateMonthlyReport } from '@/lib/monthlyReport';
import { SkinJournalEntry } from '@/lib/types';
import { playSuccessChord } from '@/lib/soundEffects';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export function MonthlyReportCard() {
  const { state } = useApp();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';
  const [skinJournal, setSkinJournal] = useState<SkinJournalEntry[]>([]);
  const [beforeIdx, setBeforeIdx] = useState(0);
  const [afterIdx, setAfterIdx] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nutrijoy_skin_journal');
      if (saved) setSkinJournal(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const report = useMemo(() => generateMonthlyReport(state, skinJournal), [state, skinJournal]);

  const photoEntries = skinJournal.filter((e) => e.photoUrl).sort((a, b) => a.timestamp - b.timestamp);

  const skinConditionColors: Record<string, string> = {
    radiant: 'bg-yellow-100 text-yellow-800',
    clear: 'bg-green-100 text-green-800',
    dry: 'bg-blue-100 text-blue-800',
    puffy: 'bg-purple-100 text-purple-800',
    breakout: 'bg-red-100 text-red-800',
  };

  const skinLabels: Record<string, { en: string; id: string }> = {
    radiant: { en: '✨ Radiant', id: '✨ Bercahaya' },
    clear: { en: '🌿 Clear', id: '🌿 Cerah' },
    dry: { en: '💧 Dry', id: '💧 Kering' },
    puffy: { en: '🧊 Puffy', id: '🧊 Sembap' },
    breakout: { en: '🫧 Breakout', id: '🫧 Jerawat' },
  };

  const totalSkinDays = Object.values(report.skinDistribution).reduce((a, b) => a + b, 0);

  const handleShare = async () => {
    const summaryLines = [
      `🌟 ${report.month} — NutriJoy Transformation`,
      `✨ Avg Glow Score: ${report.avgGlowScore}/100`,
      `😴 Avg Sleep: ${report.avgSleepHours}h`,
      `💧 Hydration Adherence: ${report.waterAdherencePercent}%`,
      `🔥 Streak: ${report.longestStreak} days`,
      `🌿 Top Nutrients: ${report.topNutrients.join(', ')}`,
      report.milestones.length > 0 ? `🏆 Milestones: ${report.milestones.join(' · ')}` : '',
      '',
      'Tracked with NutriJoy 💖',
    ]
      .filter(Boolean)
      .join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: `NutriJoy — ${report.month}`, text: summaryLines });
        playSuccessChord();
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(summaryLines);
      toast({
        title: isId ? '📋 Laporan disalin!' : '📋 Report copied!',
        description: isId
          ? 'Tempel di mana saja untuk berbagi perjalananmu.'
          : 'Paste anywhere to share your transformation journey.',
      });
    }
  };

  // Fire confetti on mount if there are milestones
  useEffect(() => {
    if (report.milestones.length > 0) {
      playSuccessChord();
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.4 } });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-fuchsia-500/10 via-pink-500/5 to-rose-500/10 rounded-[2rem] border border-fuchsia-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-fuchsia-700 font-black">
            <div className="w-8 h-8 rounded-xl bg-fuchsia-500/15 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-fuchsia-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">{t.monthlyReport || 'Monthly Transformation Report'}</p>
              <p className="text-[10px] text-muted-foreground font-bold">{report.month}</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleShare}
            variant="outline"
            className="h-8 px-3 rounded-full border-fuchsia-200 text-fuchsia-700 text-[10px] font-bold"
          >
            <Share2 className="w-3 h-3 mr-1" />
            {t.shareReport || 'Share'}
          </Button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: t.avgGlowScore || 'Avg Glow', value: `${report.avgGlowScore}/100`, icon: '✨' },
            { label: t.avgSleep || 'Avg Sleep', value: `${report.avgSleepHours}h`, icon: '🌙' },
            { label: t.waterAdherence || 'Hydration Rate', value: `${report.waterAdherencePercent}%`, icon: '💧' },
            { label: t.daysTracked || 'Days Tracked', value: String(report.daysTracked), icon: '📅' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/80 p-3 rounded-2xl border border-fuchsia-100 flex items-center gap-2.5"
            >
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="text-base font-black text-foreground">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Top nutrients */}
        {report.topNutrients.length > 0 && (
          <div className="bg-white/80 p-3 rounded-2xl border border-fuchsia-100 space-y-1.5">
            <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
              {t.topNutrients || 'Top Nutrients This Month'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {report.topNutrients.map((n, i) => (
                <span
                  key={n}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black ${i === 0 ? 'bg-fuchsia-100 text-fuchsia-800' : 'bg-slate-100 text-slate-700'}`}
                >
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {n}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skin condition distribution */}
        {totalSkinDays > 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
              {t.skinHistory || 'Skin Condition History'}
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(report.skinDistribution)
                .filter(([, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([cond, count]) => (
                  <div
                    key={cond}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black ${skinConditionColors[cond]}`}
                  >
                    {isId ? skinLabels[cond]?.id : skinLabels[cond]?.en} ({count}d)
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Before / After photos */}
        {photoEntries.length >= 2 && (
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">
              {t.beforeAfterPhotos || 'Before & After'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: isId ? 'Sebelum' : 'Before', entry: photoEntries[0] },
                { label: isId ? 'Sesudah' : 'After', entry: photoEntries[photoEntries.length - 1] },
              ].map(({ label, entry }) => (
                <div key={label} className="space-y-1">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-fuchsia-100">
                    {entry.photoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.photoUrl} alt={label} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <p className="text-[9px] font-black text-center text-muted-foreground uppercase">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Milestone banners */}
        {report.milestones.length > 0 && (
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" /> {t.milestone || 'Milestones Unlocked!'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {report.milestones.map((m, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-200"
                >
                  {isId ? report.milestonesId[i] : m}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
