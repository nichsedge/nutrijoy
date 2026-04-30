"use client";

import React, { useRef } from 'react';
import { useApp } from '@/components/AppContext';
import { Shell } from '@/components/layout/Shell';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { exportData, importData, clearState } from '@/lib/storage';
import { Languages, Download, Upload, User, Trash2, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { state, setLanguage, resetState } = useApp();
  const t = getTranslation(state.profile?.language || 'en');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();

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

  return (
    <Shell>
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <h2 className="text-2xl font-bold">{t.settings}</h2>

        <section className="space-y-4">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Languages className="w-4 h-4" /> {t.language}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button 
                variant={state.profile?.language === 'en' ? 'default' : 'outline'}
                className="flex-1 rounded-xl h-12 font-bold"
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
              <Button 
                variant={state.profile?.language === 'id' ? 'default' : 'outline'}
                className="flex-1 rounded-xl h-12 font-bold"
                onClick={() => setLanguage('id')}
              >
                Indonesian
              </Button>
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