import type { AppState, UserProfile, FoodLogEntry, ActivityEntry, MeasurementEntry } from './types';
import { get, set, del, keys } from 'idb-keyval';
import { z } from 'zod';

const STORAGE_KEY = 'nutrijoy_app_state';

export const STATE_SLICE_KEYS = [
  'profile',
  'foodLogs',
  'activities',
  'measurements',
  'waterLogs',
  'sleepLogs',
  'cycleLogs',
  'selfCareLogs',
  'activePlan',
  'planHistory',
] as const;

export type StateSliceKey = (typeof STATE_SLICE_KEYS)[number];

const UserProfileSchema = z.object({
  name: z.string(),
  age: z.number(),
  sex: z.enum(['male', 'female']),
  height: z.number(),
  weight: z.number(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
  goal: z.enum(['lose', 'maintain', 'gain', 'recompose']),
  targetWeightLossPerWeek: z.number().optional(),
  language: z.enum(['en', 'id']),
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
  sodium: z.number(),
});

const ActivityEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  name: z.string(),
  duration: z.number(),
  caloriesBurned: z.number(),
});

const MeasurementEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  weight: z.number(),
  waist: z.number(),
  hips: z.number(),
  neck: z.number(),
  bodyFatPercentage: z.number().optional(),
});

const WaterLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  amountMl: z.number(),
});

const SleepLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  durationHours: z.number(),
  restednessScore: z.number(),
});

const CycleLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  cycleDay: z.number(),
  symptoms: z.array(z.string()),
});

const SelfCareLogEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  checkedItems: z.array(z.string()),
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
  goal: z.enum(['lose', 'maintain', 'gain', 'recompose']).optional(),
});

const AchievedPlanSchema = WeightPlanResultSchema.extend({
  achievedDate: z.number(),
  endWeight: z.number(),
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
  planHistory: z.array(AchievedPlanSchema),
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

interface LegacyPlanLike {
  targetChangeKg?: number;
  targetLossKg?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function migrateLegacyPlan(plan: unknown) {
  if (!isRecord(plan)) return null;
  const legacyPlan = plan as LegacyPlanLike;
  return {
    ...plan,
    targetChangeKg: legacyPlan.targetChangeKg ?? legacyPlan.targetLossKg,
  };
}

export function sanitizeState(state: unknown): AppState {
  if (!isRecord(state)) {
    return defaultState;
  }

  const activePlan = migrateLegacyPlan(state.activePlan);
  const planHistoryRaw = Array.isArray(state.planHistory) ? state.planHistory : [];
  const planHistory = planHistoryRaw.map((plan) => migrateLegacyPlan(plan)).filter(Boolean);

  return {
    ...defaultState,
    ...state,
    // Ensure arrays and objects exist even if missing in old state
    foodLogs: Array.isArray(state.foodLogs) ? state.foodLogs : [],
    activities: Array.isArray(state.activities) ? state.activities : [],
    measurements: Array.isArray(state.measurements) ? state.measurements : [],
    waterLogs: Array.isArray(state.waterLogs) ? state.waterLogs : [],
    sleepLogs: Array.isArray(state.sleepLogs) ? state.sleepLogs : [],
    cycleLogs: Array.isArray(state.cycleLogs) ? state.cycleLogs : [],
    selfCareLogs: Array.isArray(state.selfCareLogs) ? state.selfCareLogs : [],
    planHistory: planHistory as AppState['planHistory'],
    activePlan: (activePlan as AppState['activePlan']) || null,
  };
}

/**
 * Saves a single state slice to IndexedDB under its own key.
 * Avoids serializing the whole AppState on every change.
 */
export async function saveStateSlice<K extends StateSliceKey>(key: K, value: AppState[K]) {
  if (typeof window === 'undefined') return;
  try {
    await set(`${STORAGE_KEY}:${key}`, value);
  } catch (e) {
    console.error(`Error saving state slice "${key}" to IndexedDB`, e);
  }
}

/**
 * Loads state from per-slice IndexedDB keys, falling back to the legacy
 * monolithic key (and migrating it to slices when found).
 */
export async function loadState(): Promise<AppState> {
  if (typeof window === 'undefined') return defaultState;

  try {
    // Per-slice read (current format)
    const entries = await Promise.all(
      STATE_SLICE_KEYS.map(async (k) => [k, await get(`${STORAGE_KEY}:${k}`)] as const)
    );
    if (entries.some(([, v]) => v !== undefined)) {
      const assembled = { ...defaultState } as Record<string, unknown>;
      for (const [k, v] of entries) {
        if (v !== undefined) assembled[k] = v;
      }
      return validate(assembled);
    }

    // Legacy monolithic read + migration
    let stored = await get(STORAGE_KEY);
    if (!stored) {
      const legacyStored = localStorage.getItem(STORAGE_KEY);
      if (legacyStored) {
        try {
          stored = JSON.parse(legacyStored);
          await set(STORAGE_KEY, stored);
        } catch (e) {
          console.error('Failed to parse legacy storage', e);
        }
      }
    }
    if (!stored) return defaultState;

    const validated = await validate(stored);
    // Migrate to per-slice keys and drop the monolithic one
    await Promise.all([...STATE_SLICE_KEYS.map((k) => set(`${STORAGE_KEY}:${k}`, validated[k])), del(STORAGE_KEY)]);
    localStorage.removeItem(STORAGE_KEY);
    return validated;
  } catch (e) {
    console.error('Error loading state from IndexedDB', e);
    return defaultState;
  }
}

async function validate(stored: unknown): Promise<AppState> {
  const sanitized = sanitizeState(stored);
  const parsed = AppStateSchema.safeParse(sanitized);
  if (!parsed.success) {
    console.error('Invalid app state shape in storage', parsed.error);
    return defaultState;
  }
  return parsed.data;
}

/**
 * Saves state to IndexedDB.
 */
export async function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    await set(STORAGE_KEY, state);
  } catch (e) {
    console.error('Error saving state to IndexedDB', e);
  }
}

/**
 * Clears state from IndexedDB.
 */
export async function clearState() {
  if (typeof window === 'undefined') return;
  try {
    await Promise.all([del(STORAGE_KEY), ...STATE_SLICE_KEYS.map((k) => del(`${STORAGE_KEY}:${k}`))]);
  } catch (e) {
    console.error('Error clearing IndexedDB', e);
  }
}

export function exportData(state: AppState) {
  // Blob URLs are more reliable than data URIs for larger backups.
  const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const exportFileDefaultName = `nutrijoy_backup_${new Date().toISOString().split('T')[0]}.json`;

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', url);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();

  // Revoke after a tick so the download has time to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
