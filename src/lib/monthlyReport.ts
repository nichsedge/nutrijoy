import { AppState, SkinJournalEntry, SleepLogEntry } from './types';
import { calculateSkinGlowScore } from './nutrition';
import { calculateStreak } from './types';

export interface MonthlyReport {
  month: string; // e.g. "August 2026"
  daysTracked: number;
  avgGlowScore: number;
  glowTrend: number; // delta vs previous month (or 0)
  avgSleepHours: number;
  longestStreak: number;
  waterAdherencePercent: number;
  topNutrients: string[];
  skinDistribution: {
    radiant: number;
    clear: number;
    dry: number;
    puffy: number;
    breakout: number;
  };
  bestGlowDay: { date: string; score: number } | null;
  worstGlowDay: { date: string; score: number } | null;
  milestones: string[];
  milestonesId: string[];
  earliestJournalPhoto: string | null;
  latestJournalPhoto: string | null;
}

export function generateMonthlyReport(state: AppState, skinJournalEntries: SkinJournalEntry[] = []): MonthlyReport {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEnd = now.getTime();

  // Filter logs to this month
  const foods = (state.foodLogs || []).filter((l) => l.timestamp >= monthStart && l.timestamp <= monthEnd);
  const waters = (state.waterLogs || []).filter((l) => l.timestamp >= monthStart && l.timestamp <= monthEnd);
  const sleeps = (state.sleepLogs || []).filter((l) => l.timestamp >= monthStart && l.timestamp <= monthEnd);
  const journals = skinJournalEntries.filter((l) => l.timestamp >= monthStart && l.timestamp <= monthEnd);

  // Unique tracking days
  const trackedDays = new Set([
    ...foods.map((l) => new Date(l.timestamp).toDateString()),
    ...waters.map((l) => new Date(l.timestamp).toDateString()),
    ...sleeps.map((l) => new Date(l.timestamp).toDateString()),
  ]);
  const daysTracked = trackedDays.size;

  // Per-day glow scores
  const dayScores: { date: string; score: number }[] = [];
  trackedDays.forEach((dateStr) => {
    const dayStart = new Date(dateStr).getTime();
    const dayEnd = dayStart + 86400000;
    const dayFoods = foods.filter((l) => l.timestamp >= dayStart && l.timestamp < dayEnd);
    const dayWaters = waters.filter((l) => l.timestamp >= dayStart && l.timestamp < dayEnd);
    const daySleeps = sleeps.filter((l) => l.timestamp >= dayStart && l.timestamp < dayEnd);
    const glow = calculateSkinGlowScore(dayFoods, dayWaters, daySleeps, state.profile);
    dayScores.push({ date: dateStr, score: glow.score });
  });

  const avgGlowScore =
    dayScores.length > 0 ? Math.round(dayScores.reduce((s, d) => s + d.score, 0) / dayScores.length) : 0;

  const sorted = [...dayScores].sort((a, b) => b.score - a.score);
  const bestGlowDay = sorted[0] ?? null;
  const worstGlowDay = sorted[sorted.length - 1] ?? null;

  // Average sleep
  const avgSleepHours =
    sleeps.length > 0 ? parseFloat((sleeps.reduce((s, l) => s + l.durationHours, 0) / sleeps.length).toFixed(1)) : 0;

  // Longest streak (use calculateStreak on state)
  const longestStreak = calculateStreak(state);

  // Water adherence: days ≥ 2000ml / tracked days
  const goodWaterDays = Array.from(trackedDays).filter((dateStr) => {
    const dayStart = new Date(dateStr).getTime();
    const total = waters
      .filter((l) => l.timestamp >= dayStart && l.timestamp < dayStart + 86400000)
      .reduce((s, l) => s + l.amountMl, 0);
    return total >= 2000;
  }).length;
  const waterAdherencePercent = daysTracked > 0 ? Math.round((goodWaterDays / daysTracked) * 100) : 0;

  // Top nutrients from food logs
  const totals = {
    vitaminC: 0,
    omega3: 0,
    biotin: 0,
    zinc: 0,
    vitaminE: 0,
    fiber: 0,
  };
  foods.forEach((f) => {
    totals.vitaminC += f.vitaminC ?? 0;
    totals.omega3 += f.omega3 ?? 0;
    totals.biotin += f.biotin ?? 0;
    totals.zinc += f.zinc ?? 0;
    totals.vitaminE += f.vitaminE ?? 0;
    totals.fiber += f.fiber ?? 0;
  });
  const topNutrients = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(
      ([k]) =>
        ({
          vitaminC: 'Vitamin C',
          omega3: 'Omega-3',
          biotin: 'Biotin',
          zinc: 'Zinc',
          vitaminE: 'Vitamin E',
          fiber: 'Fiber',
        })[k] ?? k
    );

  // Skin condition distribution
  const skinDistribution = { radiant: 0, clear: 0, dry: 0, puffy: 0, breakout: 0 };
  journals.forEach((j) => {
    const c = j.skinCondition;
    if (c in skinDistribution) skinDistribution[c as keyof typeof skinDistribution]++;
  });

  // Photos
  const sortedJournals = [...journals].sort((a, b) => a.timestamp - b.timestamp);
  const earliestJournalPhoto = sortedJournals.find((j) => j.photoUrl)?.photoUrl ?? null;
  const latestJournalPhoto = [...sortedJournals].reverse().find((j) => j.photoUrl)?.photoUrl ?? null;

  // Month name
  const month = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Milestones
  const milestones: string[] = [];
  const milestonesId: string[] = [];
  if (longestStreak >= 30) {
    milestones.push('30-Day Streak 🔥');
    milestonesId.push('Streak 30 Hari 🔥');
  } else if (longestStreak >= 14) {
    milestones.push('2-Week Streak 💪');
    milestonesId.push('Streak 2 Minggu 💪');
  } else if (longestStreak >= 7) {
    milestones.push('1-Week Streak ✨');
    milestonesId.push('Streak 1 Minggu ✨');
  }
  if (avgGlowScore >= 80) {
    milestones.push('Radiance Champion 👑');
    milestonesId.push('Juara Kilau 👑');
  }
  if (waterAdherencePercent >= 80) {
    milestones.push('Hydration Hero 💧');
    milestonesId.push('Pahlawan Hidrasi 💧');
  }
  if (avgSleepHours >= 7.5) {
    milestones.push('Beauty Sleep Master 🌙');
    milestonesId.push('Master Tidur Cantik 🌙');
  }
  if (journals.length >= 10) {
    milestones.push('Skin Journal Enthusiast 📸');
    milestonesId.push('Penggiat Jurnal Kulit 📸');
  }

  return {
    month,
    daysTracked,
    avgGlowScore,
    glowTrend: 0, // Would need previous month data — placeholder
    avgSleepHours,
    longestStreak,
    waterAdherencePercent,
    topNutrients,
    skinDistribution,
    bestGlowDay,
    worstGlowDay,
    milestones,
    milestonesId,
    earliestJournalPhoto,
    latestJournalPhoto,
  };
}
