import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ChevronDown, ChevronUp, Droplets, Moon, Zap, HeartHandshake } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { Translation } from '@/lib/translations';
import type { SkinGlowScore } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NutrientProps {
  label: string;
  consumed: number;
  limit: number;
  unit: string;
  icon: React.ReactNode;
  percent: number;
}

interface MicronutrientsCardProps {
  t: Translation;
  nutrients: NutrientProps[];
  glowScore?: SkinGlowScore;
}

export function MicronutrientsCard({ t, nutrients, glowScore }: MicronutrientsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Show first 2 by default, rest in collapsible
  const primaryNutrients = nutrients.slice(0, 2);
  const secondaryNutrients = nutrients.slice(2);

  const getStatusBadge = () => {
    if (!glowScore) return null;
    if (glowScore.status === 'radiant') {
      return 'bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-rose-500/20 text-rose-600 border-rose-300/40';
    }
    if (glowScore.status === 'blooming') {
      return 'bg-emerald-500/15 text-emerald-700 border-emerald-300/40';
    }
    return 'bg-blue-500/15 text-blue-700 border-blue-300/40';
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-amber-500/5 col-span-2 rounded-[2rem] border border-pink-500/10">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600 font-black">
              <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-rose-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest">{t.glowIndex || 'Skin Glow & Beauty'}</span>
                {glowScore && (
                  <span className="text-[11px] font-bold text-muted-foreground">{glowScore.label}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {glowScore && (
                <div className={cn("px-2.5 py-1 rounded-full text-xs font-black border flex items-center gap-1", getStatusBadge())}>
                  <span className="text-xs">✨</span>
                  <span>{glowScore.score}%</span>
                </div>
              )}
              <CollapsibleTrigger asChild>
                <button className="p-1 hover:bg-white/60 rounded-full transition-colors">
                  {isOpen ? <ChevronUp className="w-4 h-4 text-rose-500" /> : <ChevronDown className="w-4 h-4 text-rose-500" />}
                </button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Glow Pillars Sub-Score Preview */}
          {glowScore && (
            <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-white/70 rounded-2xl border border-pink-500/10 shadow-xs text-center">
              <div className="space-y-0.5">
                <div className="flex items-center justify-center gap-1 text-[9px] font-black text-rose-600 uppercase tracking-tight">
                  <Zap className="w-2.5 h-2.5" />
                  <span>Antioxidants</span>
                </div>
                <p className="text-xs font-black">{glowScore.antioxidantScore}<span className="text-[9px] font-normal opacity-50">/40</span></p>
              </div>
              <div className="space-y-0.5 border-x border-pink-500/10 px-1">
                <div className="flex items-center justify-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-tight">
                  <Droplets className="w-2.5 h-2.5" />
                  <span>Hydration</span>
                </div>
                <p className="text-xs font-black">{glowScore.hydrationScore}<span className="text-[9px] font-normal opacity-50">/35</span></p>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center justify-center gap-1 text-[9px] font-black text-purple-600 uppercase tracking-tight">
                  <Moon className="w-2.5 h-2.5" />
                  <span>Sleep</span>
                </div>
                <p className="text-xs font-black">{glowScore.sleepScore}<span className="text-[9px] font-normal opacity-50">/25</span></p>
              </div>
            </div>
          )}

          {glowScore?.topTip && (
            <div className="text-[11px] font-medium text-rose-900/80 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/15 leading-snug flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>{glowScore.topTip}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-1">
            {primaryNutrients.map((n, i) => (
              <div key={i} className="space-y-1 bg-white/60 p-2.5 rounded-xl border border-pink-500/10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                  <span className="[&>svg]:w-3 [&>svg]:h-3 text-rose-500">{n.icon}</span>
                  {n.label}
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span>{n.consumed}{n.unit}</span>
                  <span className="opacity-50">/ {n.limit}{n.unit}</span>
                </div>
                <Progress value={n.percent} className="h-1.5 bg-rose-100 [&>div]:bg-rose-500" />
              </div>
            ))}
          </div>

          {secondaryNutrients.length > 0 && (
            <CollapsibleContent className="space-y-4 pt-2 border-t border-rose-500/10">
              <div className="grid grid-cols-2 gap-4">
                {secondaryNutrients.map((n, i) => (
                  <div key={i} className="space-y-1 bg-white/60 p-2.5 rounded-xl border border-pink-500/10">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                      <span className="[&>svg]:w-3 [&>svg]:h-3 text-rose-500">{n.icon}</span>
                      {n.label}
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span>{n.consumed}{n.unit}</span>
                      <span className="opacity-50">/ {n.limit}{n.unit}</span>
                    </div>
                    <Progress value={n.percent} className="h-1.5 bg-rose-100 [&>div]:bg-rose-500" />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          )}
        </CardContent>
      </Collapsible>
    </Card>
  );
}

