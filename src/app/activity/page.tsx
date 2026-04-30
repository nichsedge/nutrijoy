"use client";

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Zap, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOCK_ACTIVITIES = [
  { name: 'Walking (Casual)', met: 3.0 },
  { name: 'Running (Moderate)', met: 8.0 },
  { name: 'Cycling (Fast)', met: 10.0 },
  { name: 'Housework (Cleaning)', met: 3.5 },
  { name: 'Office Work (Sitting)', met: 1.5 },
  { name: 'Stairs Climbing', met: 9.0 },
  { name: 'Gym / Weightlifting', met: 6.0 },
];

export default function ActivityPage() {
  const { state, addActivity } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const [duration, setDuration] = useState('30');
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  const handleAddActivity = (name: string, met: number) => {
    if (!state.profile) return;
    const mins = parseInt(duration) || 0;
    // Calorie calculation: MET * Weight (kg) * (Duration / 60)
    const burned = Math.round(met * state.profile.weight * (mins / 60));

    addActivity({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      name,
      duration: mins,
      caloriesBurned: burned,
    });

    toast({
      title: t.done,
      description: `Logged ${burned} kcal burned!`,
    });
  };

  const filtered = MOCK_ACTIVITIES.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Shell>
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{t.logActivity}</h2>
          <p className="text-sm text-muted-foreground">Track how much energy your daily work/moves burn.</p>
        </div>

        <div className="space-y-4">
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-border/50">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Duration (Minutes)</label>
              <Input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)}
                className="text-2xl font-bold h-14 border-none focus-visible:ring-0 p-0 text-primary"
              />
           </div>

           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search activities..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 rounded-2xl border-2 border-primary/10 h-14"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filtered.map((act) => (
            <Card 
              key={act.name} 
              className="border-none shadow-sm rounded-2xl overflow-hidden hover:bg-accent/10 cursor-pointer transition-colors active:scale-95"
              onClick={() => handleAddActivity(act.name, act.met)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{act.name}</p>
                    <p className="text-xs text-muted-foreground">MET {act.met}</p>
                  </div>
                </div>
                <Zap className="w-5 h-5 text-primary opacity-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}