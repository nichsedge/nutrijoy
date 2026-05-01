import { AppState, UserProfile, FoodLogEntry, ActivityEntry, MeasurementEntry } from './types';
import { get, set, del } from 'idb-keyval';

const STORAGE_KEY = 'nutrijoy_app_state';

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
        const state = JSON.parse(event.target?.result as string);
        resolve(sanitizeState(state));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}
