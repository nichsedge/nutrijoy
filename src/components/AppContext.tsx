"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, UserProfile, FoodLogEntry, ActivityEntry, Language } from '@/lib/types';
import { loadState, saveState } from '@/lib/storage';

interface AppContextType {
  state: AppState;
  setProfile: (profile: UserProfile) => void;
  addFoodLog: (entry: FoodLogEntry) => void;
  addActivity: (entry: ActivityEntry) => void;
  setLanguage: (lang: Language) => void;
  resetState: (newState: AppState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    profile: null,
    foodLogs: [],
    activities: [],
  });

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
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
    setState(prev => ({ ...prev, foodLogs: [entry, ...prev.foodLogs] }));
  };

  const addActivity = (entry: ActivityEntry) => {
    setState(prev => ({ ...prev, activities: [entry, ...prev.activities] }));
  };

  const setLanguage = (lang: Language) => {
    if (state.profile) {
      setProfile({ ...state.profile, language: lang });
    }
  };

  const resetState = (newState: AppState) => {
    setState(newState);
  };

  if (!hydrated) return null;

  return (
    <AppContext.Provider value={{ state, setProfile, addFoodLog, addActivity, setLanguage, resetState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}