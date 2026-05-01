"use client";

import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Flower2, Activity } from 'lucide-react';

export function CycleTracker() {
  const { state, addCycleLog } = useApp();
  const t = getTranslation(state.profile?.language || 'en');

  const [day, setDay] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const today = new Date().setHours(0, 0, 0, 0);
  const todaysLog = state.cycleLogs?.find(s => new Date(s.timestamp).setHours(0,0,0,0) === today);

  const symptomList = [
    { id: 'bloating', label: t.bloating },
    { id: 'cramps', label: t.cramps },
    { id: 'acne', label: t.acne },
    { id: 'moodSwings', label: t.moodSwings },
    { id: 'fatigue', label: t.fatigue },
  ];

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleLogCycle = () => {
    addCycleLog({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      cycleDay: day,
      symptoms: selectedSymptoms
    });
  };

  if (state.profile?.sex !== 'female') return null;

  if (todaysLog) {
    return (
      <Card className="border-none shadow-sm bg-rose-500/10 border-2 border-rose-500/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center">
              <Flower2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">{t.cycle}</p>
              <p className="text-sm font-bold">{t.cycleDay} {todaysLog.cycleDay}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
            {todaysLog.symptoms.slice(0, 2).map(s => (
              <span key={s} className="text-[9px] font-bold bg-rose-500/20 text-rose-600 px-1.5 py-0.5 rounded-full">
                {symptomList.find(sl => sl.id === s)?.label || s}
              </span>
            ))}
            {todaysLog.symptoms.length > 2 && <span className="text-[9px] font-bold text-rose-400">+{todaysLog.symptoms.length - 2}</span>}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm bg-rose-500/5">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-rose-500 font-bold">
          <Flower2 className="w-5 h-5" />
          <span className="text-sm uppercase tracking-tighter">{t.cycle}</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-1">
              <p className="text-xs font-bold">{t.cycleDay}</p>
              <Input 
                type="number" 
                value={day} 
                onChange={(e) => setDay(parseInt(e.target.value))}
                className="rounded-xl border-rose-100 focus-visible:ring-rose-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold">{t.symptoms}</p>
            <div className="flex flex-wrap gap-2">
              {symptomList.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleSymptom(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedSymptoms.includes(s.id) ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'bg-white border-rose-100 text-rose-400 hover:border-rose-300'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleLogCycle} 
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-6 rounded-2xl shadow-lg"
          >
            {t.logCycle}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}