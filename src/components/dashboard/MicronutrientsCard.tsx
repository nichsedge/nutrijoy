"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NutrientProps {
  label: string;
  consumed: number;
  limit: number;
  unit: string;
  icon: React.ReactNode;
  percent: number;
}

export function MicronutrientsCard({ t, nutrients }: { t: any, nutrients: NutrientProps[] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Show first 2 by default, rest in collapsible
  const primaryNutrients = nutrients.slice(0, 2);
  const secondaryNutrients = nutrients.slice(2);

  return (
    <Card className="border-none shadow-sm bg-accent/30 col-span-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm uppercase tracking-tighter">Glow Nutrients</span>
            </div>
            <CollapsibleTrigger asChild>
              <button className="p-1 hover:bg-white/50 rounded-full transition-colors">
                {isOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
              </button>
            </CollapsibleTrigger>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {primaryNutrients.map((n, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary/80">
                  {React.cloneElement(n.icon as React.ReactElement, { className: "w-3 h-3" })}
                  {n.label}
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span>{n.consumed}{n.unit}</span>
                  <span className="opacity-50">/ {n.limit}{n.unit}</span>
                </div>
                <Progress value={n.percent} className="h-1.5" />
              </div>
            ))}
          </div>

          {secondaryNutrients.length > 0 && (
            <CollapsibleContent className="space-y-4 pt-2 border-t border-primary/5">
              <div className="grid grid-cols-2 gap-4">
                {secondaryNutrients.map((n, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary/80">
                      {React.cloneElement(n.icon as React.ReactElement, { className: "w-3 h-3" })}
                      {n.label}
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span>{n.consumed}{n.unit}</span>
                      <span className="opacity-50">/ {n.limit}{n.unit}</span>
                    </div>
                    <Progress value={n.percent} className="h-1.5" />
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