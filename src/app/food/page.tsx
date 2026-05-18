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
import type { FoodLogEntry } from '@/lib/types';

import { motion, AnimatePresence } from 'framer-motion';

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

  const [showHistory, setShowHistory] = useState(false);

  // Get unique previous foods, most recent first
  const uniquePreviousFoods = React.useMemo(() => {
    const map = new Map();
    [...state.foodLogs]
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach(log => {
        const key = log.name.toLowerCase();
        if (!map.has(key)) {
          map.set(key, log);
        }
      });
    return Array.from(map.values());
  }, [state.foodLogs]);

  const selectPreviousFood = (food: FoodLogEntry) => {
    setFormData({
      name: food.name,
      quantity: food.quantity,
      calories: food.calories.toString(),
      protein: food.protein.toString(),
      fiber: (food.fiber || 0).toString(),
      vitaminC: (food.vitaminC || 0).toString(),
      biotin: (food.biotin || 0).toString(),
      zinc: (food.zinc || 0).toString(),
      omega3: (food.omega3 || 0).toString(),
      vitaminE: (food.vitaminE || 0).toString(),
      sugar: food.sugar.toString(),
      sodium: food.sodium.toString()
    });
    setShowHistory(false);
    toast({
      title: t.autoFilled || "Auto-filled",
      description: `${t.loadedDetailsFor || "Loaded details for"} ${food.name}`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow digits, dots, and commas for nutrient fields
    if (name !== 'name' && name !== 'quantity') {
      if (value && !/^[0-9.,]*$/.test(value)) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const parseNutrient = (val: string) => {
    if (!val) return 0;
    const normalized = val.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addFoodLog({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      name: formData.name,
      quantity: formData.quantity || '1 serving',
      calories: parseNutrient(formData.calories),
      protein: parseNutrient(formData.protein),
      fiber: parseNutrient(formData.fiber),
      vitaminC: parseNutrient(formData.vitaminC),
      biotin: parseNutrient(formData.biotin),
      zinc: parseNutrient(formData.zinc),
      omega3: parseNutrient(formData.omega3),
      vitaminE: parseNutrient(formData.vitaminE),
      sugar: parseNutrient(formData.sugar),
      sodium: parseNutrient(formData.sodium),
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
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 pb-24"
      >
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

        {uniquePreviousFoods.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t.quickAddFromHistory || 'Quick Add from History'}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs font-bold text-primary"
              >
                {showHistory ? (t.close || 'Close') : (t.viewAll || 'View All')}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {uniquePreviousFoods.slice(0, 5).map((food, i) => (
                <button
                  key={i}
                  onClick={() => selectPreviousFood(food)}
                  className="px-4 py-2 rounded-full bg-primary/5 border border-primary/10 hover:bg-primary/10 hover:border-primary/20 text-sm font-medium transition-all flex items-center gap-2"
                >
                  <Plus className="w-3 h-3 text-primary" />
                  {food.name}
                </button>
              ))}
            </div>

            {showHistory && (
              <Card className="border-2 border-primary/10 rounded-3xl overflow-hidden shadow-sm bg-primary/5 animate-in fade-in slide-in-from-top-2">
                <CardContent className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
                  {uniquePreviousFoods.map((food, i) => (
                    <button
                      key={i}
                      onClick={() => selectPreviousFood(food)}
                      className="w-full p-3 text-left rounded-xl hover:bg-white transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold">{food.name}</p>
                        <p className="text-xs text-muted-foreground">{food.calories} kcal • {food.protein}g protein</p>
                      </div>
                      <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Card className="border-none rounded-[2.5rem] overflow-hidden shadow-xl glass-premium border border-white/40">
          <CardContent className="p-6">
            <form onSubmit={handleLog} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Food Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Nasi Goreng"
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => setShowHistory(false)}
                    className="rounded-xl border-primary/20"
                    required
                    autoComplete="off"
                  />
                  {formData.name.length > 1 && !uniquePreviousFoods.some(f => f.name === formData.name) && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-primary/10 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                      {uniquePreviousFoods
                        .filter(f => f.name.toLowerCase().includes(formData.name.toLowerCase()))
                        .map((food, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => selectPreviousFood(food)}
                            className="w-full p-2 text-left hover:bg-primary/5 text-sm transition-colors border-b last:border-0 border-primary/5"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{food.name}</span>
                              <span className="text-[10px] text-muted-foreground">{food.calories} kcal</span>
                            </div>
                          </button>
                        ))
                      }
                    </div>
                  )}
                </div>
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
                    type="text"
                    inputMode="decimal"
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
                    type="text"
                    inputMode="decimal"
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
                    type="text"
                    inputMode="decimal"
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
                    type="text"
                    inputMode="decimal"
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
                    type="text"
                    inputMode="decimal"
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
                    type="text"
                    inputMode="decimal"
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
                    type="text"
                    inputMode="decimal"
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
                    type="text"
                    inputMode="decimal"
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
                    type="text"
                    inputMode="decimal"
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
                    type="text"
                    inputMode="decimal"
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
          <h3 className="font-bold mb-4">{t.todaysMealHistory || "Today's Meal History"}</h3>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {[...state.foodLogs]
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((log) => (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-none shadow-sm rounded-2xl overflow-hidden group">
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
                </motion.div>
              ))}
            </AnimatePresence>
            {state.foodLogs.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center py-12 border-2 border-dashed border-primary/10 rounded-3xl"
              >
                <Utensils className="w-12 h-12 mx-auto text-primary/20 mb-3" />
                <p className="text-sm text-muted-foreground italic">{t.noLogs || "No meals logged today yet."}</p>
              </motion.div>
            )}
          </div>
        </section>
      </motion.div>
    </Shell>
  );
}
