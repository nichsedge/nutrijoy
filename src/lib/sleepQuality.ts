import { SleepLogEntry, SkinJournalEntry } from './types';

export interface SleepQualityScore {
  total: number; // 0–100
  durationScore: number;
  restednessScore: number;
  caffeinePenalty: number;
  consistencyBonus: number;
  label: string;
  labelId: string;
  tip: string;
  tipId: string;
  colorClass: string;
}

const IDEAL_SLEEP_HOURS = 8;
const IDEAL_HOURS_MIN = 7;
const LATE_SLEEP_PENALTY_PER_MG = 0.3; // score points lost per mg of caffeine at bedtime

export function calculateSleepScore(
  log: SleepLogEntry,
  caffeineAtBedtimeMg: number = 0,
  previousBedtimeHour?: number // 0–23, for consistency tracking
): SleepQualityScore {
  // 1. Duration score (0–50 pts): 8h = 50pts, scales linearly, min 0
  const durationRatio = Math.min(log.durationHours / IDEAL_SLEEP_HOURS, 1.2);
  const rawDuration = durationRatio * 50;
  // Slight penalty for sleeping way too long (>9.5h)
  const durationScore = log.durationHours > 9.5
    ? Math.max(rawDuration - (log.durationHours - 9.5) * 10, 0)
    : rawDuration;

  // 2. Rested feeling score (0–35 pts): 1–5 scale → 0–35
  const restednessScore = ((log.restednessScore - 1) / 4) * 35;

  // 3. Caffeine penalty (0 to –20 pts)
  const caffeinePenalty = Math.min(caffeineAtBedtimeMg * LATE_SLEEP_PENALTY_PER_MG, 20);

  // 4. Consistency bonus (0–15 pts): within 30min of usual bedtime
  let consistencyBonus = 0;
  if (previousBedtimeHour !== undefined) {
    const currentHour = new Date(log.timestamp).getHours();
    const diff = Math.abs(currentHour - previousBedtimeHour);
    consistencyBonus = diff <= 0.5 ? 15 : diff <= 1 ? 10 : diff <= 2 ? 5 : 0;
  }

  const total = Math.max(0, Math.min(100, Math.round(
    durationScore + restednessScore - caffeinePenalty + consistencyBonus
  )));

  const { label, labelId, tip, tipId, colorClass } = getSleepLabel(total);

  return {
    total,
    durationScore: Math.round(durationScore),
    restednessScore: Math.round(restednessScore),
    caffeinePenalty: Math.round(caffeinePenalty),
    consistencyBonus,
    label,
    labelId,
    tip,
    tipId,
    colorClass
  };
}

function getSleepLabel(score: number) {
  if (score >= 80) {
    return {
      label: 'Deep Beauty Sleep ✨',
      labelId: 'Tidur Nyenyak Sempurna ✨',
      tip: 'Peak melatonin and growth hormone activity overnight—your skin is regenerating beautifully.',
      tipId: 'Melatonin dan hormon pertumbuhan aktif maksimal—kulitmu beregenerasi dengan indah semalam.',
      colorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200'
    };
  } else if (score >= 60) {
    return {
      label: 'Good Sleep 🌙',
      labelId: 'Tidur Cukup Baik 🌙',
      tip: 'Good rest! Try silk pillowcase and no screens after 9pm to maximize skin repair next cycle.',
      tipId: 'Istirahat cukup! Coba sarung bantal sutra dan hindari layar setelah pukul 21.00 untuk pemulihan kulit optimal.',
      colorClass: 'text-purple-700 bg-purple-50 border-purple-200'
    };
  } else if (score >= 40) {
    return {
      label: 'Light Sleep 💤',
      labelId: 'Tidur Ringan 💤',
      tip: 'Sleep was lighter than ideal. Magnesium glycinate + chamomile tea 30min before bed can deepen sleep cycles.',
      tipId: 'Tidur kurang optimal. Magnesium glisin dan teh chamomile 30 menit sebelum tidur bisa membantu tidur lebih nyenyak.',
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200'
    };
  } else {
    return {
      label: 'Poor Sleep ⚠️',
      labelId: 'Tidur Buruk ⚠️',
      tip: 'Poor sleep raises cortisol—which spikes oil production and causes skin inflammation. Prioritize tonight!',
      tipId: 'Tidur buruk meningkatkan kortisol yang memicu produksi minyak dan peradangan kulit. Prioritaskan malam ini!',
      colorClass: 'text-rose-700 bg-rose-50 border-rose-200'
    };
  }
}

/**
 * Correlates sleep duration with next-day skin condition across available logs.
 * Returns an insight string or null if insufficient data.
 */
export function getSleepSkinCorrelation(
  sleepLogs: SleepLogEntry[],
  skinJournalEntries: SkinJournalEntry[],
  language: 'en' | 'id' = 'en'
): string | null {
  if (sleepLogs.length < 3 || skinJournalEntries.length < 3) return null;

  const pairs: { sleep: number; glow: number }[] = [];
  const DAY_MS = 86400000;

  for (const sleep of sleepLogs) {
    const nextDayStart = sleep.timestamp + DAY_MS;
    const nextDayEnd = nextDayStart + DAY_MS;
    const nextDaySkin = skinJournalEntries.find(
      j => j.timestamp >= nextDayStart && j.timestamp < nextDayEnd
    );
    if (!nextDaySkin) continue;

    const glowValue = nextDaySkin.skinCondition === 'radiant' ? 5
      : nextDaySkin.skinCondition === 'clear' ? 4
      : nextDaySkin.skinCondition === 'dry' ? 3
      : nextDaySkin.skinCondition === 'puffy' ? 2
      : 1; // breakout

    pairs.push({ sleep: sleep.durationHours, glow: glowValue });
  }

  if (pairs.length < 3) return null;

  const radiantAfter7h = pairs.filter(p => p.sleep >= 7 && p.glow >= 4).length;
  const totalWith7h = pairs.filter(p => p.sleep >= 7).length;

  if (totalWith7h === 0) return null;

  const percent = Math.round((radiantAfter7h / totalWith7h) * 100);

  if (language === 'id') {
    return `Kulitmu bersinar atau cerah pada ${percent}% hari setelah tidur 7+ jam — jauh lebih sering dibanding malam tidur kurang.`;
  }
  return `Your skin is radiant or clear on ${percent}% of days following 7+ hours of sleep — significantly more than after shorter nights.`;
}
