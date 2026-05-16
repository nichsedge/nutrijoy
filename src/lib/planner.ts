import type { LegacyWeightPlanResult, MeasurementEntry } from './types';

export interface WeeklyTarget {
  week: number;
  target: number;
  date: number;
}

export interface PlanProgress {
  currentWeek: number;
  currentWeekTarget: number;
  latestWeight: number;
  weekProgress: number;
  weeklyData: WeeklyTarget[];
  finalTargetWeight: number;
  changeKg: number;
}

export function parseDecimalInput(val: string): number {
  if (!val) return 0;
  const parsed = Number.parseFloat(val.replace(',', '.'));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function getPlanTargetChange(plan: LegacyWeightPlanResult): number {
  return plan.targetChangeKg ?? plan.targetLossKg ?? 0;
}

export function getPlanFinalTargetWeight(plan: LegacyWeightPlanResult): number {
  const startWeight = plan.startWeight ?? 0;
  const changeKg = getPlanTargetChange(plan);
  return plan.goal === 'gain' ? startWeight + changeKg : startWeight - changeKg;
}

export function getPlanProgress(
  plan: LegacyWeightPlanResult,
  measurements: MeasurementEntry[],
  fallbackWeight: number
): PlanProgress {
  const durationWeeks = plan.durationWeeks ?? 0;
  const startDate = plan.startDate ?? Date.now();
  const startWeight = plan.startWeight ?? fallbackWeight;
  const changeKg = getPlanTargetChange(plan);
  const weeklyData: WeeklyTarget[] = [];

  if (durationWeeks <= 0 || changeKg <= 0) {
    return {
      currentWeek: 0,
      currentWeekTarget: startWeight,
      latestWeight: fallbackWeight,
      weekProgress: 0,
      weeklyData,
      finalTargetWeight: startWeight,
      changeKg,
    };
  }

  const elapsedWeeks = (Date.now() - startDate) / (1000 * 60 * 60 * 24 * 7);
  const currentWeek = Math.min(durationWeeks, Math.floor(elapsedWeeks) + 1);
  const weeklyChange = changeKg / durationWeeks;

  for (let i = 1; i <= durationWeeks; i++) {
    const targetWeight = plan.goal === 'gain'
      ? startWeight + weeklyChange * i
      : startWeight - weeklyChange * i;

    weeklyData.push({
      week: i,
      target: Math.round(targetWeight * 10) / 10,
      date: startDate + i * 7 * 24 * 60 * 60 * 1000,
    });
  }

  const currentWeekTarget = weeklyData[currentWeek - 1]?.target ?? startWeight;
  const relevantMeasurements = measurements
    .filter((m) => m.timestamp >= startDate)
    .sort((a, b) => b.timestamp - a.timestamp);

  const latestWeight = relevantMeasurements[0]?.weight ?? fallbackWeight;
  const currentChange = Math.abs(latestWeight - startWeight);
  const weekProgress = Math.min(100, Math.max(0, (currentChange / Math.abs(changeKg)) * 100));

  return {
    currentWeek,
    currentWeekTarget,
    latestWeight,
    weekProgress,
    weeklyData,
    finalTargetWeight: getPlanFinalTargetWeight(plan),
    changeKg,
  };
}
