"use client";

import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  Utensils, 
  Activity, 
  Droplets, 
  Ruler, 
  Plus, 
  Moon, 
  Calendar, 
  Sparkles,
  Camera,
  Coffee,
  Heart,
  UserCheck
} from 'lucide-react';
import { getTranslation } from '@/lib/translations';
import { useAppState, useAppActions } from '../AppContext';
import Link from 'next/link';
import { Button } from '../ui/button';
import { playChime, playSuccessChord } from '@/lib/soundEffects';
import { useToast } from '@/hooks/use-toast';

export function ActionHub() {
  const state = useAppState();
  const { addWaterLog } = useAppActions();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const handleQuickWater = () => {
    playChime();
    addWaterLog({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      amountMl: 250
    });
    toast({
      title: "💧 +250ml " + (isId ? "Tercatat" : "Logged"),
      description: isId ? "Terus jaga hidrasi kulitmu!" : "Keep that radiant hydration flowing!",
    });
  };

  const actions = [
    { 
      label: t.logMeal, 
      icon: <Utensils className="w-6 h-6" />, 
      href: '/food', 
      color: 'bg-primary/10 text-primary' 
    },
    { 
      label: t.logMove, 
      icon: <Activity className="w-6 h-6" />, 
      href: '/activity', 
      color: 'bg-secondary/10 text-secondary' 
    },
    { 
      label: t.drinkWater, 
      icon: <Droplets className="w-6 h-6" />, 
      onClick: handleQuickWater,
      color: 'bg-blue-500/10 text-blue-500' 
    },
    { 
      label: t.skinJournal || 'Skin Photo', 
      icon: <Camera className="w-6 h-6" />, 
      href: '/check-in', 
      color: 'bg-pink-500/10 text-pink-500' 
    },
    { 
      label: t.wellnessRitual, 
      icon: <Sparkles className="w-6 h-6" />, 
      href: '/check-in', 
      color: 'bg-indigo-500/10 text-indigo-500' 
    },
    { 
      label: t.bodyMetrics, 
      icon: <Ruler className="w-6 h-6" />, 
      href: '/measurements', 
      color: 'bg-orange-500/10 text-orange-500' 
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="flex items-center justify-center -mt-12 bg-primary text-white w-16 h-16 rounded-full shadow-xl shadow-primary/30 border-4 border-background transition-all active:scale-90 z-50 hover:rotate-90 duration-500 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus className="w-10 h-10 transition-transform group-hover:scale-110" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-[3rem] p-8 border-none glass-card shadow-2xl pb-12">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-black text-center tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            {t.actionHubTitle}
          </SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 pb-8">
          {actions.map((action, i) => {
            const content = (
              <div className="flex flex-col items-center gap-3 p-6 rounded-[2rem] bg-accent/5 hover:bg-accent/10 transition-colors border border-transparent hover:border-primary/10 group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <span className="text-sm font-black uppercase tracking-wider text-foreground/70">{action.label}</span>
              </div>
            );

            if (action.href) {
              return (
                <Link key={i} href={action.href}>
                  <SheetTrigger asChild>
                    {content}
                  </SheetTrigger>
                </Link>
              );
            }

            return (
              <div key={i} onClick={action.onClick} className="cursor-pointer">
                <SheetTrigger asChild>
                  {content}
                </SheetTrigger>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}