import { useMemo } from 'react';
import type { LegacyWeightPlanResult, MeasurementEntry } from '@/lib/types';
import { getPlanProgress } from '@/lib/planner';

export function usePlanProgress(
  activePlan: LegacyWeightPlanResult | null,
  measurements: MeasurementEntry[],
  fallbackWeight: number
) {
  return useMemo(() => {
    if (!activePlan) {
      return null;
    }

    return getPlanProgress(activePlan, measurements, fallbackWeight);
  }, [activePlan, measurements, fallbackWeight]);
}
