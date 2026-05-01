"use client";

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ruler, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MeasurementsPage() {
  const { state, addMeasurement, removeMeasurement } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    weight: state.profile?.weight?.toString() || '',
    waist: '',
    hips: '',
    neck: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateBodyFat = (waist: number, neck: number, hips: number, height: number, sex: 'male' | 'female') => {
    if (waist <= 0 || neck <= 0 || height <= 0 || (sex === 'female' && hips <= 0)) {
      return undefined;
    }
    
    // U.S. Navy Method (Metric)
    try {
      if (sex === 'male') {
        const val = 1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height);
        return (495 / val) - 450;
      } else {
        const val = 1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height);
        return (495 / val) - 450;
      }
    } catch (e) {
      return undefined;
    }
  };

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.profile) return;

    const w = parseFloat(formData.weight) || 0;
    const waist = parseFloat(formData.waist) || 0;
    const hips = parseFloat(formData.hips) || 0;
    const neck = parseFloat(formData.neck) || 0;

    let bf = calculateBodyFat(waist, neck, hips, state.profile.height, state.profile.sex);
    if (bf && (bf < 0 || bf > 100)) bf = undefined;

    addMeasurement({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      weight: w,
      waist,
      hips,
      neck,
      bodyFatPercentage: bf ? parseFloat(bf.toFixed(1)) : undefined,
    });

    setFormData({
      weight: state.profile?.weight?.toString() || '',
      waist: '',
      hips: '',
      neck: ''
    });

    toast({
      title: t.done,
      description: "Measurement logged successfully!",
    });
  };

  return (
    <Shell>
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pb-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{t.measurements || 'Measurements'}</h2>
          <p className="text-sm text-muted-foreground">Track your body composition</p>
        </div>

        <Card className="border-2 border-primary/10 rounded-3xl overflow-hidden shadow-sm bg-white">
          <CardContent className="p-6">
            <form onSubmit={handleLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">{t.weight} (kg)</Label>
                  <Input 
                    id="weight"
                    name="weight"
                    type="number"
                    step="0.1"
                    placeholder="0" 
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">{t.waist || 'Waist'} (cm)</Label>
                  <Input 
                    id="waist"
                    name="waist"
                    type="number"
                    step="0.1"
                    placeholder="0" 
                    value={formData.waist}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hips">{t.hips || 'Hips'} (cm)</Label>
                  <Input 
                    id="hips"
                    name="hips"
                    type="number"
                    step="0.1"
                    placeholder="0" 
                    value={formData.hips}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                    required={state.profile?.sex === 'female'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neck">{t.neck || 'Neck'} (cm)</Label>
                  <Input 
                    id="neck"
                    name="neck"
                    type="number"
                    step="0.1"
                    placeholder="0" 
                    value={formData.neck}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full rounded-xl py-6 text-lg font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 mt-4">
                <Plus className="w-5 h-5 mr-2" /> {t.logMeasurement || 'Log Measurement'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <section>
          <h3 className="font-bold mb-4">Measurement History</h3>
          <div className="space-y-3">
            {state.measurements?.sort((a, b) => b.timestamp - a.timestamp).map((log) => (
              <Card key={log.id} className="border-none shadow-sm rounded-2xl overflow-hidden group">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-primary">
                        <Ruler className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{new Date(log.timestamp).toLocaleDateString()}</p>
                        {log.bodyFatPercentage && (
                          <p className="text-xs font-bold text-primary">{t.bodyFat || 'Est. Body Fat'}: {log.bodyFatPercentage}%</p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeMeasurement(log.id)}
                      className="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                       <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 border-t pt-3">
                    <div className="text-center">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground">Weight</p>
                       <p className="text-sm font-bold">{log.weight} kg</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.waist || 'Waist'}</p>
                       <p className="text-sm font-bold">{log.waist} cm</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.hips || 'Hips'}</p>
                       <p className="text-sm font-bold">{log.hips || '-'} cm</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.neck || 'Neck'}</p>
                       <p className="text-sm font-bold">{log.neck} cm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!state.measurements || state.measurements.length === 0) && (
              <div className="text-center py-12 border-2 border-dashed border-primary/10 rounded-3xl">
                <Ruler className="w-12 h-12 mx-auto text-primary/20 mb-3" />
                <p className="text-sm text-muted-foreground italic">No measurements logged yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}
