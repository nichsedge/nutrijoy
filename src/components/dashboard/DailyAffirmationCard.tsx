'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Heart, Edit2, Check, Quote, MessageCircleHeart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTranslation } from '@/lib/translations';
import { useAppState } from '../AppContext';
import { getDailyAffirmation } from '@/lib/affirmations';
import { getCyclePhase } from '@/lib/cycleSync';
import { playChime, playSuccessChord } from '@/lib/soundEffects';
import confetti from 'canvas-confetti';

export function DailyAffirmationCard() {
  const state = useAppState();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [partnerNote, setPartnerNote] = useState<string>(
    'You are doing so amazing, I am so proud of you! Keep glowing my love 💖'
  );
  const [partnerAuthor, setPartnerAuthor] = useState<string>('My Love');
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState('');

  // Determine current cycle phase
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = new Date(today).setHours(24, 0, 0, 0);
  const todaysCycle = state.cycleLogs?.find((l) => l.timestamp >= today && l.timestamp < tomorrow);
  const activeDay = todaysCycle?.cycleDay || 1;
  const phaseInfo = getCyclePhase(activeDay, state.profile?.language || 'en');

  const affirmation = getDailyAffirmation(phaseInfo.phase);

  // Load partner note from local storage
  useEffect(() => {
    try {
      const savedNote = localStorage.getItem('nutrijoy_partner_note');
      if (savedNote) setPartnerNote(savedNote);

      const savedPartner = localStorage.getItem('nutrijoy_partner_name');
      if (savedPartner) setPartnerAuthor(savedPartner);
    } catch {
      // ignore
    }
  }, []);

  const handleSaveNote = () => {
    if (!editedNote.trim()) return;

    setPartnerNote(editedNote.trim());
    try {
      localStorage.setItem('nutrijoy_partner_note', editedNote.trim());
    } catch {
      // ignore
    }

    playSuccessChord();
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
    });

    toast({
      title: '💖 ' + (t.loveNoteSaved || 'Love Note Saved'),
      description: isId
        ? 'Pesan cintamu akan terpajang manis di layar utamanya.'
        : 'Your sweet note is displayed on her morning dashboard.',
    });

    setIsEditing(false);
  };

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-purple-500/10 rounded-[2rem] border border-pink-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Daily Radiance Affirmation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-600 font-black">
              <div className="w-7 h-7 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-rose-500" />
              </div>
              <span className="text-xs uppercase tracking-wider">
                {t.dailyAffirmation || 'Daily Radiance Affirmation'}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-rose-700 bg-rose-500/10 px-2 py-0.5 rounded-full">
              {phaseInfo.phaseName}
            </span>
          </div>

          <div className="bg-white/80 p-4 rounded-2xl border border-rose-100/80 shadow-2xs relative">
            <Quote className="w-5 h-5 text-rose-300 absolute top-2 right-3 opacity-40" />
            <p className="text-xs text-foreground/90 font-bold leading-relaxed pr-6 italic">
              "{isId ? affirmation.textId : affirmation.textEn}"
            </p>
          </div>
        </div>

        {/* Partner Sticky Love Note */}
        <div className="space-y-2 pt-1 border-t border-rose-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-600 text-xs font-black">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{t.partnerLoveNote || 'Love Note from Partner'}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditedNote(partnerNote);
                setIsEditing(!isEditing);
                playChime();
              }}
              className="h-7 px-2 text-[10px] font-bold text-rose-600 hover:bg-rose-100/60 rounded-full"
            >
              <Edit2 className="w-3 h-3 mr-1" />
              {isEditing ? (isId ? 'Batal' : 'Cancel') : isId ? 'Tulis Pesan' : 'Write Note'}
            </Button>
          </div>

          {isEditing ? (
            <div className="bg-white p-3 rounded-2xl border border-rose-200 shadow-xs space-y-2 animate-in fade-in">
              <Input
                value={editedNote}
                onChange={(e) => setEditedNote(e.target.value)}
                placeholder={t.loveNotePlaceholder || 'Leave a sweet note for her...'}
                className="text-xs rounded-xl border-rose-100 bg-white"
              />
              <Button
                onClick={handleSaveNote}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs h-8 rounded-xl shadow-xs"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                {t.saveLoveNote || 'Leave Love Note'}
              </Button>
            </div>
          ) : (
            <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-100 shadow-2xs flex items-center justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs text-rose-950 font-bold leading-snug truncate">"{partnerNote}"</p>
                <p className="text-[9px] text-rose-600 font-bold tracking-wide">— {partnerAuthor}</p>
              </div>
              <span className="text-xl shrink-0 animate-pulse-soft">💌</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
