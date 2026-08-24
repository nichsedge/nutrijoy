'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sun, MapPin, RefreshCw, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useApp } from '../AppContext';
import { getTranslation } from '@/lib/translations';
import {
  fetchCurrentUVIndex,
  requestGeolocation,
  getUVRiskLevel,
  SPF_REAPPLY_INTERVAL_MS,
  SPF_WARN_THRESHOLD_MS,
} from '@/lib/uvIndex';
import { playChime, playSuccessChord } from '@/lib/soundEffects';
import { useToast } from '@/hooks/use-toast';

export function UVProtectionCard() {
  const { state } = useApp();
  const { toast } = useToast();
  const t = getTranslation(state.profile?.language || 'en');
  const isId = state.profile?.language === 'id';

  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  // SPF timer state
  const [spfAppliedAt, setSpfAppliedAt] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load SPF timestamp from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nutrijoy_spf_applied_at');
      if (saved) {
        const ts = parseInt(saved, 10);
        if (Date.now() - ts < SPF_REAPPLY_INTERVAL_MS) {
          setSpfAppliedAt(ts);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!spfAppliedAt) return;

    const tick = () => {
      const elapsed = Date.now() - spfAppliedAt;
      const remaining = Math.max(0, SPF_REAPPLY_INTERVAL_MS - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        clearInterval(timerRef.current!);
        toast({
          title: isId ? '☀️ SPF perlu dioles ulang!' : '☀️ Time to reapply SPF!',
          description: isId
            ? 'Sudah 2 jam sejak kamu memakai tabir surya. Oleskan ulang untuk proteksi maksimal!'
            : "It's been 2 hours since you applied sunscreen. Reapply for maximum skin protection!",
        });
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current!);
  }, [spfAppliedAt, isId, toast]);

  const handleFetchUV = async () => {
    setLoading(true);
    const loc = await requestGeolocation();
    if (!loc) {
      setLocationDenied(true);
      setLoading(false);
      return;
    }
    const result = await fetchCurrentUVIndex(loc.lat, loc.lon);
    setUvIndex(result.uvIndex);
    setLoading(false);
  };

  const handleApplySPF = () => {
    const now = Date.now();
    setSpfAppliedAt(now);
    try {
      localStorage.setItem('nutrijoy_spf_applied_at', String(now));
    } catch {
      /* ignore */
    }
    playSuccessChord();
    toast({
      title: '✅ ' + (isId ? 'SPF sudah dioleskan!' : 'SPF Applied!'),
      description: isId
        ? 'Timer 2 jam dimulai. Kami akan mengingatkanmu untuk mengoles ulang.'
        : "Your 2-hour reapplication timer has started. We'll remind you when it's time.",
    });
  };

  const risk = uvIndex !== null ? getUVRiskLevel(uvIndex) : null;

  const formatTime = (ms: number) => {
    const totalSec = Math.ceil(ms / 1000);
    const m = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const spfExpired = spfAppliedAt !== null && Date.now() - spfAppliedAt >= SPF_REAPPLY_INTERVAL_MS;
  const spfWarning = timeRemaining > 0 && timeRemaining <= SPF_WARN_THRESHOLD_MS;

  return (
    <Card className="border-none shadow-sm bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-amber-500/10 rounded-[2rem] border border-yellow-500/15 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-700 font-black">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Sun className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider">{t.uvProtection || 'UV Protection & SPF Timer'}</p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleFetchUV}
            disabled={loading}
            className="h-8 px-3 rounded-full border-amber-200 text-amber-700 text-[10px] font-bold"
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <MapPin className="w-3 h-3 mr-1" />
                {t.enableLocation || 'Get UV'}
              </>
            )}
          </Button>
        </div>

        {/* UV Risk Display */}
        {locationDenied && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 font-bold">
            {isId
              ? 'Izin lokasi ditolak. Aktifkan di pengaturan browser untuk mendapatkan data UV real-time.'
              : 'Location permission denied. Enable in browser settings to get real-time UV data.'}
          </div>
        )}

        {uvIndex !== null && risk && (
          <div className={`p-4 rounded-2xl border ${risk.colorClass} space-y-2`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-black">
                  {risk.icon} UV {uvIndex}
                </p>
                <p className="text-xs font-black">{isId ? risk.labelId : risk.label}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase opacity-70">{t.uvRisk || 'UV Risk'}</p>
                <p className="text-sm font-black">SPF {risk.spfRequired}+</p>
              </div>
            </div>
            <p className="text-[11px] leading-snug opacity-90 font-bold">{isId ? risk.adviceId : risk.adviceEn}</p>
          </div>
        )}

        {!uvIndex && !locationDenied && (
          <div className="bg-amber-50/50 border border-amber-200/40 rounded-2xl p-3 text-center space-y-1">
            <Sun className="w-8 h-8 mx-auto text-amber-400" />
            <p className="text-xs text-muted-foreground font-bold">
              {t.fetchingUV || 'Tap "Get UV" to check today\'s UV index and skin protection level.'}
            </p>
          </div>
        )}

        {/* SPF Timer */}
        <div className="bg-white/80 rounded-2xl border border-amber-100 p-4 space-y-3">
          <p className="text-xs font-black text-amber-900 uppercase tracking-wider">
            {isId ? '⏱️ Timer SPF' : '⏱️ SPF Reapplication Timer'}
          </p>

          {spfAppliedAt && !spfExpired ? (
            <div className="space-y-2">
              <div
                className={`text-center p-3 rounded-xl ${spfWarning ? 'bg-amber-100 border border-amber-300' : 'bg-emerald-50 border border-emerald-200'}`}
              >
                <p className={`text-3xl font-black font-mono ${spfWarning ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {formatTime(timeRemaining)}
                </p>
                <p
                  className={`text-[10px] font-black uppercase mt-1 ${spfWarning ? 'text-amber-600 animate-pulse' : 'text-emerald-600'}`}
                >
                  {spfWarning ? (isId ? 'Segera oles ulang!' : 'Reapply soon!') : t.spfTimer || 'Reapply In'}
                </p>
              </div>
            </div>
          ) : spfExpired ? (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
              <AlertTriangle className="w-6 h-6 text-rose-600 mx-auto mb-1" />
              <p className="text-xs font-black text-rose-700">{t.spfOverdue || 'SPF Overdue! Reapply Now'}</p>
            </div>
          ) : null}

          <Button
            onClick={handleApplySPF}
            className={`w-full rounded-full text-white font-bold text-xs h-9 ${spfExpired ? 'bg-rose-500 hover:bg-rose-600' : 'bg-amber-500 hover:bg-amber-600'}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            {spfAppliedAt && !spfExpired ? (isId ? 'Oles Ulang SPF' : 'Reapply SPF') : t.appliedSPF || 'Applied SPF ✓'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
