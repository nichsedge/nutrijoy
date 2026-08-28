'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  AppState,
  UserProfile,
  FoodLogEntry,
  ActivityEntry,
  MeasurementEntry,
  WaterLogEntry,
  Language,
  WeightPlanResult,
  AchievedPlan,
  SleepLogEntry,
  CycleLogEntry,
  SelfCareLogEntry,
} from '@/lib/types';
import { loadState, saveState, saveStateSlice, STATE_SLICE_KEYS } from '@/lib/storage';

interface AppActionsType {
  setProfile: (profile: UserProfile) => void;
  addFoodLog: (entry: FoodLogEntry) => void;
  addActivity: (entry: ActivityEntry) => void;
  setLanguage: (lang: Language) => void;
  resetState: (newState: AppState) => void;
  setActivePlan: (plan: WeightPlanResult | null) => void;
  completePlan: (endWeight: number) => void;
  removeFoodLog: (id: string) => void;
  removeActivity: (id: string) => void;
  addMeasurement: (entry: MeasurementEntry) => void;
  removeMeasurement: (id: string) => void;
  addWaterLog: (entry: WaterLogEntry) => void;
  removeWaterLog: (id: string) => void;
  addSleepLog: (entry: SleepLogEntry) => void;
  removeSleepLog: (id: string) => void;
  addCycleLog: (entry: CycleLogEntry) => void;
  removeCycleLog: (id: string) => void;
  addSelfCareLog: (entry: SelfCareLogEntry) => void;
  removeSelfCareLog: (id: string) => void;
}

interface AppContextType extends AppActionsType {
  state: AppState;
}

const EMPTY_STATE: AppState = {
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

// Split contexts: consumers of only actions never re-render on state changes,
// and the actions object identity stays stable across renders.
const AppStateContext = createContext<AppState | undefined>(undefined);
const AppActionsContext = createContext<AppActionsType | undefined>(undefined);
const AppHydrationContext = createContext<boolean>(false);

const SAVE_DEBOUNCE_MS = 500;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef<AppState>(state); // latest state for flush-on-hide
  const prevStateRef = useRef<AppState | null>(null); // for per-slice diffing

  // Keep ref in sync outside of render (react-hooks/refs compliant).
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Hydrate from IndexedDB without blocking first paint.
  useEffect(() => {
    let cancelled = false;
    loadState().then((data) => {
      if (!cancelled) {
        setState(data);
        setHydrated(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(() => {
    const current = stateRef.current;
    const prev = prevStateRef.current;
    if (!prev) {
      saveState(current); // first write after hydration: full save
    } else {
      for (const key of STATE_SLICE_KEYS) {
        if (prev[key] !== current[key]) saveStateSlice(key, current[key]);
      }
    }
    prevStateRef.current = current;
  }, []);

  // Debounced persistence: only slices that actually changed get written.
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(persist, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
    };
  }, [state, hydrated, persist]);

  // Flush pending save when the page is hidden/closed so data is never lost.
  useEffect(() => {
    if (!hydrated) return;
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') persist();
    };
    window.addEventListener('pagehide', persist);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', persist);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [hydrated, persist]);

  const setProfile = useCallback((profile: UserProfile) => {
    setState((prev) => ({ ...prev, profile }));
  }, []);

  const addFoodLog = useCallback((entry: FoodLogEntry) => {
    setState((prev) => ({ ...prev, foodLogs: [entry, ...(prev.foodLogs || [])] }));
  }, []);

  const addActivity = useCallback((entry: ActivityEntry) => {
    setState((prev) => ({ ...prev, activities: [entry, ...(prev.activities || [])] }));
  }, []);

  const removeFoodLog = useCallback((id: string) => {
    setState((prev) => ({ ...prev, foodLogs: (prev.foodLogs || []).filter((log) => log.id !== id) }));
  }, []);

  const removeActivity = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activities: (prev.activities || []).filter((act) => act.id !== id) }));
  }, []);

  const addMeasurement = useCallback((entry: MeasurementEntry) => {
    setState((prev) => ({ ...prev, measurements: [entry, ...(prev.measurements || [])] }));
  }, []);

  const removeMeasurement = useCallback((id: string) => {
    setState((prev) => ({ ...prev, measurements: (prev.measurements || []).filter((m) => m.id !== id) }));
  }, []);

  const addWaterLog = useCallback((entry: WaterLogEntry) => {
    setState((prev) => ({ ...prev, waterLogs: [entry, ...(prev.waterLogs || [])] }));
  }, []);

  const removeWaterLog = useCallback((id: string) => {
    setState((prev) => ({ ...prev, waterLogs: (prev.waterLogs || []).filter((w) => w.id !== id) }));
  }, []);

  const addSleepLog = useCallback((entry: SleepLogEntry) => {
    setState((prev) => ({ ...prev, sleepLogs: [entry, ...(prev.sleepLogs || [])] }));
  }, []);

  const removeSleepLog = useCallback((id: string) => {
    setState((prev) => ({ ...prev, sleepLogs: (prev.sleepLogs || []).filter((s) => s.id !== id) }));
  }, []);

  const addCycleLog = useCallback((entry: CycleLogEntry) => {
    setState((prev) => ({ ...prev, cycleLogs: [entry, ...(prev.cycleLogs || [])] }));
  }, []);

  const removeCycleLog = useCallback((id: string) => {
    setState((prev) => ({ ...prev, cycleLogs: (prev.cycleLogs || []).filter((c) => c.id !== id) }));
  }, []);

  const addSelfCareLog = useCallback((entry: SelfCareLogEntry) => {
    setState((prev) => ({ ...prev, selfCareLogs: [entry, ...(prev.selfCareLogs || [])] }));
  }, []);

  const removeSelfCareLog = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selfCareLogs: (prev.selfCareLogs || []).filter((s) => s.id !== id) }));
  }, []);

  const setActivePlan = useCallback((plan: WeightPlanResult | null) => {
    setState((prev) => ({ ...prev, activePlan: plan }));
  }, []);

  const resetState = useCallback((newState: AppState) => {
    setState(newState);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setState((prev) => (prev.profile ? { ...prev, profile: { ...prev.profile, language: lang } } : prev));
  }, []);

  const completePlan = useCallback((endWeight: number) => {
    setState((prev) => {
      if (!prev.activePlan || !prev.profile) return prev;
      const achieved: AchievedPlan = {
        ...prev.activePlan,
        achievedDate: Date.now(),
        endWeight,
      };
      return {
        ...prev,
        activePlan: null,
        planHistory: [achieved, ...(prev.planHistory || [])],
        profile: { ...prev.profile, weight: endWeight },
      };
    });
  }, []);

  // Actions are created once — this object never changes identity.
  const actions = useMemo<AppActionsType>(
    () => ({
      setProfile,
      addFoodLog,
      addActivity,
      setLanguage,
      resetState,
      setActivePlan,
      completePlan,
      removeFoodLog,
      removeActivity,
      addMeasurement,
      removeMeasurement,
      addWaterLog,
      removeWaterLog,
      addSleepLog,
      removeSleepLog,
      addCycleLog,
      removeCycleLog,
      addSelfCareLog,
      removeSelfCareLog,
    }),
    [
      setProfile,
      addFoodLog,
      addActivity,
      setLanguage,
      resetState,
      setActivePlan,
      completePlan,
      removeFoodLog,
      removeActivity,
      addMeasurement,
      removeMeasurement,
      addWaterLog,
      removeWaterLog,
      addSleepLog,
      removeSleepLog,
      addCycleLog,
      removeCycleLog,
      addSelfCareLog,
      removeSelfCareLog,
    ]
  );

  return (
    <AppHydrationContext.Provider value={hydrated}>
      <AppActionsContext.Provider value={actions}>
        <AppStateContext.Provider value={state}>{children}</AppStateContext.Provider>
      </AppActionsContext.Provider>
    </AppHydrationContext.Provider>
  );
}

/** State-only subscription: components using just `state` won't rerender on action identity changes (and vice versa). */
export function useAppState(): AppState {
  const context = useContext(AppStateContext);
  if (context === undefined) throw new Error('useAppState must be used within AppProvider');
  return context;
}

/** Hydration state subscription — true once initial storage load completes. */
export function useHydration(): boolean {
  return useContext(AppHydrationContext);
}

/** Stable action handlers — never triggers re-renders. */
export function useAppActions(): AppActionsType {
  const context = useContext(AppActionsContext);
  if (context === undefined) throw new Error('useAppActions must be used within AppProvider');
  return context;
}

/** Back-compat combined hook. Prefer useAppState/useAppActions in hot paths. */
export function useApp() {
  const state = useAppState();
  const actions = useAppActions();
  return useMemo(() => ({ state, ...actions }), [state, actions]);
}
