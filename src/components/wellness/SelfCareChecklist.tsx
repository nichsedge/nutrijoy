"use client";

import React from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles } from 'lucide-react';

export function SelfCareChecklist() {
  const { state, addSelfCareLog, removeSelfCareLog } = useApp();
  const t = getTranslation(state.profile?.language || 'en');

  const today = new Date().setHours(0, 0, 0, 0);
  const todaysLog = state.selfCareLogs?.find(s => new Date(s.timestamp).setHours(0,0,0,0) === today);

  const items = [
    { id: 'sunscreen', label: t.sunscreen },
    { id: 'cleansing', label: t.cleansing },
    { id: 'faceMassage', label: t.faceMassage },
    { id: 'noScreen', label: t.noScreen },
    { id: 'silkPillow', label: t.silkPillow },
  ];

  const handleToggle = (id: string, checked: boolean) => {
    const currentChecked = todaysLog?.checkedItems || [];
    let nextChecked = [];
    
    if (checked) {
      nextChecked = [...currentChecked, id];
    } else {
      nextChecked = currentChecked.filter(i => i !== id);
    }

    if (todaysLog) {
      removeSelfCareLog(todaysLog.id);
    }
    
    addSelfCareLog({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      checkedItems: nextChecked
    });
  };

  const checkedCount = todaysLog?.checkedItems?.length || 0;
  const progress = (checkedCount / items.length) * 100;

  return (
    <Card className="border-none shadow-sm bg-pink-500/5">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-500 font-bold">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm uppercase tracking-tighter">{t.selfCare}</span>
          </div>
          <span className="text-xs font-bold text-pink-500">{checkedCount} / {items.length}</span>
        </div>

        <div className="space-y-3">
          {items.map(item => {
            const isChecked = todaysLog?.checkedItems?.includes(item.id) || false;
            return (
              <div 
                key={item.id} 
                onClick={() => handleToggle(item.id, !isChecked)}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${isChecked ? 'bg-pink-500/10 border-pink-500/20' : 'bg-white border-transparent shadow-sm hover:border-pink-200'}`}
              >
                <span className={`text-sm font-medium ${isChecked ? 'text-pink-600' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
                <Checkbox 
                  checked={isChecked} 
                  onCheckedChange={(checked) => handleToggle(item.id, !!checked)}
                  className="rounded-full border-pink-200 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}