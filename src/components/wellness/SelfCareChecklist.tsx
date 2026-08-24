import React, { useState } from 'react';
import { useAppState, useAppActions } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Sun, Moon, CheckCircle2, Heart, Play, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GuidedRitualsModal } from './GuidedRitualsModal';
import { Button } from '@/components/ui/button';
import { playChime, playSuccessChord } from '@/lib/soundEffects';

export function SelfCareChecklist() {
  const state = useAppState();
  const { addSelfCareLog, removeSelfCareLog } = useAppActions();
  const t = getTranslation(state.profile?.language || 'en');
  const [isDePuffModalOpen, setIsDePuffModalOpen] = useState(false);
  const [isPostureModalOpen, setIsPostureModalOpen] = useState(false);
  const [isCryoModalOpen, setIsCryoModalOpen] = useState(false);
  const [isDrybrushModalOpen, setIsDrybrushModalOpen] = useState(false);
  const [isEyeModalOpen, setIsEyeModalOpen] = useState(false);
  const [isGuaShaModalOpen, setIsGuaShaModalOpen] = useState(false);

  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today).setHours(24, 0, 0, 0);
  const todaysLog = state.selfCareLogs?.find((s) => s.timestamp >= today && s.timestamp < tomorrow);

  const morningItems = [
    { id: 'sunscreen', label: t.spfApplied || 'SPF 50+ Sunscreen Applied', icon: '☀️' },
    { id: 'waterBoost', label: t.waterBoost || 'Morning 500ml Water Boost', icon: '💧' },
    { id: 'faceMassage', label: t.lymphaticDrainage || 'Lymphatic De-Puff Massage', icon: '🧊' },
  ];

  const eveningItems = [
    { id: 'cleansing', label: t.doubleCleanse || 'Double Cleanse (Oil + Gentle Wash)', icon: '🧼' },
    { id: 'activeSerum', label: t.activeSerum || 'Active Treatment / Barrier Cream', icon: '✨' },
    { id: 'silkPillow', label: t.silkPillowAndWindDown || 'Silk Pillowcase & Screen Off', icon: '🌙' },
  ];

  const allItems = [...morningItems, ...eveningItems];

  const handleToggle = (id: string, checked: boolean) => {
    const currentChecked = todaysLog?.checkedItems || [];
    let nextChecked = [];

    if (checked) {
      nextChecked = [...currentChecked, id];
      if (nextChecked.length === allItems.length) {
        playSuccessChord();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#f43f5e', '#a855f7'],
        });
      } else {
        playChime();
      }
    } else {
      nextChecked = currentChecked.filter((i) => i !== id);
    }

    if (todaysLog) {
      removeSelfCareLog(todaysLog.id);
    }

    addSelfCareLog({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      checkedItems: nextChecked,
    });
  };

  const checkedCount = todaysLog?.checkedItems?.length || 0;
  const progress = Math.round((checkedCount / allItems.length) * 100);

  const renderSection = (
    title: string,
    items: typeof morningItems,
    icon: React.ReactNode,
    colorClass: 'pink' | 'purple'
  ) => (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 px-1">
        {icon}
        <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">{title}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const isChecked = todaysLog?.checkedItems.includes(item.id) || false;
          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id, !isChecked)}
              className={`flex items-center justify-between p-3.5 rounded-2xl transition-all border cursor-pointer ${
                isChecked
                  ? colorClass === 'pink'
                    ? 'bg-pink-500/10 border-pink-300/40 text-pink-900 font-bold'
                    : 'bg-purple-500/10 border-purple-300/40 text-purple-900 font-bold'
                  : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  isChecked
                    ? colorClass === 'pink'
                      ? 'bg-pink-500 text-white'
                      : 'bg-purple-500 text-white'
                    : 'border-2 border-slate-200'
                }`}
              >
                {isChecked && <CheckCircle2 className="w-4 h-4 fill-current" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Card className="border-none shadow-sm bg-pink-500/5">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-500 font-bold">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm uppercase tracking-tighter">{t.selfCare}</span>
          </div>
          <span className="text-xs font-bold text-pink-500">
            {checkedCount} / {allItems.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-pink-500/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
          />
        </div>

        {/* AM Rituals */}
        {renderSection(
          t.morningRoutine || 'Morning Glow (AM)',
          morningItems,
          <Sun className="w-3.5 h-3.5 text-amber-500" />,
          'pink'
        )}

        {/* PM Rituals */}
        {renderSection(
          t.eveningRoutine || 'Night Renewal (PM)',
          eveningItems,
          <Moon className="w-3.5 h-3.5 text-indigo-500" />,
          'purple'
        )}

        {/* Guided Ritual Launchers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsCryoModalOpen(true)}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-sky-50/60 text-sky-700 border border-sky-200/80 shadow-xs flex items-center justify-between text-xs font-black transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-base">🧊</span>
              <span className="truncate">{t.cryoRitual || 'Ice-Roller Cryo Sculpt'}</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors shrink-0">
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsDrybrushModalOpen(true)}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-amber-50/60 text-amber-700 border border-amber-200/80 shadow-xs flex items-center justify-between text-xs font-black transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-base">🪥</span>
              <span className="truncate">{t.dryBrushing || 'Lymphatic Dry Brushing'}</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0">
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsDePuffModalOpen(true)}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-pink-50/60 text-pink-600 border border-pink-200/80 shadow-xs flex items-center justify-between text-xs font-black transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-base">✨</span>
              <span className="truncate">{t.startDePuffGuide || '2-Min De-Puff Guide'}</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-colors shrink-0">
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsPostureModalOpen(true)}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-rose-50/60 text-rose-600 border border-rose-200/80 shadow-xs flex items-center justify-between text-xs font-black transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-base">🧘</span>
              <span className="truncate">{t.startPostureGuide || '1-Min Posture Guide'}</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsGuaShaModalOpen(true)}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-purple-50/60 text-purple-700 border border-purple-200/80 shadow-xs flex items-center justify-between text-xs font-black transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-base">💎</span>
              <span className="truncate">{t.startGuaSha || '3-Min Gua Sha Guide'}</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors shrink-0">
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsEyeModalOpen(true)}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-teal-50/60 text-teal-700 border border-teal-200/80 shadow-xs flex items-center justify-between text-xs font-black transition-all active:scale-[0.99] group"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-base">👁️</span>
              <span className="truncate">{t.eyeRefresh || '1-Min Eye Refresh (20-20-20)'}</span>
            </div>
            <div className="w-5 h-5 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-colors shrink-0">
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            </div>
          </button>
        </div>

        <GuidedRitualsModal
          isOpen={isGuaShaModalOpen}
          onClose={() => setIsGuaShaModalOpen(false)}
          type="guasha"
          language={state.profile?.language || 'en'}
        />

        <GuidedRitualsModal
          isOpen={isCryoModalOpen}
          onClose={() => setIsCryoModalOpen(false)}
          type="cryo"
          language={state.profile?.language || 'en'}
        />

        <GuidedRitualsModal
          isOpen={isDrybrushModalOpen}
          onClose={() => setIsDrybrushModalOpen(false)}
          type="drybrush"
          language={state.profile?.language || 'en'}
        />

        <GuidedRitualsModal
          isOpen={isEyeModalOpen}
          onClose={() => setIsEyeModalOpen(false)}
          type="eye_refresh"
          language={state.profile?.language || 'en'}
        />

        <GuidedRitualsModal
          isOpen={isDePuffModalOpen}
          onClose={() => setIsDePuffModalOpen(false)}
          type="depuff"
          language={state.profile?.language || 'en'}
        />

        <GuidedRitualsModal
          isOpen={isPostureModalOpen}
          onClose={() => setIsPostureModalOpen(false)}
          type="posture"
          language={state.profile?.language || 'en'}
        />
      </CardContent>
    </Card>
  );
}
