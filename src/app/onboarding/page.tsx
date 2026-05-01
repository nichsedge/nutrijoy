"use client";

import React, { useState } from 'react';
import { useApp } from '@/components/AppContext';
import { useRouter } from 'next/navigation';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

export default function OnboardingPage() {
  const { setProfile, state } = useApp();
  const router = useRouter();
  const [lang, setLang] = useState<UserProfile['language']>('en');
  const t = getTranslation(lang);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    age: 25,
    sex: 'male',
    height: 170,
    weight: 70,
    activityLevel: 'moderate',
    goal: 'maintain',
    language: lang
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age && formData.height && formData.weight) {
      setProfile({ ...formData, language: lang } as UserProfile);
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto p-8 flex flex-col animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">{t.onboardingTitle}</h1>
        <p className="text-muted-foreground mt-2">{t.onboardingDesc}</p>
      </div>

      <div className="mb-6">
        <Button 
          variant="outline" 
          className="w-full rounded-2xl border-2 border-primary/20 text-primary hover:border-primary"
          onClick={() => setLang(l => l === 'en' ? 'id' : 'en')}
        >
          {t.switchLang}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        <div className="space-y-2">
          <Label htmlFor="name">{t.name}</Label>
          <Input 
            id="name" 
            placeholder="Your name" 
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="rounded-xl border-2 border-primary/10 h-12"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">{t.age}</Label>
            <Input 
              id="age" 
              type="number" 
              required
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
              className="rounded-xl border-2 border-primary/10 h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>{t.sex}</Label>
            <RadioGroup 
              defaultValue="male" 
              onValueChange={(val) => setFormData(prev => ({ ...prev, sex: val as 'male' | 'female' }))}
              className="flex gap-4 h-12 items-center"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">{t.male}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">{t.female}</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">{t.height}</Label>
            <Input 
              id="height" 
              type="number" 
              required
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) }))}
              className="rounded-xl border-2 border-primary/10 h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">{t.weight}</Label>
            <Input 
              id="weight" 
              type="number" 
              required
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) }))}
              className="rounded-xl border-2 border-primary/10 h-12"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activity">{t.activityLevel}</Label>
          <Select onValueChange={(val) => setFormData(prev => ({ ...prev, activityLevel: val as UserProfile['activityLevel'] }))} defaultValue="moderate">
            <SelectTrigger className="rounded-xl border-2 border-primary/10 h-12">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">{t.sedentary}</SelectItem>
              <SelectItem value="light">{t.light}</SelectItem>
              <SelectItem value="moderate">{t.moderate}</SelectItem>
              <SelectItem value="active">{t.active}</SelectItem>
              <SelectItem value="very_active">{t.very_active}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">{t.goal}</Label>
          <Select onValueChange={(val) => setFormData(prev => ({ ...prev, goal: val as UserProfile['goal'] }))} defaultValue="maintain">
            <SelectTrigger className="rounded-xl border-2 border-primary/10 h-12">
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lose">{t.lose}</SelectItem>
              <SelectItem value="maintain">{t.maintain}</SelectItem>
              <SelectItem value="gain">{t.gain}</SelectItem>
              <SelectItem value="recompose">{t.recompose || 'Tone & Shape'}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.weight && formData.height && formData.goal === 'lose' && (
          (() => {
            const bmi = formData.weight / Math.pow(formData.height / 100, 2);
            if (bmi >= 18.5 && bmi <= 24.9) {
              return (
                <div className="p-4 bg-accent/20 rounded-2xl border border-accent text-sm text-primary">
                  <strong>Tip:</strong> Your BMI is in the healthy range! If your goal is to look more toned and fit, we recommend switching your goal to <strong>{t.recompose || 'Tone & Shape'}</strong> to focus on building muscle while losing fat.
                </div>
              );
            }
            return null;
          })()
        )}

        <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 mt-8">
          {t.saveProfile}
        </Button>
      </form>
    </div>
  );
}