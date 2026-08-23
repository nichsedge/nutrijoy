"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Sparkles, Plus, Trash2, Image as ImageIcon, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTranslation } from '@/lib/translations';
import { useAppState } from '../AppContext';
import { SkinCondition, SkinJournalEntry } from '@/lib/types';
import { playChime, playSuccessChord } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';

export function VisualSkinJournal() {
  const state = useAppState();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [entries, setEntries] = useState<SkinJournalEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<SkinCondition>('radiant');
  const [note, setNote] = useState('');
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);

  const skinConditions: { id: SkinCondition; label: string; emoji: string }[] = [
    { id: 'radiant', label: t.skinRadiant || 'Radiant ✨', emoji: '✨' },
    { id: 'clear', label: t.skinClear || 'Clear 🌿', emoji: '🌿' },
    { id: 'dry', label: t.skinDry || 'Dry 💧', emoji: '💧' },
    { id: 'breakout', label: t.skinBreakout || 'Breakout 🫧', emoji: '🫧' },
    { id: 'puffy', label: t.skinPuffy || 'Puffy 🧊', emoji: '🧊' },
  ];

  // Load entries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nutrijoy_skin_journal');
      if (saved) {
        setEntries(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress / read as data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPreviewImage(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEntry = () => {
    if (!previewImage && !note.trim()) {
      toast({
        title: isId ? "Tambahkan foto atau catatan" : "Add a photo or note",
        description: isId ? "Silakan pilih foto atau tulis catatan kondisimu." : "Please capture a photo or enter a quick note.",
        variant: "destructive"
      });
      return;
    }

    const newEntry: SkinJournalEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      skinCondition: selectedCondition,
      photoUrl: previewImage,
      note: note.trim() || undefined
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    try {
      localStorage.setItem('nutrijoy_skin_journal', JSON.stringify(updated));
    } catch {
      // ignore
    }

    playSuccessChord();
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 }
    });

    toast({
      title: isId ? "✨ Catatan Kulit Tersimpan" : "✨ Skin Entry Saved",
      description: isId ? "Catatan transformasi kulitmu berhasil disimpan secara privat." : "Your visual skin entry is safely stored.",
    });

    setIsAdding(false);
    setPreviewImage(undefined);
    setNote('');
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    try {
      localStorage.setItem('nutrijoy_skin_journal', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 rounded-[2rem] border border-pink-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 font-black">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <Camera className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider">{t.skinJournal || 'Visual Skin Journal'}</span>
              <span className="text-[10px] font-bold text-muted-foreground">{entries.length} {isId ? 'catatan' : 'entries'}</span>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold h-8 px-3 shadow-xs"
          >
            {isAdding ? <X className="w-3.5 h-3.5 mr-1" /> : <Plus className="w-3.5 h-3.5 mr-1" />}
            {isAdding ? (isId ? 'Tutup' : 'Cancel') : (isId ? 'Tambah Foto' : 'New Entry')}
          </Button>
        </div>

        <p className="text-xs text-foreground/80 leading-relaxed font-medium">
          {t.skinJournalDesc || 'Capture private skin photos & notes to visually follow your glow transformation alongside hydration & sleep data.'}
        </p>

        {/* Add Entry Form */}
        {isAdding && (
          <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-rose-700">{t.skinCondition || 'Skin State'}</p>
              <div className="flex flex-wrap gap-1.5">
                {skinConditions.map(sc => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setSelectedCondition(sc.id);
                      playChime();
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${selectedCondition === sc.id ? 'bg-rose-500 border-rose-500 text-white shadow-xs' : 'bg-rose-50/50 border-rose-100 text-rose-600 hover:border-rose-300'}`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Picker */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-foreground/80">{t.takePhoto || 'Upload / Take Photo'}</p>
              {previewImage ? (
                <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-rose-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewImage} alt="Skin Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setPreviewImage(undefined)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-24 rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/30 flex flex-col items-center justify-center cursor-pointer transition-all gap-1 text-rose-500">
                  <Camera className="w-6 h-6" />
                  <span className="text-[11px] font-bold">{isId ? 'Ketuk untuk ambil / unggah foto' : 'Tap to snap or upload skin selfie'}</span>
                  <input type="file" accept="image/*" capture="user" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Note input */}
            <div className="space-y-1">
              <Input
                placeholder={t.skinCaptionPlaceholder || 'Note (e.g. skin feels bouncy and calm!)...'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="text-xs rounded-xl border-rose-100 bg-white"
              />
            </div>

            <Button
              onClick={handleSaveEntry}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-10 shadow-sm"
            >
              {t.saveSkinEntry || 'Save Skin Entry'}
            </Button>
          </div>
        )}

        {/* Entries Timeline Gallery */}
        {entries.length > 0 ? (
          <div className="space-y-2.5 pt-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-600/70">
              {isId ? 'Riwayat Transformasi' : 'Recent Skin Timeline'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {entries.slice(0, 4).map((entry) => {
                const dateStr = new Date(entry.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const conditionInfo = skinConditions.find(s => s.id === entry.skinCondition);

                return (
                  <div key={entry.id} className="bg-white p-3 rounded-2xl border border-rose-100 shadow-xs flex gap-3 items-start relative group">
                    {entry.photoUrl ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-rose-100 shrink-0 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={entry.photoUrl} alt="Skin Log" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-rose-50 border border-rose-100 shrink-0 flex items-center justify-center text-2xl">
                        {conditionInfo?.emoji || '✨'}
                      </div>
                    )}

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                          {conditionInfo?.label || entry.skinCondition}
                        </span>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {entry.note && (
                        <p className="text-xs text-foreground/90 font-medium line-clamp-2 leading-snug">
                          {entry.note}
                        </p>
                      )}

                      <p className="text-[10px] text-muted-foreground font-bold">{dateStr}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 px-2 bg-white/50 rounded-2xl border border-dashed border-rose-200 text-muted-foreground text-xs">
            {isId ? 'Belum ada foto kulit. Ketuk "Tambah Foto" untuk mulai memantau kilau wajahmu!' : 'No skin entries yet. Tap "New Entry" to track your skin radiance over time!'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
