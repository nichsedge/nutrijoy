"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertTriangle, Plus, Trash2, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import { SKINCARE_PRESETS, calculatePaoStatus, detectIngredientConflicts } from '@/lib/skincareShelf';
import { SkincareProduct } from '@/lib/types';
import { playChime, playSuccessChord } from '@/lib/soundEffects';
import { useToast } from '@/hooks/use-toast';

export function SkincareShelfCard() {
  const { state } = useApp();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [products, setProducts] = useState<SkincareProduct[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nutrijoy_skincare_shelf');
      if (saved) {
        setProducts(JSON.parse(saved));
      } else {
        // Initial starter shelf
        const initial: SkincareProduct[] = [
          {
            id: '1',
            name: 'L-Ascorbic Acid 15% Vitamin C',
            category: 'serum',
            activeIngredients: ['vitamin_c'],
            openedDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
            paoMonths: 3,
            icon: '🍊'
          },
          {
            id: '2',
            name: '5-Ceramide Barrier Repair Cream',
            category: 'moisturizer',
            activeIngredients: ['ceramides'],
            openedDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
            paoMonths: 12,
            icon: '🧴'
          }
        ];
        setProducts(initial);
        localStorage.setItem('nutrijoy_skincare_shelf', JSON.stringify(initial));
      }
    } catch {
      // ignore
    }
  }, []);

  const conflicts = detectIngredientConflicts(products);

  const handleAddPreset = (preset: typeof SKINCARE_PRESETS[0]) => {
    const newProduct: SkincareProduct = {
      ...preset,
      id: crypto.randomUUID(),
      openedDate: Date.now()
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    try {
      localStorage.setItem('nutrijoy_skincare_shelf', JSON.stringify(updated));
    } catch {
      // ignore
    }
    playSuccessChord();
    toast({
      title: `🧴 ${preset.name} ${isId ? 'Ditambahkan' : 'Added'}`,
      description: isId ? `Timer PAO ${preset.paoMonths} bulan dimulai hari ini.` : `PAO ${preset.paoMonths}-month countdown timer started.`
    });
    setShowAddMenu(false);
  };

  const handleDelete = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    try {
      localStorage.setItem('nutrijoy_skincare_shelf', JSON.stringify(updated));
    } catch {
      // ignore
    }
    playChime();
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-purple-500/10 rounded-[2rem] border border-rose-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-800 font-black">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 flex items-center justify-center">
              <span className="text-base">🧴</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">{t.skincareShelf || 'Skincare Shelf & Expiry PAO'}</p>
              <p className="text-[10px] text-muted-foreground font-bold">
                {products.length} {isId ? 'produk aktif di meja rias' : 'active vanity products'}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="h-8 px-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {isId ? 'Tambah Produk' : 'Add Bottle'}
          </Button>
        </div>

        {/* Add Product Dropdown */}
        {showAddMenu && (
          <div className="bg-white p-3 rounded-2xl border border-rose-200 shadow-xs space-y-2 animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-800">
              {isId ? 'Pilih Produk Baru yang Baru Dibuka:' : 'Select Newly Opened Skincare:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {SKINCARE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddPreset(preset)}
                  className="p-2 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-100/60 text-left flex items-center justify-between active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{preset.icon}</span>
                    <div className="truncate">
                      <p className="text-[11px] font-bold text-rose-950 truncate">{preset.name}</p>
                      <p className="text-[9px] text-rose-700 font-bold">PAO {preset.paoMonths}M ({preset.category})</p>
                    </div>
                  </div>
                  <Plus className="w-3 h-3 text-rose-600 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ingredient Conflict Warnings */}
        {conflicts.length > 0 && (
          <div className="bg-rose-50/90 border border-rose-300 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-black text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{t.ingredientConflict || 'Ingredient Conflict Alert!'}</span>
            </div>
            {conflicts.map((c, i) => (
              <p key={i} className="text-[11px] text-rose-800 leading-snug font-bold">
                ⚠️ {isId ? c.messageId : c.messageEn}
              </p>
            ))}
          </div>
        )}

        {/* Products List */}
        <div className="space-y-2">
          {products.length === 0 ? (
            <div className="text-center py-6 bg-white/60 rounded-2xl border border-rose-100 text-xs text-muted-foreground font-bold">
              {isId ? 'Meja rias kosong. Tambahkan botol skincare untuk melacak masa simpannya.' : 'Your shelf is empty. Add your skincare products to monitor PAO freshness.'}
            </div>
          ) : (
            products.map(prod => {
              const pao = calculatePaoStatus(prod);
              return (
                <div
                  key={prod.id}
                  className={`p-3 rounded-2xl border bg-white/90 shadow-2xs space-y-2 transition-all ${
                    pao.isExpired
                      ? 'border-rose-300 bg-rose-50/50'
                      : pao.isExpiringSoon
                      ? 'border-amber-300 bg-amber-50/40'
                      : 'border-rose-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl shrink-0">{prod.icon || '🧴'}</span>
                      <div className="truncate">
                        <h4 className="text-xs font-black text-foreground truncate">{prod.name}</h4>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                          PAO: {prod.paoMonths} {isId ? 'Bulan' : 'Months'} · {prod.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        pao.isExpired
                          ? 'bg-rose-100 text-rose-800'
                          : pao.isExpiringSoon
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isId ? pao.statusTextId : pao.statusTextEn}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(prod.id)}
                        className="text-muted-foreground/60 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* PAO Progress Bar */}
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pao.isExpired
                          ? 'bg-rose-600'
                          : pao.isExpiringSoon
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      }`}
                      style={{ width: `${pao.percentUsed}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
