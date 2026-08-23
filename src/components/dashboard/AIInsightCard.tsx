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
  glowScore?: number;
  cyclePhase?: string;
}

import { motion, AnimatePresence } from 'framer-motion';

export function AIInsightCard({ 
  caloriesRemaining, 
  waterPercent, 
  sugarPercent, 
  proteinPercent,
  userName,
  hasSleepLog,
  hasActivityLog,
  glowScore,
  cyclePhase
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
          color: "bg-indigo-50/20 border-indigo-200/50",
          accent: "text-indigo-600",
          glow: "shadow-indigo-500/10"
        };
      }
      return {
        icon: <Coffee className="w-5 h-5 text-amber-600" />,
        title: "Fuel Your Day",
        text: "Morning is a great time for high-fiber carbs. It'll keep your focus sharp until lunch!",
        color: "bg-amber-50/20 border-amber-200/50",
        accent: "text-amber-700",
        glow: "shadow-amber-500/10"
      };
    }

    // Glow Score Milestone
    if (glowScore && glowScore >= 80) {
      return {
        icon: <Sparkles className="w-5 h-5 text-rose-500" />,
        title: "Radiance Peak",
        text: `Glowing vitality, ${userName}! Your antioxidant, hydration, and recovery markers are in harmony.`,
        color: "bg-rose-50/25 border-rose-200/60",
        accent: "text-rose-600",
        glow: "shadow-rose-500/15"
      };
    }

    // High Sugar Warning
    if (sugarPercent > 85) {
      return {
        icon: <Zap className="w-5 h-5 text-orange-500" />,
        title: "Sugar Alert",
        text: "You're near your sugar limit. Try reaching for some almonds or Greek yogurt to stabilize your energy.",
        color: "bg-orange-50/20 border-orange-200/50",
        accent: "text-orange-600",
        glow: "shadow-orange-500/10"
      };
    }

    // Hydration Focus
    if (waterPercent < 40) {
      return {
        icon: <Droplets className="w-5 h-5 text-blue-500" />,
        title: "Hydration & Glow",
        text: "Hydration is low. A glass of water now boosts skin elasticity and helps flush out facial puffiness.",
        color: "bg-blue-50/20 border-blue-200/50",
        accent: "text-blue-600",
        glow: "shadow-blue-500/10"
      };
    }

    // Activity Nudge
    if (!hasActivityLog && hour > 14) {
      return {
        icon: <Flame className="w-5 h-5 text-rose-500" />,
        title: "Movement Minute",
        text: "Even a 10-minute walk or light Pilates now improves circulation, posture, and natural radiance.",
        color: "bg-rose-50/20 border-rose-200/50",
        accent: "text-rose-600",
        glow: "shadow-rose-500/10"
      };
    }

    // Evening Wind-down
    if (hour >= 20 || hour < 5) {
      if (caloriesRemaining > 500) {
        return {
          icon: <Moon className="w-5 h-5 text-purple-500" />,
          title: "Night Routine",
          text: "Still have some calories left? A light, protein-rich snack like cottage cheese can help muscle recovery overnight.",
          color: "bg-purple-50/20 border-purple-200/50",
          accent: "text-purple-600",
          glow: "shadow-purple-500/10"
        };
      }
      return {
        icon: <Brain className="w-5 h-5 text-indigo-400" />,
        title: "Rest & Reset",
        text: "Wrap up your evening skincare and aim for 7-9 hours of sleep to let your skin and metabolism regenerate.",
        color: "bg-indigo-50/20 border-indigo-200/50",
        accent: "text-indigo-600",
        glow: "shadow-indigo-500/10"
      };
    }

    // High Protein Achievement
    if (proteinPercent > 100) {
       return {
        icon: <Zap className="w-5 h-5 text-emerald-500" />,
        title: "Protein Power",
        text: "Incredible work on your protein target! Your muscles, nails, and skin collagen are well-supported today.",
        color: "bg-emerald-50/20 border-emerald-200/50",
        accent: "text-emerald-600",
        glow: "shadow-emerald-500/10"
      };
    }

    // Cycle Phase Optimization
    if (cyclePhase === 'luteal') {
      return {
        icon: <Sparkles className="w-5 h-5 text-rose-500" />,
        title: "Luteal Phase Care",
        text: "Your basal metabolism is burning slightly more calories today. Nourish with complex carbs and magnesium.",
        color: "bg-rose-50/25 border-rose-200/50",
        accent: "text-rose-600",
        glow: "shadow-rose-500/10"
      };
    }

    // Default "Thinking" Insight
    return {
      icon: <Sparkles className="w-5 h-5 text-primary" />,
      title: "Metabolic Pulse",
      text: "Analyzing your data... You're maintaining a great rhythm. Keep logging to sharpen your personalized insights.",
      color: "bg-primary/5 border-primary/10",
      accent: "text-primary",
      glow: "shadow-primary/10"
    };
  }, [caloriesRemaining, waterPercent, sugarPercent, proteinPercent, userName, hasSleepLog, hasActivityLog, glowScore, cyclePhase]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className={cn(
        "border-none shadow-lg transition-all duration-700 overflow-hidden relative group rounded-[2.5rem] glass-premium",
        insight.color,
        insight.glow
      )}>
        <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700 [&>svg]:w-24 [&>svg]:h-24">
          {insight.icon}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        
        <CardContent className="p-6 flex flex-col gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center border border-white/50 group-hover:rotate-12 transition-transform duration-500">
              {insight.icon}
            </div>
            <div className="flex flex-col">
              <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", insight.accent)}>
                {insight.title}
              </span>
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Live Engine</span>
              </div>
            </div>
            <div className="ml-auto flex gap-1 bg-black/5 px-2 py-1 rounded-full">
              <div className="w-1 h-1 rounded-full bg-current animate-pulse opacity-40" />
              <div className="w-1 h-1 rounded-full bg-current animate-pulse opacity-40 delay-150" />
              <div className="w-1 h-1 rounded-full bg-current animate-pulse opacity-40 delay-300" />
            </div>
          </div>
          
          <p className="text-base font-semibold leading-relaxed text-foreground/90 mt-2">
            {insight.text}
          </p>
          
          <div className="flex items-center gap-4 mt-2 pt-4 border-t border-black/5">
             <div className="flex items-center gap-1.5 text-[9px] font-black opacity-40 uppercase tracking-widest">
               <Brain className="w-3.5 h-3.5" />
               Neural Core
             </div>
             <div className="flex items-center gap-1.5 text-[9px] font-black opacity-40 uppercase tracking-widest">
               <Info className="w-3.5 h-3.5" />
               Precision Mode
             </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
