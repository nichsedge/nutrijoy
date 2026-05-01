"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, UserProfile, FoodLogEntry, ActivityEntry, MeasurementEntry, WaterLogEntry, Language, WeightPlanResult, AchievedPlan, SleepLogEntry, CycleLogEntry, SelfCareLogEntry } from '@/lib/types';
import { loadState, saveState } from '@/lib/storage';

interface AppContextType {
  state: AppState;
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
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
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    loadState().then(data => {
      setState(data);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveState(state);
    }
  }, [state, hydrated]);

  const setProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, profile }));
  };

  const addFoodLog = (entry: FoodLogEntry) => {
    setState(prev => ({ ...prev, foodLogs: [entry, ...(prev.foodLogs || [])] }));
  };

  const addActivity = (entry: ActivityEntry) => {
    setState(prev => ({ ...prev, activities: [entry, ...(prev.activities || [])] }));
  };
  
  const removeFoodLog = (id: string) => {
    setState(prev => ({ ...prev, foodLogs: (prev.foodLogs || []).filter(log => log.id !== id) }));
  };

  const removeActivity = (id: string) => {
    setState(prev => ({ ...prev, activities: (prev.activities || []).filter(act => act.id !== id) }));
  };

  const addMeasurement = (entry: MeasurementEntry) => {
    setState(prev => ({ ...prev, measurements: [entry, ...(prev.measurements || [])] }));
  };

  const removeMeasurement = (id: string) => {
    setState(prev => ({ ...prev, measurements: (prev.measurements || []).filter(m => m.id !== id) }));
  };

  const addWaterLog = (entry: WaterLogEntry) => {
    setState(prev => ({ ...prev, waterLogs: [entry, ...(prev.waterLogs || [])] }));
  };

  const removeWaterLog = (id: string) => {
    setState(prev => ({ ...prev, waterLogs: (prev.waterLogs || []).filter(w => w.id !== id) }));
  };

  const addSleepLog = (entry: SleepLogEntry) => {
    setState(prev => ({ ...prev, sleepLogs: [entry, ...(prev.sleepLogs || [])] }));
  };

  const removeSleepLog = (id: string) => {
    setState(prev => ({ ...prev, sleepLogs: (prev.sleepLogs || []).filter(s => s.id !== id) }));
  };

  const addCycleLog = (entry: CycleLogEntry) => {
    setState(prev => ({ ...prev, cycleLogs: [entry, ...(prev.cycleLogs || [])] }));
  };

  const removeCycleLog = (id: string) => {
    setState(prev => ({ ...prev, cycleLogs: (prev.cycleLogs || []).filter(c => c.id !== id) }));
  };

  const addSelfCareLog = (entry: SelfCareLogEntry) => {
    setState(prev => ({ ...prev, selfCareLogs: [entry, ...(prev.selfCareLogs || [])] }));
  };

  const removeSelfCareLog = (id: string) => {
    setState(prev => ({ ...prev, selfCareLogs: (prev.selfCareLogs || []).filter(s => s.id !== id) }));
  };

  const setLanguage = (lang: Language) => {
    if (state.profile) {
      setProfile({ ...state.profile, language: lang });
    }
  };

  const resetState = (newState: AppState) => {
    setState(newState);
  };

  const setActivePlan = (plan: WeightPlanResult | null) => {
    setState(prev => ({ ...prev, activePlan: plan }));
  };

  const completePlan = (endWeight: number) => {
    if (!state.activePlan || !state.profile) return;

    const achieved: AchievedPlan = {
      ...state.activePlan,
      achievedDate: Date.now(),
      endWeight,
    };

    setState(prev => ({
      ...prev,
      activePlan: null,
      planHistory: [achieved, ...(prev.planHistory || [])],
      profile: prev.profile ? { ...prev.profile, weight: endWeight } : null
    }));
  };

  if (!hydrated) return null;

  return (
    <AppContext.Provider value={{ 
      state, 
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
      removeSelfCareLog
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}