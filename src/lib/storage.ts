import { AppState, UserProfile, FoodLogEntry, ActivityEntry, MeasurementEntry } from './types';

const STORAGE_KEY = 'nutrijoy_app_state';

const defaultState: AppState = {
  profile: null,
  foodLogs: [],
  activities: [],
  measurements: [],
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
    planHistory: state.planHistory || [],
    activePlan: state.activePlan || null,
  };
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return defaultState;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaultState;
  try {
    const state = JSON.parse(stored);
    return sanitizeState(state);
  } catch (e) {
    return defaultState;
  }
}

export function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
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