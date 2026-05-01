"use client";

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Utensils, Plus, Check, Trash2, Activity } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function FoodLoggingPage() {
  const { state, addFoodLog, removeFoodLog } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    calories: '',
    protein: '',
    fiber: '',
    vitaminC: '',
    biotin: '',
    zinc: '',
    omega3: '',
    vitaminE: '',
    sugar: '',
    sodium: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addFoodLog({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      name: formData.name,
      quantity: formData.quantity || '1 serving',
      calories: parseInt(formData.calories) || 0,
      protein: parseInt(formData.protein) || 0,
      fiber: parseInt(formData.fiber) || 0,
      vitaminC: parseInt(formData.vitaminC) || 0,
      biotin: parseInt(formData.biotin) || 0,
      zinc: parseInt(formData.zinc) || 0,
      omega3: parseInt(formData.omega3) || 0,
      vitaminE: parseInt(formData.vitaminE) || 0,
      sugar: parseInt(formData.sugar) || 0,
      sodium: parseInt(formData.sodium) || 0,
    });

    setFormData({
      name: '',
      quantity: '',
      calories: '',
      protein: '',
      fiber: '',
      vitaminC: '',
      biotin: '',
      zinc: '',
      omega3: '',
      vitaminE: '',
      sugar: '',
      sodium: ''
    });

    toast({
      title: t.done,
      description: `Logged ${formData.name} successfully!`,
    });
  };

  return (
    <Shell>
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{t.logFood}</h2>
          <p className="text-sm text-muted-foreground">Manually enter your meal details below.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button asChild className="h-14 rounded-2xl flex items-center justify-center bg-primary hover:bg-primary/90 text-white shadow-md">
            <Link href="/food">
              <Utensils className="w-4 h-4 mr-2" />
              <span className="text-xs font-bold">LOG FOOD</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-14 rounded-2xl flex items-center justify-center border-2 border-primary/20 hover:border-primary text-primary bg-white hover:bg-primary/5 transition-all">
            <Link href="/activity">
              <Activity className="w-4 h-4 mr-2" />
              <span className="text-xs font-bold">LOG MOVE</span>
            </Link>
          </Button>
        </div>

        <Card className="border-2 border-primary/10 rounded-3xl overflow-hidden shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleLog} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Food Name</Label>
                <Input 
                  id="name"
                  name="name"
                  placeholder="e.g. Nasi Goreng" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="rounded-xl border-primary/20"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity"
                    name="quantity"
                    placeholder="e.g. 1 plate" 
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories (kcal)</Label>
                  <Input 
                    id="calories"
                    name="calories"
                    type="number"
                    placeholder="0" 
                    value={formData.calories}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="protein">{t.protein || 'Protein'} (g)</Label>
                  <Input 
                    id="protein"
                    name="protein"
                    type="number"
                    placeholder="0" 
                    value={formData.protein}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fiber">{t.fiber || 'Fiber'} (g)</Label>
                  <Input 
                    id="fiber"
                    name="fiber"
                    type="number"
                    placeholder="0" 
                    value={formData.fiber}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vitaminC">{t.vitaminC || 'Vitamin C'} (mg)</Label>
                  <Input 
                    id="vitaminC"
                    name="vitaminC"
                    type="number"
                    placeholder="0" 
                    value={formData.vitaminC}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="biotin">{t.biotin || 'Biotin'} (mcg)</Label>
                  <Input 
                    id="biotin"
                    name="biotin"
                    type="number"
                    placeholder="0" 
                    value={formData.biotin}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zinc">{t.zinc || 'Zinc'} (mg)</Label>
                  <Input 
                    id="zinc"
                    name="zinc"
                    type="number"
                    placeholder="0" 
                    value={formData.zinc}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="omega3">{t.omega3 || 'Omega-3'} (mg)</Label>
                  <Input 
                    id="omega3"
                    name="omega3"
                    type="number"
                    placeholder="0" 
                    value={formData.omega3}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vitaminE">{t.vitaminE || 'Vitamin E'} (mg)</Label>
                  <Input 
                    id="vitaminE"
                    name="vitaminE"
                    type="number"
                    placeholder="0" 
                    value={formData.vitaminE}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sugar">{t.sugar || 'Sugar'} (g)</Label>
                  <Input 
                    id="sugar"
                    name="sugar"
                    type="number"
                    placeholder="0" 
                    value={formData.sugar}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sodium">{t.sodium || 'Sodium'} (mg)</Label>
                  <Input 
                    id="sodium"
                    name="sodium"
                    type="number"
                    placeholder="0" 
                    value={formData.sodium}
                    onChange={handleInputChange}
                    className="rounded-xl border-primary/20"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full rounded-xl py-6 text-lg font-bold shadow-lg shadow-primary/20">
                <Plus className="w-5 h-5 mr-2" /> LOG MEAL
              </Button>
            </form>
          </CardContent>
        </Card>

        <section>
          <h3 className="font-bold mb-4">Today's Meal History</h3>
          <div className="space-y-3">
            {state.foodLogs.map((log) => (
              <Card key={log.id} className="border-none shadow-sm rounded-2xl overflow-hidden group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold capitalize">{log.name}</p>
                      <p className="text-xs text-muted-foreground">{log.quantity} • {log.calories} kcal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.protein || 'Protein'}</p>
                      <p className="text-xs font-bold text-primary">{log.protein || 0}g</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{t.sugar || 'Sugar'}</p>
                      <p className="text-xs font-bold text-secondary">{log.sugar}g</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFoodLog(log.id)}
                      className="w-8 h-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                       <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {state.foodLogs.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-primary/10 rounded-3xl">
                <Utensils className="w-12 h-12 mx-auto text-primary/20 mb-3" />
                <p className="text-sm text-muted-foreground italic">{t.noLogs}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Shell>
  );
}