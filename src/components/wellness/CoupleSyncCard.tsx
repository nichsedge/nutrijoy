'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Sparkles, Send, Droplets, Sun, Flame, MessageCircleHeart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTranslation } from '@/lib/translations';
import { useAppState } from '../AppContext';
import { PartnerCheer } from '@/lib/types';
import { playSuccessChord } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';

export function CoupleSyncCard() {
  const state = useAppState();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [partnerName, setPartnerName] = useState<string>('My Love');
  const [isEditingName, setIsEditingName] = useState(false);
  const [recentCheers, setRecentCheers] = useState<PartnerCheer[]>([]);

  // Load cheers from localStorage on client
  useEffect(() => {
    try {
      const savedPartner = localStorage.getItem('nutrijoy_partner_name');
      if (savedPartner) setPartnerName(savedPartner);

      const savedCheers = localStorage.getItem('nutrijoy_partner_cheers');
      if (savedCheers) setRecentCheers(JSON.parse(savedCheers));
    } catch {
      // ignore
    }
  }, []);

  const savePartnerName = (name: string) => {
    setPartnerName(name);
    try {
      localStorage.setItem('nutrijoy_partner_name', name);
    } catch {
      // ignore
    }
    setIsEditingName(false);
  };

  const sendCheer = (message: string, icon: string) => {
    playSuccessChord();
    const newCheer: PartnerCheer = {
      id: crypto.randomUUID(),
      fromName: state.profile?.name || 'You',
      toName: partnerName,
      message,
      timestamp: Date.now(),
      icon,
    };

    const updated = [newCheer, ...recentCheers].slice(0, 5);
    setRecentCheers(updated);
    try {
      localStorage.setItem('nutrijoy_partner_cheers', JSON.stringify(updated));
    } catch {
      // ignore
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ec4899', '#f43f5e', '#fb7185'],
    });

    toast({
      title: `${icon} ${t.sendCheer || 'Cheer Sent!'}`,
      description: `${isId ? 'Pesan terkirim untuk' : 'Sent to'} ${partnerName}: "${message}"`,
    });
  };

  const cheerOptions = [
    {
      label: t.cheerSpf || 'Remember SPF ☀️',
      message: isId
        ? 'Jangan lupa pakai sunscreen hari ini ya sayang! ☀️'
        : "Don't forget your SPF today, keep that glow protected! ☀️",
      icon: '☀️',
    },
    {
      label: t.cheerWater || 'Drink Water 💧',
      message: isId
        ? 'Yuk minum air 500ml biar kulitmu tetap kenyal & segar! 💧'
        : 'Hydration check: drink 500ml water to keep your skin plump! 💧',
      icon: '💧',
    },
    {
      label: t.cheerWorkout || 'Proud of You! 💪',
      message: isId
        ? 'Bangga banget sama semangat olahragamu hari ini! 💪'
        : 'So proud of your workout today, you are crushing it! 💪',
      icon: '💪',
    },
    {
      label: t.cheerLove || 'Glowing & Beautiful! ✨',
      message: isId
        ? 'Kamu selalu cantik dan bercahaya hari ini! ✨💖'
        : 'You are looking so radiant, healthy, and beautiful today! ✨💖',
      icon: '✨',
    },
  ];

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-amber-500/10 rounded-[2rem] border border-rose-500/15 overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-600 font-black">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/15 flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-widest">{t.coupleSync || 'Duo Glow & Cheer'}</span>
                <span className="text-[9px] font-black bg-rose-500 text-white px-2 py-0.2 rounded-full">Duo</span>
              </div>
              <div className="flex items-center gap-1">
                {isEditingName ? (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Input
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="h-6 text-xs w-28 bg-white"
                      autoFocus
                    />
                    <Button size="sm" className="h-6 px-2 text-[10px]" onClick={() => savePartnerName(partnerName)}>
                      Save
                    </Button>
                  </div>
                ) : (
                  <p
                    onClick={() => setIsEditingName(true)}
                    className="text-xs font-bold text-muted-foreground hover:text-rose-600 cursor-pointer underline decoration-dotted"
                    title="Click to edit partner name"
                  >
                    {isId ? `Pasangan: ${partnerName}` : `Partner: ${partnerName}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full border border-rose-200 shadow-xs">
            <Sparkles className="w-3 h-3 text-rose-500" />
            <span className="text-[10px] font-black text-rose-700">Team Glow</span>
          </div>
        </div>

        <p className="text-xs text-foreground/80 leading-relaxed font-medium">
          {t.coupleSyncDesc ||
            "Send micro-cheers and positive nudges to inspire your partner's daily beauty & wellness habits."}
        </p>

        {/* 1-Tap Cheer Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {cheerOptions.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => sendCheer(opt.message, opt.icon)}
              className="p-3 bg-white hover:bg-rose-50/50 border border-rose-100 rounded-2xl text-left transition-all active:scale-95 shadow-xs flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <span className="text-sm">{opt.icon}</span>
                <p className="text-xs font-black text-foreground group-hover:text-rose-600 transition-colors">
                  {opt.label}
                </p>
              </div>
              <Send className="w-3.5 h-3.5 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Recent Cheers History */}
        {recentCheers.length > 0 && (
          <div className="pt-2 border-t border-rose-100/80 space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-wider text-rose-600/70 flex items-center gap-1">
              <MessageCircleHeart className="w-3 h-3" />
              <span>{isId ? 'Semangat Terkirim Baru-baru Ini' : 'Recently Sent Cheers'}</span>
            </p>
            <div className="space-y-1">
              {recentCheers.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  className="text-[11px] bg-white/70 p-2 rounded-xl border border-rose-100/50 flex items-center gap-2"
                >
                  <span>{c.icon}</span>
                  <span className="truncate text-muted-foreground italic font-medium">"{c.message}"</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
