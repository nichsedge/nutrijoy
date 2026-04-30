"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { exportData, importData, clearState } from '@/lib/storage';
import { Languages, Download, Upload, User, Trash2, ChevronRight, Info, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function SettingsPage() {
  const { state, setLanguage, setProfile, resetState } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (state.profile) {
      setFormData(state.profile);
    }
  }, [state.profile]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      setProfile(formData);
      toast({
        title: t.done,
        description: t.updateSuccess,
      });
    }
  };

  const handleExport = () => {
    exportData(state);
    toast({ title: t.done, description: "Data exported successfully!" });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const newState = await importData(file);
        resetState(newState);
        toast({ title: t.done, description: "Data restored successfully!" });
      } catch (err) {
        toast({ title: "Error", description: "Invalid backup file.", variant: "destructive" });
      }
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure? This will delete all local data.")) {
      clearState();
      window.location.href = '/onboarding';
    }
  };

  if (!formData) return null;

  return (
    <Shell>
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
        <h2 className="text-2xl font-bold">{t.settings}</h2>

        <section className="space-y-4">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> {t.profileInfo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.name}</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="rounded-xl border-2 border-primary/10 h-11"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">{t.age}</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                      className="rounded-xl border-2 border-primary/10 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.sex}</Label>
                    <RadioGroup 
                      value={formData.sex} 
                      onValueChange={(val) => setFormData({...formData, sex: val as 'male' | 'female'})}
                      className="flex gap-4 h-11 items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male-s" />
                        <Label htmlFor="male-s" className="text-xs">{t.male}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female-s" />
                        <Label htmlFor="female-s" className="text-xs">{t.female}</Label>
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
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: parseInt(e.target.value)})}
                      className="rounded-xl border-2 border-primary/10 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">{t.weight}</Label>
                    <Input 
                      id="weight" 
                      type="number" 
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})}
                      className="rounded-xl border-2 border-primary/10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity">{t.activityLevel}</Label>
                  <Select 
                    value={formData.activityLevel}
                    onValueChange={(val) => setFormData({...formData, activityLevel: val as UserProfile['activityLevel']})}
                  >
                    <SelectTrigger className="rounded-xl border-2 border-primary/10 h-11">
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
                  <Select 
                    value={formData.goal}
                    onValueChange={(val) => setFormData({...formData, goal: val as UserProfile['goal']})}
                  >
                    <SelectTrigger className="rounded-xl border-2 border-primary/10 h-11">
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose">{t.lose}</SelectItem>
                      <SelectItem value="maintain">{t.maintain}</SelectItem>
                      <SelectItem value="gain">{t.gain}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl font-bold gap-2">
                  <Save className="w-4 h-4" /> {t.saveProfile}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Languages className="w-4 h-4" /> {t.language}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                variant={state.profile?.language === 'en' ? 'default' : 'outline'}
                className="flex-1 rounded-xl h-11 font-bold"
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
              <Button 
                variant={state.profile?.language === 'id' ? 'default' : 'outline'}
                className="flex-1 rounded-xl h-11 font-bold"
                onClick={() => setLanguage('id')}
              >
                Bahasa
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Info className="w-4 h-4" /> {t.methodology}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="energy" className="border-b-0">
                  <AccordionTrigger className="text-sm font-bold hover:no-underline">{t.energyNeedsTitle}</AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    {t.energyNeedsDesc}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sugar" className="border-b-0">
                  <AccordionTrigger className="text-sm font-bold hover:no-underline">{t.sugarLimitTitle}</AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    {t.sugarLimitDesc}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="sodium" className="border-b-0">
                  <AccordionTrigger className="text-sm font-bold hover:no-underline">{t.sodiumLimitTitle}</AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed">
                    {t.sodiumLimitDesc}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Download className="w-4 h-4" /> Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-between h-14 rounded-2xl border-2 border-primary/5 hover:bg-primary/5 px-6"
                onClick={handleExport}
              >
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-primary" />
                  <span className="font-bold">{t.backupData}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                className="hidden" 
                accept=".json"
              />
              <Button 
                variant="outline" 
                className="w-full justify-between h-14 rounded-2xl border-2 border-primary/5 hover:bg-primary/5 px-6"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-secondary" />
                  <span className="font-bold">{t.restoreData}</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
             <CardContent className="p-0">
                <Button 
                  variant="ghost" 
                  className="w-full h-16 justify-between px-6 hover:bg-red-50 text-red-500 font-bold"
                  onClick={handleReset}
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="w-5 h-5" />
                    <span>Clear App Data</span>
                  </div>
                </Button>
             </CardContent>
          </Card>

          <div className="text-center py-6">
            <p className="text-xs text-muted-foreground opacity-50 uppercase tracking-widest font-bold">NutriJoy v1.0.0</p>
          </div>
        </section>
      </div>
    </Shell>
  );
}
