"use client";

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Droplets, Zap, Flame, Moon, Coffee, Brain, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIInsightCardProps {
  caloriesRemaining: number;
  waterPercent: number;
  sugarPercent: number;
  proteinPercent: number;
  userName: string;
  hasSleepLog: boolean;
  hasActivityLog: boolean;
}

export function AIInsightCard({ 
  caloriesRemaining, 
  waterPercent, 
  sugarPercent, 
  proteinPercent,
  userName,
  hasSleepLog,
  hasActivityLog
}: AIInsightCardProps) {
  const insight = useMemo(() => {
    const hour = new Date().getHours();
    
    // Morning Insights
    if (hour >= 5 && hour < 11) {
      if (!hasSleepLog) {
        return {
          icon: <Moon className="w-5 h-5 text-indigo-500" />,
          title: "Morning Check-in",
          text: `Good morning, ${userName}! How did you sleep? Logging your rest helps me tune your energy goals.`,
          color: "bg-indigo-50/50 border-indigo-100",
          accent: "text-indigo-600"
        };
      }
      return {
        icon: <Coffee className="w-5 h-5 text-amber-600" />,
        title: "Fuel Your Day",
        text: "Morning is a great time for high-fiber carbs. It'll keep your focus sharp until lunch!",
        color: "bg-amber-50/50 border-amber-100",
        accent: "text-amber-700"
      };
    }

    // High Sugar Warning
    if (sugarPercent > 85) {
      return {
        icon: <Zap className="w-5 h-5 text-orange-500" />,
        title: "Sugar Alert",
        text: "You're near your sugar limit. Try reaching for some almonds or Greek yogurt to stabilize your energy.",
        color: "bg-orange-50/50 border-orange-100",
        accent: "text-orange-600"
      };
    }

    // Hydration Focus
    if (waterPercent < 40) {
      return {
        icon: <Droplets className="w-5 h-5 text-blue-500" />,
        title: "Hydration Logic",
        text: "Your focus might be dipping. A glass of water now can boost cognitive function by up to 14%.",
        color: "bg-blue-50/50 border-blue-100",
        accent: "text-blue-600"
      };
    }

    // Activity Nudge
    if (!hasActivityLog && hour > 14) {
      return {
        icon: <Flame className="w-5 h-5 text-rose-500" />,
        title: "Movement Minute",
        text: "Even a 10-minute walk now can help digestion and clear your mind for the evening.",
        color: "bg-rose-50/50 border-rose-100",
        accent: "text-rose-600"
      };
    }

    // Default "Thinking" Insight
    return {
      icon: <Sparkles className="w-5 h-5 text-primary" />,
      title: "NutriJoy AI",
      text: "You're doing great! Keep tracking to unlock more personalized metabolic insights.",
      color: "bg-primary/5 border-primary/10",
      accent: "text-primary"
    };
  }, [caloriesRemaining, waterPercent, sugarPercent, proteinPercent, userName, hasSleepLog, hasActivityLog]);

  return (
    <Card className={cn(
      "border-2 shadow-none transition-all duration-700 overflow-hidden relative group",
      insight.color
    )}>
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700 [&>svg]:w-24 [&>svg]:h-24">
        {insight.icon}
      </div>
      
      <CardContent className="p-5 flex flex-col gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
            {insight.icon}
          </div>
          <span className={cn("text-xs font-black uppercase tracking-widest", insight.accent)}>
            {insight.title}
          </span>
          <div className="ml-auto flex gap-1">
            <div className="w-1 h-1 rounded-full bg-current animate-pulse opacity-40" />
            <div className="w-1 h-1 rounded-full bg-current animate-pulse opacity-40 delay-150" />
            <div className="w-1 h-1 rounded-full bg-current animate-pulse opacity-40 delay-300" />
          </div>
        </div>
        
        <p className="text-[15px] font-medium leading-relaxed text-foreground/90">
          {insight.text}
        </p>
        
        <div className="flex items-center gap-4 mt-1">
           <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-40 uppercase">
             <Brain className="w-3 h-3" />
             AI Driven
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-40 uppercase">
             <Info className="w-3 h-3" />
             Context Aware
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
