'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

export type BreathPhase = 'inhale' | 'hold' | 'exhale';

interface BreathworkViewProps {
  phase: BreathPhase;
  seconds: number;
  cycles: number;
  totalCycles: number;
  isRunning: boolean;
  isId: boolean;
  onToggleRun: () => void;
  onReset: () => void;
}

const PHASE_LABELS: Record<BreathPhase, { id: string; en: string }> = {
  inhale: { id: 'Tarik Napas Perlahan (4s)', en: 'Inhale Gently (4s)' },
  hold: { id: 'Tahan Napas & Rileks', en: 'Hold & Find Stillness' },
  exhale: { id: 'Hembuskan Napas Perlahan', en: 'Exhale Smoothly' },
};

// Seconds per phase; digest uses a shorter 4-4-4 rhythm.
const PHASE_SECONDS = (phase: BreathPhase, shortRhythm: boolean) =>
  phase === 'inhale' ? 4 : phase === 'hold' ? (shortRhythm ? 4 : 7) : shortRhythm ? 4 : 8;

export function BreathworkView({
  phase,
  seconds,
  cycles,
  totalCycles,
  isRunning,
  isId,
  onToggleRun,
  onReset,
}: BreathworkViewProps) {
  const label = PHASE_LABELS[phase];
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-6 py-4 flex flex-col items-center">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Expanding / Contracting Breathing Orb */}
        <motion.div
          animate={
            reduceMotion
              ? { opacity: 0.8 }
              : {
                  scale: phase === 'inhale' ? [1, 1.45] : phase === 'hold' ? 1.45 : [1.45, 1],
                  opacity: phase === 'hold' ? 0.9 : 0.7,
                }
          }
          transition={reduceMotion ? undefined : { duration: PHASE_SECONDS(phase, totalCycles === 2), ease: 'easeInOut' }}
          className={`absolute inset-4 rounded-full filter blur-md ${
            phase === 'inhale'
              ? 'bg-gradient-to-tr from-indigo-400 to-pink-400'
              : phase === 'hold'
                ? 'bg-gradient-to-tr from-purple-500 to-indigo-500'
                : 'bg-gradient-to-tr from-blue-400 to-teal-400'
          }`}
        />

        <div className="relative z-10 w-28 h-28 rounded-full bg-white shadow-xl flex flex-col items-center justify-center border border-white/80">
          <span className="text-3xl font-black font-headline text-purple-900">{seconds}</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-purple-600 opacity-70">{phase}</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h4 className="text-sm font-black text-purple-900">{isId ? label.id : label.en}</h4>
        <p className="text-xs font-bold text-muted-foreground">
          {isId ? `Siklus ${cycles} dari ${totalCycles}` : `Cycle ${cycles} of ${totalCycles}`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          onClick={onToggleRun}
          className="rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 shadow-md shadow-purple-500/20"
        >
          {isRunning ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
          {isRunning ? (isId ? 'Jeda' : 'Pause') : isId ? 'Mulai' : 'Start'}
        </Button>
        <Button onClick={onReset} variant="outline" size="icon" aria-label={isId ? 'Ulangi dari awal' : 'Restart breathing exercise'} className="rounded-full">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
