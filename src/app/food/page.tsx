"use client";

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { naturalLanguageFoodLogging } from '@/ai/flows/natural-language-food-logging';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Utensils, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FoodLoggingPage() {
  const { state, addFoodLog } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLog = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const results = await naturalLanguageFoodLogging(input);
      results.forEach(item => {
        addFoodLog({
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          name: item.name,
          quantity: item.quantity,
          calories: item.estimatedCalories,
          sugar: item.estimatedSugar,
          sodium: item.estimatedSodium,
        });
      });
      setInput('');
      toast({
        title: t.done,
        description: `Logged ${results.length} items successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse food description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold">{t.logFood}</h2>
          <p className="text-sm text-muted-foreground">Type what you ate in plain English or Indonesian.</p>
        </div>

        <div className="relative group">
          <Textarea 
            placeholder={t.foodInputPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[160px] rounded-3xl border-2 border-primary/10 focus-visible:ring-primary p-6 text-lg transition-all bg-white"
          />
          <Button 
            onClick={handleLog} 
            disabled={loading || !input.trim()}
            className="absolute bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg shadow-primary/20"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </Button>
        </div>

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
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Sugar</p>
                    <p className="text-xs font-bold text-secondary">{log.sugar}g</p>
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