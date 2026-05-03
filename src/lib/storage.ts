import type { AppState, UserProfile, FoodLogEntry, ActivityEntry, MeasurementEntry } from './types';
import { get, set, del } from 'idb-keyval';
import { z } from 'zod';

const STORAGE_KEY = 'nutrijoy_app_state';

const UserProfileSchema = z.object({
  name: z.string(),
  age: z.number(),
  sex: z.enum(['male', 'female']),
  height: z.number(),
  weight: z.number(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  goal: z.enum(['lose', 'maintain', 'gain', 'recompose']),
  targetWeightLossPerWeek: z.number().optional(),
  language: z.enum(['en', 'id'])
});

const FoodLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  name: z.string(),
  quantity: z.string(),
  calories: z.number(),
  protein: z.number(),
  fiber: z.number().optional(),
  vitaminC: z.number().optional(),
  biotin: z.number().optional(),
  zinc: z.number().optional(),
  omega3: z.number().optional(),
  vitaminE: z.number().optional(),
  sugar: z.number(),
  sodium: z.number()
});

const ActivityEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  name: z.string(),
  duration: z.number(),
  caloriesBurned: z.number()
});

const MeasurementEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  weight: z.number(),
  waist: z.number(),
  hips: z.number(),
  neck: z.number(),
  bodyFatPercentage: z.number().optional()
});

const WaterLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  amountMl: z.number()
});

const SleepLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  durationHours: z.number(),
  restednessScore: z.number()
});

const CycleLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  cycleDay: z.number(),
  symptoms: z.array(z.string())
});

const SelfCareLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  checkedItems: z.array(z.string())
});

const WeightPlanResultSchema = z.object({
  bmr: z.number(),
  tdee: z.number(),
  dailyTarget: z.number(),
  dailyDeficit: z.number(),
  status: z.enum(['safe', 'too_aggressive', 'unsafe']),
  warningMessage: z.string().optional(),
  id: z.string().optional(),
  startDate: z.number().optional(),
  targetChangeKg: z.number().optional(),
  durationWeeks: z.number().optional(),
  startWeight: z.number().optional(),
  goal: z.enum(['lose', 'maintain', 'gain', 'recompose']).optional()
});

const AchievedPlanSchema = WeightPlanResultSchema.extend({
  achievedDate: z.number(),
  endWeight: z.number()
});

export const AppStateSchema = z.object({
  profile: UserProfileSchema.nullable(),
  foodLogs: z.array(FoodLogEntrySchema),
  activities: z.array(ActivityEntrySchema),
  measurements: z.array(MeasurementEntrySchema),
  waterLogs: z.array(WaterLogEntrySchema),
  sleepLogs: z.array(SleepLogEntrySchema),
  cycleLogs: z.array(CycleLogEntrySchema),
  selfCareLogs: z.array(SelfCareLogEntrySchema),
  activePlan: WeightPlanResultSchema.nullable(),
  planHistory: z.array(AchievedPlanSchema)
});

const defaultState: AppState = {
  profile: null,
  foodLogs: [],
  activities: [],
  measurements: [],
  waterLogs: [],
  sleepLogs: [],
  cycleLogs: [],
  selfCareLogs: [],
  activePlan: null,
  planHistory: [],
};

export function sanitizeState(state: any): AppState {
  return {
    ...defaultState,
    ...state,
    // Ensure arrays and objects exist even if missing in old state
    foodLogs: state.foodLogs || [],
    activities: state.activities || [],
    measurements: state.measurements || [],
    waterLogs: state.waterLogs || [],
    sleepLogs: state.sleepLogs || [],
    cycleLogs: state.cycleLogs || [],
    selfCareLogs: state.selfCareLogs || [],
    planHistory: state.planHistory || [],
    activePlan: state.activePlan || null,
  };
}

/**
 * Loads state from IndexedDB with a fallback migration from localStorage.
 */
export async function loadState(): Promise<AppState> {
  if (typeof window === 'undefined') return defaultState;

  try {
    // Try to get from IndexedDB
    let stored = await get(STORAGE_KEY);

    if (!stored) {
      // Fallback/Migration from legacy localStorage
      const legacyStored = localStorage.getItem(STORAGE_KEY);
      if (legacyStored) {
        try {
          stored = JSON.parse(legacyStored);
          // Port to IndexedDB
          await set(STORAGE_KEY, stored);
          // Optional: Clear legacy storage to prevent future confusion
          // localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.error("Failed to parse legacy storage", e);
        }
      }
    }

    if (!stored) return defaultState;
    return sanitizeState(stored);
  } catch (e) {
    console.error("Error loading state from IndexedDB", e);
    return defaultState;
  }
}

/**
 * Saves state to IndexedDB.
 */
export async function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    await set(STORAGE_KEY, state);
  } catch (e) {
    console.error("Error saving state to IndexedDB", e);
  }
}

/**
 * Clears state from IndexedDB.
 */
export async function clearState() {
  if (typeof window === 'undefined') return;
  try {
    await del(STORAGE_KEY);
  } catch (e) {
    console.error("Error clearing IndexedDB", e);
  }
}

export function exportData(state: AppState) {
  const dataStr = JSON.stringify(state);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = `nutrijoy_backup_${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function importData(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawState = JSON.parse(event.target?.result as string);
        const sanitized = sanitizeState(rawState);
        const validatedState = AppStateSchema.parse(sanitized);
        resolve(validatedState);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}
