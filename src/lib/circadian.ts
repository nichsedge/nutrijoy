import { FoodLogEntry } from './types';

export type EatingWindowStatus = 'optimal' | 'late_eating' | 'compressed' | 'extended' | 'no_logs';

export interface CircadianAnalysis {
  status: EatingWindowStatus;
  firstMealTime: number | null;   // Unix ms
  lastMealTime: number | null;    // Unix ms
  windowHours: number;
  hoursUntilBedtime: number;      // hours after last meal until bedtime
  firstMealLabel: string;
  lastMealLabel: string;
  windowLabel: string;
  windowLabelId: string;
  advice: string;
  adviceId: string;
  colorClass: string;
  optimalWindowStart: string;     // e.g. "7:00 AM"
  optimalWindowEnd: string;       // e.g. "7:00 PM"
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${m} ${period}`;
}

export function getMealTimingAnalysis(
  foodLogs: FoodLogEntry[],
  bedtimeHour: number = 23,
  todayStart?: number
): CircadianAnalysis {
  const dayStart = todayStart ?? new Date().setHours(0, 0, 0, 0);
  const dayEnd = dayStart + 86400000;

  const todayLogs = foodLogs
    .filter(l => l.timestamp >= dayStart && l.timestamp < dayEnd)
    .sort((a, b) => a.timestamp - b.timestamp);

  if (todayLogs.length === 0) {
    return {
      status: 'no_logs',
      firstMealTime: null,
      lastMealTime: null,
      windowHours: 0,
      hoursUntilBedtime: 0,
      firstMealLabel: '--',
      lastMealLabel: '--',
      windowLabel: 'No meals logged today',
      windowLabelId: 'Belum ada makanan tercatat hari ini',
      advice: 'Log your first meal to see your circadian eating window analysis.',
      adviceId: 'Catat makanan pertamamu untuk melihat analisis jendela makan sirkadian.',
      colorClass: 'text-slate-600 bg-slate-50 border-slate-200',
      optimalWindowStart: '7:00 AM',
      optimalWindowEnd: '7:00 PM'
    };
  }

  const firstMealTime = todayLogs[0].timestamp;
  const lastMealTime = todayLogs[todayLogs.length - 1].timestamp;
  const windowHours = (lastMealTime - firstMealTime) / (1000 * 60 * 60);

  const bedtimeMs = dayStart + bedtimeHour * 3600 * 1000;
  const hoursUntilBedtime = (bedtimeMs - lastMealTime) / (1000 * 60 * 60);
  const lastMealHour = new Date(lastMealTime).getHours();

  // Optimal window: 7am start, close at bedtime - 3h
  const optimalEndHour = bedtimeHour - 3;
  const optimalWindowStart = '7:00 AM';
  const optimalEndPeriod = optimalEndHour >= 12 ? 'PM' : 'AM';
  const optimalEndDisplay = optimalEndHour % 12 === 0 ? 12 : optimalEndHour % 12;
  const optimalWindowEnd = `${optimalEndDisplay}:00 ${optimalEndPeriod}`;

  let status: EatingWindowStatus;
  let windowLabel: string;
  let windowLabelId: string;
  let advice: string;
  let adviceId: string;
  let colorClass: string;

  if (hoursUntilBedtime < 2) {
    status = 'late_eating';
    windowLabel = `Late Eating ⚠️ (${windowHours.toFixed(1)}h window)`;
    windowLabelId = `Makan Terlalu Malam ⚠️ (jendela ${windowHours.toFixed(1)} jam)`;
    advice = `Last meal was only ${hoursUntilBedtime < 1 ? '<1' : hoursUntilBedtime.toFixed(1)}h before bedtime. This disrupts melatonin, spikes insulin at night, and impairs overnight skin repair. Aim to finish eating by ${optimalWindowEnd}.`;
    adviceId = `Makanan terakhir hanya ${hoursUntilBedtime < 1 ? '<1' : hoursUntilBedtime.toFixed(1)} jam sebelum tidur. Ini mengganggu melatonin, lonjakan insulin malam hari, dan menghambat perbaikan kulit. Usahakan selesai makan sebelum pukul ${optimalWindowEnd}.`;
    colorClass = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (windowHours > 14) {
    status = 'extended';
    windowLabel = `Extended Window (${windowHours.toFixed(1)}h)`;
    windowLabelId = `Jendela Terlalu Panjang (${windowHours.toFixed(1)} jam)`;
    advice = 'Eating window exceeds 14 hours, which limits overnight cellular repair. Consider shifting breakfast 1–2 hours later to compress your window.',
    adviceId = 'Jendela makan melebihi 14 jam, mengurangi waktu perbaikan sel semalaman. Pertimbangkan menggeser sarapan 1–2 jam lebih siang untuk mempersingkat jendelamu.',
    colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (windowHours <= 12 && hoursUntilBedtime >= 3) {
    status = 'optimal';
    windowLabel = `Optimal Window ✨ (${windowHours.toFixed(1)}h)`;
    windowLabelId = `Jendela Optimal ✨ (${windowHours.toFixed(1)} jam)`;
    advice = 'Perfect eating window! Your body has ample overnight fasting time for cellular autophagy, hormonal reset, and skin collagen repair.',
    adviceId = 'Jendela makan sempurna! Tubuhmu punya waktu puasa malam yang cukup untuk autofagi seluler, reset hormonal, dan perbaikan kolagen kulit.',
    colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else {
    status = 'compressed';
    windowLabel = `Compact Window (${windowHours.toFixed(1)}h)`;
    windowLabelId = `Jendela Cukup Baik (${windowHours.toFixed(1)} jam)`;
    advice = `Good timing! ${hoursUntilBedtime.toFixed(1)} hours of digestive rest before bed helps liver detox and skin overnight regeneration.`;
    adviceId = `Waktu yang baik! ${hoursUntilBedtime.toFixed(1)} jam istirahat pencernaan sebelum tidur membantu detoks hati dan regenerasi kulit.`;
    colorClass = 'text-sky-700 bg-sky-50 border-sky-200';
  }

  return {
    status,
    firstMealTime,
    lastMealTime,
    windowHours: parseFloat(windowHours.toFixed(1)),
    hoursUntilBedtime: parseFloat(hoursUntilBedtime.toFixed(1)),
    firstMealLabel: formatTime(firstMealTime),
    lastMealLabel: formatTime(lastMealTime),
    windowLabel,
    windowLabelId,
    advice,
    adviceId,
    colorClass,
    optimalWindowStart,
    optimalWindowEnd
  };
}
