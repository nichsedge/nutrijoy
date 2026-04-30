"use client";

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Zap, Search, Clock, Footprints, Wind, Bike, Home, Briefcase, ArrowUpRight, Dumbbell, ChevronLeft, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const MOCK_ACTIVITIES = [
  { name: 'Walking (Casual)', met: 3.0, icon: Footprints, color: 'bg-blue-500' },
  { name: 'Running (Moderate)', met: 8.0, icon: Wind, color: 'bg-orange-500' },
  { name: 'Cycling (Fast)', met: 10.0, icon: Bike, color: 'bg-green-500' },
  { name: 'Housework (Cleaning)', met: 3.5, icon: Home, color: 'bg-purple-500' },
  { name: 'Office Work (Sitting)', met: 1.5, icon: Briefcase, color: 'bg-slate-500' },
  { name: 'Stairs Climbing', met: 9.0, icon: ArrowUpRight, color: 'bg-red-500' },
  { name: 'Gym / Weightlifting', met: 6.0, icon: Dumbbell, color: 'bg-indigo-500' },
];

const PRESETS = [15, 30, 45, 60, 90];

export default function ActivityPage() {
  const { state, addActivity } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('30');
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  const handleAddActivity = (name: string, met: number) => {
    if (!state.profile) return;
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const totalMins = (h * 60) + m;

    if (totalMins <= 0) {
      toast({
        title: "Invalid duration",
        description: "Please enter a valid duration.",
        variant: "destructive"
      });
      return;
    }

    // Calorie calculation: MET * Weight (kg) * (Duration / 60)
    const burned = Math.round(met * state.profile.weight * (totalMins / 60));

    addActivity({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      name,
      duration: totalMins,
      caloriesBurned: burned,
    });

    toast({
      title: t.done,
      description: `Logged ${burned} kcal burned for ${totalMins} mins of ${name}!`,
    });
  };

  const handleSetPreset = (mins: number) => {
    setHours(Math.floor(mins / 60).toString());
    setMinutes((mins % 60).toString());
  };

  const filtered = MOCK_ACTIVITIES.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Shell>
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{t.logActivity}</h2>
          <p className="text-sm text-muted-foreground">Track your energy burn</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button asChild variant="outline" className="h-14 rounded-2xl flex items-center justify-center border-2 border-primary/20 hover:border-primary text-primary bg-white hover:bg-primary/5 transition-all">
            <Link href="/food">
              <Utensils className="w-4 h-4 mr-2" />
              <span className="text-xs font-bold">LOG FOOD</span>
            </Link>
          </Button>
          <Button asChild className="h-14 rounded-2xl flex items-center justify-center bg-primary hover:bg-primary/90 text-white shadow-md">
            <Link href="/activity">
              <Activity className="w-4 h-4 mr-2" />
              <span className="text-xs font-bold">LOG MOVE</span>
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
           <Card className="border-none bg-white shadow-xl rounded-[2rem] overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {t.duration}
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={hours} 
                    onChange={(e) => setHours(e.target.value)}
                    className="text-4xl font-black h-16 border-none focus-visible:ring-0 p-0 text-primary bg-transparent w-16 text-center"
                    placeholder="0"
                  />
                  <span className="text-xl font-bold text-muted-foreground pt-3">h</span>
                  <span className="text-4xl font-black text-muted-foreground/30 mx-1">:</span>
                  <Input 
                    type="number" 
                    value={minutes} 
                    onChange={(e) => setMinutes(e.target.value)}
                    className="text-4xl font-black h-16 border-none focus-visible:ring-0 p-0 text-primary bg-transparent w-20 text-center"
                    placeholder="0"
                  />
                  <span className="text-xl font-bold text-muted-foreground pt-3">m</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PRESETS.map(p => {
                    const totalMins = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
                    return (
                      <button
                        key={p}
                        onClick={() => handleSetPreset(p)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          totalMins === p
                            ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/20' 
                            : 'bg-accent/50 text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        {p >= 60 ? `${Math.floor(p/60)}h ${p%60 > 0 ? `${p%60}m` : ''}` : `${p}m`}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
           </Card>

           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                placeholder="Search activities..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 rounded-2xl border-none bg-white shadow-md h-14 focus-visible:ring-2 focus-visible:ring-primary/20"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">{t.commonActivities}</p>
          {filtered.map((act) => {
            const Icon = act.icon;
            return (
              <Card 
                key={act.name} 
                className="border-none shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer active:scale-95 group"
                onClick={() => handleAddActivity(act.name, act.met)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${act.color} flex items-center justify-center text-white shadow-inner`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{act.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Zap className="w-3 h-3 text-orange-400 fill-orange-400" /> MET {act.met}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accent/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-10 bg-white/50 rounded-3xl border-2 border-dashed border-muted-foreground/20">
              <p className="text-sm text-muted-foreground italic">No activities found matching "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}