'use client';

import React, { useState } from 'react';
import { useAppState, useAppActions } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Utensils,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  BookOpen,
  Leaf,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FoodLogEntry, GlowRecipe } from '@/lib/types';
import { GLOW_RECIPES } from '@/lib/glowRecipes';
import { GuidedRitualsModal } from '@/components/wellness/GuidedRitualsModal';
import { GutHealthCard } from '@/components/wellness/GutHealthCard';
import { GlucoseCoachCard } from '@/components/wellness/GlucoseCoachCard';
import { BeautyTeaCard } from '@/components/wellness/BeautyTeaCard';
import { CellularHydrationCard } from '@/components/wellness/CellularHydrationCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function FoodLoggingPage() {
  const state = useAppState();
  const { addFoodLog, removeFoodLog } = useAppActions();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('log');
  const [showMicronutrients, setShowMicronutrients] = useState(false);
  const [isDigestModalOpen, setIsDigestModalOpen] = useState(false);

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
    sodium: '',
  });

  const [showHistory, setShowHistory] = useState(false);

  // Get unique previous foods, most recent first
  const uniquePreviousFoods = React.useMemo(() => {
    const map = new Map();
    [...state.foodLogs]
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach((log) => {
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
      protein: (food.protein || 0).toString(),
      fiber: (food.fiber || 0).toString(),
      vitaminC: (food.vitaminC || 0).toString(),
      biotin: (food.biotin || 0).toString(),
      zinc: (food.zinc || 0).toString(),
      omega3: (food.omega3 || 0).toString(),
      vitaminE: (food.vitaminE || 0).toString(),
      sugar: (food.sugar || 0).toString(),
      sodium: (food.sodium || 0).toString(),
    });
    setShowHistory(false);
    toast({
      title: t.autoFilled || 'Auto-filled',
      description: `${t.loadedDetailsFor || 'Loaded details for'} ${food.name}`,
    });
  };

  const selectGlowRecipe = (recipe: GlowRecipe) => {
    setFormData({
      name: isId ? recipe.nameId : recipe.name,
      quantity: recipe.quantity,
      calories: recipe.calories.toString(),
      protein: recipe.protein.toString(),
      fiber: recipe.fiber.toString(),
      vitaminC: recipe.vitaminC.toString(),
      biotin: recipe.biotin.toString(),
      zinc: recipe.zinc.toString(),
      omega3: recipe.omega3.toString(),
      vitaminE: recipe.vitaminE.toString(),
      sugar: recipe.sugar.toString(),
      sodium: recipe.sodium.toString(),
    });
    setActiveTab('log');
    toast({
      title: '✨ Glow Recipe Loaded',
      description: `${isId ? recipe.nameId : recipe.name} ${isId ? 'dimuat ke form.' : 'loaded into logging form.'}`,
    });
  };

  const quickLogGlowRecipe = (recipe: GlowRecipe) => {
    addFoodLog({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      name: isId ? recipe.nameId : recipe.name,
      quantity: recipe.quantity,
      calories: recipe.calories,
      protein: recipe.protein,
      fiber: recipe.fiber,
      vitaminC: recipe.vitaminC,
      biotin: recipe.biotin,
      zinc: recipe.zinc,
      omega3: recipe.omega3,
      vitaminE: recipe.vitaminE,
      sugar: recipe.sugar,
      sodium: recipe.sodium,
    });

    toast({
      title: '✨ ' + (isId ? 'Resep Tercatat!' : 'Recipe Logged!'),
      description: `${t.recipeLogged || 'Added'} ${isId ? recipe.nameId : recipe.name}`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== 'name' && name !== 'quantity') {
      if (value && !/^[0-9.,]*$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      sodium: '',
    });

    toast({
      title: t.done,
      description: `Logged ${formData.name} successfully!`,
    });
  };

  return (
    <Shell>
      <div className="space-y-5 animate-in fade-in duration-300 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">{t.logFood}</h2>
            <p className="text-xs text-muted-foreground font-medium">
              {isId ? 'Pencatatan nutrisi & antioksidan harian' : 'Nourish your body & skin today'}
            </p>
          </div>
        </div>

        {/* 3-Tab Segmented Control */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full h-12 p-1 bg-accent/40 rounded-2xl">
            <TabsTrigger
              value="log"
              className="rounded-xl text-xs font-black tracking-wide data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
            >
              <Utensils className="w-3.5 h-3.5 mr-1.5 text-primary" />
              {isId ? 'Catat' : 'Log Meal'}
            </TabsTrigger>
            <TabsTrigger
              value="recipes"
              className="rounded-xl text-xs font-black tracking-wide data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
              {isId ? 'Resep Glow' : 'Glow Recipes'}
            </TabsTrigger>
            <TabsTrigger
              value="digest"
              className="rounded-xl text-xs font-black tracking-wide data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-xs transition-all"
            >
              <Leaf className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              {isId ? 'Pencernaan' : 'Digestion'}
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: LOG MEAL */}
          <TabsContent value="log" className="space-y-5 mt-4">
            {/* Quick Add from History Chips */}
            {uniquePreviousFoods.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    {t.quickAddFromHistory || 'Quick Add'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-[10px] font-black uppercase tracking-wider text-primary hover:underline"
                  >
                    {showHistory ? t.close || 'Close' : t.viewAll || 'View All'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {uniquePreviousFoods.slice(0, 4).map((food, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectPreviousFood(food)}
                      className="px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/15 text-xs font-bold text-foreground transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-3 h-3 text-primary" />
                      {food.name}
                    </button>
                  ))}
                </div>

                {showHistory && (
                  <Card className="border border-primary/15 rounded-2xl overflow-hidden shadow-xs bg-primary/5">
                    <CardContent className="p-3 space-y-1 max-h-[220px] overflow-y-auto">
                      {uniquePreviousFoods.map((food, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selectPreviousFood(food)}
                          className="w-full p-2.5 text-left rounded-xl hover:bg-white transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <p className="font-bold text-xs">{food.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {food.calories} kcal • {food.protein || 0}g protein
                            </p>
                          </div>
                          <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Streamlined Log Form */}
            <Card className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm bg-white">
              <CardContent className="p-5">
                <form onSubmit={handleLog} className="space-y-4">
                  {/* Food Name & Auto-complete */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                      {isId ? 'Nama Makanan' : 'Food Name'}
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g. Avocado Toast / Nasi Dada Ayam"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setShowHistory(false)}
                        className="rounded-xl border-primary/20 h-11 font-medium"
                        required
                        autoComplete="off"
                      />
                      {formData.name.length > 1 &&
                        !uniquePreviousFoods.some((f) => f.name.toLowerCase() === formData.name.toLowerCase()) && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-primary/15 rounded-xl shadow-lg max-h-36 overflow-y-auto">
                            {uniquePreviousFoods
                              .filter((f) => f.name.toLowerCase().includes(formData.name.toLowerCase()))
                              .map((food, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => selectPreviousFood(food)}
                                  className="w-full p-2 text-left hover:bg-primary/5 text-xs transition-colors border-b last:border-0 border-primary/5 flex justify-between items-center"
                                >
                                  <span className="font-bold">{food.name}</span>
                                  <span className="text-[10px] text-muted-foreground">{food.calories} kcal</span>
                                </button>
                              ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Core Inputs: Quantity, Calories, Protein */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="quantity" className="text-[11px] font-bold text-muted-foreground">
                        {isId ? 'Porsi' : 'Portion'}
                      </Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        placeholder="1 plate"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="rounded-xl border-primary/20 h-10 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="calories" className="text-[11px] font-black text-primary">
                        Calories (kcal)
                      </Label>
                      <Input
                        id="calories"
                        name="calories"
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={formData.calories}
                        onChange={handleInputChange}
                        className="rounded-xl border-primary/30 h-10 text-xs font-bold"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="protein" className="text-[11px] font-black text-rose-600">
                        {t.protein || 'Protein'} (g)
                      </Label>
                      <Input
                        id="protein"
                        name="protein"
                        type="text"
                        inputMode="decimal"
                        placeholder="0"
                        value={formData.protein}
                        onChange={handleInputChange}
                        className="rounded-xl border-rose-200 h-10 text-xs font-bold"
                      />
                    </div>
                  </div>

                  {/* Collapsible Micronutrients & Beauty Minerals */}
                  <Collapsible open={showMicronutrients} onOpenChange={setShowMicronutrients} className="pt-1">
                    <CollapsibleTrigger asChild>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-accent/30 hover:bg-accent/50 text-[11px] font-black uppercase tracking-wider text-muted-foreground transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                          {isId ? 'Detail Mikronutrien & Kulit' : 'Micronutrients & Skin Markers'}
                        </span>
                        {showMicronutrients ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="space-y-3 pt-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="fiber" className="text-[10px] font-bold text-muted-foreground">
                            {t.fiber || 'Fiber'} (g)
                          </Label>
                          <Input
                            id="fiber"
                            name="fiber"
                            inputMode="decimal"
                            placeholder="0"
                            value={formData.fiber}
                            onChange={handleInputChange}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="vitaminC" className="text-[10px] font-bold text-muted-foreground">
                            {t.vitaminC || 'Vitamin C'} (mg)
                          </Label>
                          <Input
                            id="vitaminC"
                            name="vitaminC"
                            inputMode="decimal"
                            placeholder="0"
                            value={formData.vitaminC}
                            onChange={handleInputChange}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="biotin" className="text-[10px] font-bold text-muted-foreground">
                            {t.biotin || 'Biotin'} (mcg)
                          </Label>
                          <Input
                            id="biotin"
                            name="biotin"
                            inputMode="decimal"
                            placeholder="0"
                            value={formData.biotin}
                            onChange={handleInputChange}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="zinc" className="text-[10px] font-bold text-muted-foreground">
                            {t.zinc || 'Zinc'} (mg)
                          </Label>
                          <Input
                            id="zinc"
                            name="zinc"
                            inputMode="decimal"
                            placeholder="0"
                            value={formData.zinc}
                            onChange={handleInputChange}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="omega3" className="text-[10px] font-bold text-muted-foreground">
                            {t.omega3 || 'Omega-3'} (mg)
                          </Label>
                          <Input
                            id="omega3"
                            name="omega3"
                            inputMode="decimal"
                            placeholder="0"
                            value={formData.omega3}
                            onChange={handleInputChange}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="vitaminE" className="text-[10px] font-bold text-muted-foreground">
                            {t.vitaminE || 'Vitamin E'} (mg)
                          </Label>
                          <Input
                            id="vitaminE"
                            name="vitaminE"
                            inputMode="decimal"
                            placeholder="0"
                            value={formData.vitaminE}
                            onChange={handleInputChange}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="sugar" className="text-[10px] font-bold text-muted-foreground">
                            {t.sugar || 'Sugar'} (g)
                          </Label>
                          <Input
                            id="sugar"
                            name="sugar"
                            inputMode="decimal"
                            placeholder="0"
                            value={formData.sugar}
                            onChange={handleInputChange}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="sodium" className="text-[10px] font-bold text-muted-foreground">
                            {t.sodium || 'Sodium'} (mg)
                          </Label>
                          <Input
                            id="sodium"
                            name="sodium"
                            inputMode="decimal"
                            placeholder="0"
                            value={formData.sodium}
                            onChange={handleInputChange}
                            className="rounded-xl h-9 text-xs"
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Button
                    type="submit"
                    className="w-full rounded-2xl py-5 text-sm font-black shadow-md shadow-primary/20 mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> {isId ? 'CATAT MAKANAN' : 'LOG MEAL'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Today's Logged Meals History */}
            <div className="space-y-3 pt-2">
              <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground px-1">
                {t.todaysMealHistory || "Today's Meals"}
              </h3>

              <div className="space-y-2.5">
                <AnimatePresence mode="popLayout">
                  {[...state.foodLogs]
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((log) => (
                      <motion.div
                        key={log.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="border border-slate-100 shadow-2xs rounded-2xl overflow-hidden group">
                          <CardContent className="p-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                <Utensils className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-xs capitalize text-foreground">{log.name}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {log.quantity} • {log.calories} kcal
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {log.protein !== undefined && (
                                <div className="text-right">
                                  <p className="text-[9px] uppercase font-bold text-muted-foreground">
                                    {t.protein || 'Protein'}
                                  </p>
                                  <p className="text-xs font-black text-rose-600">{log.protein}g</p>
                                </div>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFoodLog(log.id)}
                                aria-label={`${t.deleteEntry}: ${log.name}`}
                                className="w-7 h-7 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </AnimatePresence>

                {state.foodLogs.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Utensils className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">
                      {t.noLogs || 'No meals logged today yet.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: GLOW RECIPES */}
          <TabsContent value="recipes" className="space-y-4 mt-4 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-muted-foreground">
                {isId ? 'Resep kaya antioksidan & kolagen' : 'Antioxidant & collagen-supporting meals'}
              </span>
              <span className="text-[10px] font-black bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full">
                {GLOW_RECIPES.length} {isId ? 'Resep' : 'Recipes'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {GLOW_RECIPES.map((recipe) => (
                <Card
                  key={recipe.id}
                  className="border border-pink-500/15 shadow-xs bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-amber-500/5 rounded-2xl overflow-hidden hover:border-pink-500/30 transition-all"
                >
                  <CardContent className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-rose-500/10 px-2 py-0.5 rounded-full">
                          {isId ? recipe.tagId : recipe.tag}
                        </span>
                        <h4 className="text-sm font-black text-foreground">{isId ? recipe.nameId : recipe.name}</h4>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-rose-600">{recipe.calories} kcal</p>
                        <p className="text-[10px] font-bold text-muted-foreground">{recipe.protein}g protein</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {isId ? recipe.glowBenefitId : recipe.glowBenefit}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-bold text-rose-700/80">
                      <span className="bg-white px-1.5 py-0.5 rounded-md border border-rose-100">
                        🍊 Vit C: {recipe.vitaminC}mg
                      </span>
                      <span className="bg-white px-1.5 py-0.5 rounded-md border border-rose-100">
                        🐟 Ω-3: {recipe.omega3}mg
                      </span>
                      <span className="bg-white px-1.5 py-0.5 rounded-md border border-rose-100">
                        ⚡ Zinc: {recipe.zinc}mg
                      </span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => selectGlowRecipe(recipe)}
                        className="flex-1 h-8 rounded-xl text-[11px] font-bold border-rose-200 text-rose-700 bg-white hover:bg-rose-50"
                      >
                        {isId ? 'Isi Form' : 'Fill Form'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => quickLogGlowRecipe(recipe)}
                        className="flex-1 h-8 rounded-xl text-[11px] font-black bg-rose-500 hover:bg-rose-600 text-white shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        {isId ? '1x Klik Catat' : '1-Tap Log'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: DIGESTION & GUT HEALTH */}
          <TabsContent value="digest" className="space-y-4 mt-4 animate-in fade-in-50 duration-200">
            {/* 30s Rest & Digest Breathing Launcher */}
            <Card className="border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 rounded-2xl shadow-xs overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
                    🍃
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                      {t.preMealBreathing || '30s Rest & Digest Prep'}
                    </h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {t.preMealBreathingDesc || '3 deep breaths to activate parasympathetic digestion.'}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsDigestModalOpen(true)}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8 px-3.5 shrink-0 shadow-xs"
                >
                  <Zap className="w-3 h-3 mr-1 fill-current" />
                  {isId ? 'Mulai' : 'Start'}
                </Button>
              </CardContent>
            </Card>

            <GutHealthCard />
            <GlucoseCoachCard />
            <BeautyTeaCard />
            <CellularHydrationCard />
          </TabsContent>
        </Tabs>
      </div>

      <GuidedRitualsModal
        isOpen={isDigestModalOpen}
        onClose={() => setIsDigestModalOpen(false)}
        type="digest"
        language={state.profile?.language || 'en'}
      />
    </Shell>
  );
}
