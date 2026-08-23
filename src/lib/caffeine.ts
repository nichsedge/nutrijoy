import { CaffeineLogEntry } from './types';

export interface CaffeinePreset {
  id: string;
  name: string;
  nameId: string;
  caffeineMg: number;
  icon: string;
}

export const CAFFEINE_PRESETS: CaffeinePreset[] = [
  { id: 'espresso', name: 'Single Espresso', nameId: 'Single Espresso', caffeineMg: 64, icon: '☕' },
  { id: 'americano', name: 'Brewed Coffee / Americano', nameId: 'Kopi Hitam / Americano', caffeineMg: 95, icon: '☕' },
  { id: 'double_brew', name: 'Double Shot / Cold Brew', nameId: 'Double Shot / Cold Brew', caffeineMg: 160, icon: '⚡' },
  { id: 'matcha', name: 'Ceremonial Matcha', nameId: 'Matcha Berkualitas', caffeineMg: 35, icon: '🍵' },
  { id: 'tea', name: 'Black / Green Tea', nameId: 'Teh Hijau / Hitam', caffeineMg: 45, icon: '🫖' },
  { id: 'boba_energy', name: 'Energy Drink / Milk Tea', nameId: 'Minuman Energi / Boba', caffeineMg: 80, icon: '🧋' },
];

/**
 * Standard metabolic half-life of caffeine is ~5 hours
 */
const CAFFEINE_HALF_LIFE_HOURS = 5.0;

/**
 * Calculates remaining active caffeine in milligrams at targetTime
 */
export function calculateRemainingCaffeine(logs: CaffeineLogEntry[], targetTime: number = Date.now()): number {
  if (!logs || logs.length === 0) return 0;

  let totalActiveMg = 0;

  for (const log of logs) {
    if (log.timestamp > targetTime) continue; // future log
    const hoursElapsed = (targetTime - log.timestamp) / (1000 * 60 * 60);
    if (hoursElapsed < 0) continue;
    
    // Half life decay formula: C = C0 * 0.5^(hours / halfLife)
    const decayFactor = Math.pow(0.5, hoursElapsed / CAFFEINE_HALF_LIFE_HOURS);
    totalActiveMg += log.caffeineMg * decayFactor;
  }

  return Math.round(totalActiveMg);
}

/**
 * Computes recommended caffeine cutoff (typically 9-10 hours prior to bedtime)
 */
export function getCaffeineCutoffHour(bedtimeHour: number = 23): { cutoffHour: number; cutoffTimeStr: string } {
  // 10 hours clearance before sleep
  let cutoff = bedtimeHour - 10;
  if (cutoff < 0) cutoff += 24;

  const period = cutoff >= 12 ? 'PM' : 'AM';
  const displayHour = cutoff % 12 === 0 ? 12 : cutoff % 12;

  return {
    cutoffHour: cutoff,
    cutoffTimeStr: `${displayHour}:00 ${period}`
  };
}

/**
 * Evaluates sleep impact based on remaining caffeine at bedtime
 */
export function getSleepImpact(remainingAtBedtimeMg: number) {
  if (remainingAtBedtimeMg <= 20) {
    return {
      level: 'optimal' as const,
      label: 'Deep Sleep Ready ✨',
      labelId: 'Siap Tidur Nyenyak ✨',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      advice: 'Caffeine is almost completely cleared. Expect uninterrupted delta-wave sleep and clear morning eyes!',
      adviceId: 'Kafein sudah bersih sepenuhnya. Tidurmu akan nyenyak dan mata segar bebas sembap!'
    };
  } else if (remainingAtBedtimeMg <= 50) {
    return {
      level: 'moderate' as const,
      label: 'Mild Caffeine Activity 🌙',
      labelId: 'Aktivitas Kafein Ringan 🌙',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      advice: 'Slight caffeine presence. Sip chamomile or magnesium tea to unwind your nervous system.',
      adviceId: 'Masih ada sisa kafein ringan. Minum teh chamomile atau magnesium untuk merilekskan saraf.'
    };
  } else {
    return {
      level: 'high' as const,
      label: 'Elevated at Bedtime ⚠️',
      labelId: 'Tinggi Jelang Tidur ⚠️',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      advice: 'High caffeine may suppress REM & deep beauty sleep. Practice 4-7-8 breathwork before sleeping.',
      adviceId: 'Kafein masih tinggi, berisiko mengganggu tidur nyenyak. Lakukan pernapasan 4-7-8 sebelum tidur.'
    };
  }
}
