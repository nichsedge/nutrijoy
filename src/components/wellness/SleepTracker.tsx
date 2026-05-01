"use client";

import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Moon, Star } from 'lucide-react';

export function SleepTracker() {
  const { state, addSleepLog } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  
  const [hours, setHours] = useState(8);
  const [restedness, setRestedness] = useState(3);

  const today = new Date().setHours(0, 0, 0, 0);
  const todaysSleep = state.sleepLogs?.find(s => new Date(s.timestamp).setHours(0,0,0,0) === today);

  const handleLogSleep = () => {
    addSleepLog({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      durationHours: hours,
      restednessScore: restedness
    });
  };

  const getRestednessLabel = (score: number) => {
    switch(score) {
      case 1: return t.veryTired;
      case 2: return t.somewhatTired;
      case 3: return t.neutral;
      case 4: return t.rested;
      case 5: return t.wellRested;
      default: return '';
    }
  };

  if (todaysSleep) {
    return (
      <Card className="border-none shadow-sm bg-purple-500/10 border-2 border-purple-500/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-purple-500 uppercase tracking-tighter">{t.sleep}</p>
              <p className="text-sm font-bold">{todaysSleep.durationHours} hrs • {getRestednessLabel(todaysSleep.restednessScore)}</p>
            </div>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className={`w-2.5 h-2.5 ${star <= todaysSleep.restednessScore ? 'fill-purple-500 text-purple-500' : 'text-purple-200'}`} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm bg-purple-500/5">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-purple-500 font-bold">
          <Moon className="w-5 h-5" />
          <span className="text-sm uppercase tracking-tighter">{t.sleep}</span>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>{t.sleepDuration}</span>
              <span className="text-purple-500">{hours}h</span>
            </div>
            <Slider 
              value={[hours]} 
              min={0} 
              max={12} 
              step={0.5} 
              onValueChange={(val) => setHours(val[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>{t.restedness}</span>
              <span className="text-purple-500">{getRestednessLabel(restedness)}</span>
            </div>
            <div className="flex justify-between">
               {[1,2,3,4,5].map(score => (
                 <button 
                  key={score}
                  onClick={() => setRestedness(score)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${restedness === score ? 'bg-purple-500 text-white shadow-lg scale-110' : 'bg-white text-purple-200 hover:bg-purple-50'}`}
                 >
                   <Star className={`w-5 h-5 ${restedness === score ? 'fill-white' : ''}`} />
                 </button>
               ))}
            </div>
          </div>

          <Button 
            onClick={handleLogSleep} 
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-6 rounded-2xl shadow-lg"
          >
            {t.logSleep}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}