"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Droplets, Zap, Flame } from 'lucide-react';

interface DailyNudgeProps {
  caloriesRemaining: number;
  waterPercent: number;
  sugarPercent: number;
  userName: string;
}

export function DailyNudge({ caloriesRemaining, waterPercent, sugarPercent, userName }: DailyNudgeProps) {
  let nudge = {
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    text: `Ready for a great day, ${userName}? Let's track your first meal!`,
    color: "bg-amber-50"
  };

  if (waterPercent < 50) {
    nudge = {
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      text: "Hydration is key for skin glow! Time for a glass of water?",
      color: "bg-blue-50"
    };
  } else if (sugarPercent > 80) {
    nudge = {
      icon: <Zap className="w-5 h-5 text-orange-500" />,
      text: "Getting close to your sugar limit. Try a high-fiber snack next!",
      color: "bg-orange-50"
    };
  } else if (caloriesRemaining > 0 && caloriesRemaining < 500) {
    nudge = {
      icon: <Flame className="w-5 h-5 text-primary" />,
      text: "Almost at your calorie target! You're doing amazing today.",
      color: "bg-primary/5"
    };
  } else if (waterPercent >= 100) {
    nudge = {
      icon: <Sparkles className="w-5 h-5 text-green-500" />,
      text: "Hydration goal met! Your skin will thank you. ✨",
      color: "bg-green-50"
    };
  }

  return (
    <Card className={`border-none shadow-none ${nudge.color} transition-colors duration-500`}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
          {nudge.icon}
        </div>
        <p className="text-sm font-medium text-foreground/80 leading-tight">
          {nudge.text}
        </p>
      </CardContent>
    </Card>
  );
}