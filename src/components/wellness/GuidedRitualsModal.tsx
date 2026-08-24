'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Moon, CheckCircle2, RotateCcw, UserCheck, Utensils } from 'lucide-react';
import { Language } from '@/lib/types';
import { playChime, playSuccessChord, playBreathTone } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';
import { useReducedMotion } from 'framer-motion';
import {
  RitualType,
  getRitualSteps,
  isStepRoutine,
  getTotalCycles,
  getModalTitle,
  getModalDesc,
  getCompletionMessage,
} from './guided-rituals/rituals';
import { StepRoutineView } from './guided-rituals/StepRoutineView';
import { BreathworkView } from './guided-rituals/BreathworkView';

interface GuidedRitualsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: RitualType;
  language?: Language;
}

function getHeaderIcon(type: RitualType) {
  if (type === 'depuff') return <Sparkles className="w-6 h-6" />;
  if (type === 'posture') return <UserCheck className="w-6 h-6" />;
  if (type === 'guasha') return <span className="text-2xl">💎</span>;
  if (type === 'cryo') return <span className="text-2xl">🧊</span>;
  if (type === 'drybrush') return <span className="text-2xl">🪥</span>;
  if (type === 'eye_refresh') return <span className="text-2xl">👁️</span>;
  if (type === 'digest') return <Utensils className="w-6 h-6" />;
  return <Moon className="w-6 h-6" />;
}

export function GuidedRitualsModal({ isOpen, onClose, type, language = 'en' }: GuidedRitualsModalProps) {
  const isId = language === 'id';
  const reduceMotion = useReducedMotion();

  const celebrate = useCallback(
    (particleCount: number) => {
      if (!reduceMotion) {
        confetti({ particleCount, spread: 60, origin: { y: 0.5 } });
      }
    },
    [reduceMotion]
  );

  const stepRoutine = isStepRoutine(type);
  const activeSteps = useMemo(() => getRitualSteps(type, isId), [type, isId]);
  const totalCycles = getTotalCycles(type);

  // Step routine state
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Breathwork state (4-7-8 method or 4-4-4 pre-meal digest)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [breathCycles, setBreathCycles] = useState(1);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setTimeLeft(getRitualSteps(type, isId)[0].duration);
      setIsRunning(true);
      setIsCompleted(false);

      setBreathPhase('inhale');
      setBreathSeconds(4);
      setBreathCycles(1);
    } else {
      setIsRunning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, type]);

  // Step timer loop (for all step routines)
  useEffect(() => {
    if (!stepRoutine || !isRunning || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentStep < activeSteps.length - 1) {
            setCurrentStep((s) => s + 1);
            playChime();
            return activeSteps[currentStep + 1].duration;
          } else {
            setIsCompleted(true);
            setIsRunning(false);
            playSuccessChord();
            celebrate(100);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [type, isRunning, currentStep, isCompleted, activeSteps, stepRoutine, celebrate]);

  // Breathwork timer loop
  useEffect(() => {
    if (stepRoutine || !isRunning || isCompleted) return;

    const timer = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          if (breathPhase === 'inhale') {
            setBreathPhase('hold');
            playBreathTone(528, 0.6);
            return type === 'digest' ? 4 : 7;
          } else if (breathPhase === 'hold') {
            setBreathPhase('exhale');
            playBreathTone(396, 0.8);
            return type === 'digest' ? 4 : 8;
          } else {
            // Completed 1 cycle
            if (breathCycles < totalCycles) {
              setBreathCycles((c) => c + 1);
              setBreathPhase('inhale');
              playBreathTone(432, 0.6);
              return 4;
            } else {
              setIsCompleted(true);
              setIsRunning(false);
              playSuccessChord();
              celebrate(80);
              return 0;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [type, isRunning, breathPhase, breathCycles, isCompleted, totalCycles, stepRoutine, celebrate]);

  const handleReset = () => {
    setIsCompleted(false);
    setIsRunning(true);
    if (stepRoutine) {
      setCurrentStep(0);
      setTimeLeft(activeSteps[0].duration);
    } else {
      setBreathPhase('inhale');
      setBreathSeconds(4);
      setBreathCycles(1);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-md rounded-[2.5rem] p-6 border-none shadow-2xl bg-gradient-to-b from-white via-pink-50/20 to-white">
        <DialogHeader className="text-center space-y-1">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 mb-1">
            {getHeaderIcon(type)}
          </div>
          <DialogTitle className="text-xl font-black">{getModalTitle(type, isId)}</DialogTitle>
          <p className="text-xs text-muted-foreground">{getModalDesc(type, isId)}</p>
        </DialogHeader>

        {isCompleted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-emerald-900">
                {isId ? 'Ritual Selesai! ✨' : 'Ritual Complete! ✨'}
              </h3>
              <p className="text-xs text-muted-foreground px-6 leading-relaxed">{getCompletionMessage(type, isId)}</p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <Button onClick={handleReset} variant="outline" className="rounded-full text-xs font-bold">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                {isId ? 'Ulangi' : 'Repeat'}
              </Button>
              <Button
                onClick={onClose}
                className="rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-6"
              >
                {isId ? 'Selesai' : 'Done'}
              </Button>
            </div>
          </div>
        ) : stepRoutine ? (
          <StepRoutineView
            steps={activeSteps}
            currentStep={currentStep}
            timeLeft={timeLeft}
            isRunning={isRunning}
            isId={isId}
            onToggleRun={() => setIsRunning(!isRunning)}
            onPrev={() => {
              if (currentStep > 0) {
                setCurrentStep((c) => c - 1);
                setTimeLeft(activeSteps[currentStep - 1].duration);
              }
            }}
            onNext={() => {
              if (currentStep < activeSteps.length - 1) {
                setCurrentStep((c) => c + 1);
                setTimeLeft(activeSteps[currentStep + 1].duration);
              }
            }}
          />
        ) : (
          <BreathworkView
            phase={breathPhase}
            seconds={breathSeconds}
            cycles={breathCycles}
            totalCycles={totalCycles}
            isRunning={isRunning}
            isId={isId}
            onToggleRun={() => setIsRunning(!isRunning)}
            onReset={handleReset}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
