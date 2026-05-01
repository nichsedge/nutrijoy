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
  Sparkles 
} from 'lucide-react';
import { getTranslation } from '@/lib/translations';
import { useApp } from '../AppContext';
import Link from 'next/link';
import { Button } from '../ui/button';

export function ActionHub() {
  const { state, addWaterLog } = useApp();
  const t = getTranslation(state.profile?.language || 'en');

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
      onClick: () => {
        addWaterLog({
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          amountMl: 250
        });
      },
      color: 'bg-blue-500/10 text-blue-500' 
    },
    { 
      label: t.bodyMetrics, 
      icon: <Ruler className="w-6 h-6" />, 
      href: '/measurements', 
      color: 'bg-orange-500/10 text-orange-500' 
    },
    { 
      label: t.wellnessRitual, 
      icon: <Sparkles className="w-6 h-6" />, 
      href: '/check-in', 
      color: 'bg-indigo-500/10 text-indigo-500' 
    },
    { 
      label: t.planner, 
      icon: <Calendar className="w-6 h-6" />, 
      href: '/planner', 
      color: 'bg-green-500/10 text-green-500' 
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="flex items-center justify-center -mt-12 bg-primary text-white w-14 h-14 rounded-full shadow-lg border-4 border-background transition-transform active:scale-95 z-50 hover:rotate-90 duration-300"
        >
          <Plus className="w-8 h-8" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-[3rem] p-8 border-none bg-white shadow-2xl">
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