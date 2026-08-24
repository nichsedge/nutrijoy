'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RitualStep } from './rituals';

interface StepRoutineViewProps {
  steps: RitualStep[];
  currentStep: number;
  timeLeft: number;
  isRunning: boolean;
  isId: boolean;
  onToggleRun: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function StepRoutineView({
  steps,
  currentStep,
  timeLeft,
  isRunning,
  isId,
  onToggleRun,
  onPrev,
  onNext,
}: StepRoutineViewProps) {
  return (
    <div className="space-y-6 py-2">
      {/* Visual Step Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white p-5 rounded-2xl border border-pink-500/15 shadow-sm space-y-3 text-center"
        >
          <span className="text-2xl">{steps[currentStep].icon}</span>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-pink-600">{steps[currentStep].title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{steps[currentStep].desc}</p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="text-3xl font-black font-headline text-foreground">{timeLeft}s</div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Step Progress Dots */}
      <div className="flex justify-center gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-pink-500' : i < currentStep ? 'w-2 bg-pink-300' : 'w-2 bg-pink-100'}`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-3">
        <Button variant="outline" size="icon" onClick={onPrev} disabled={currentStep === 0} aria-label={isId ? 'Langkah sebelumnya' : 'Previous step'} className="rounded-full">
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          onClick={onToggleRun}
          className="rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 shadow-md shadow-pink-500/20"
        >
          {isRunning ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
          {isRunning ? (isId ? 'Jeda' : 'Pause') : isId ? 'Lanjutkan' : 'Resume'}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          disabled={currentStep === steps.length - 1}
          aria-label={isId ? 'Langkah berikutnya' : 'Next step'}
          className="rounded-full"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
