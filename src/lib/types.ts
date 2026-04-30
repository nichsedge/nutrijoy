export type Language = 'en' | 'id';

export interface UserProfile {
  name: string;
  age: number;
  sex: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
  targetWeightLossPerWeek?: number; // kg
  language: Language;
}

export interface FoodLogEntry {
  id: string;
  timestamp: number;
  name: string;
  quantity: string;
  calories: number;
  sugar: number; // g
  sodium: number; // mg
}

export interface ActivityEntry {
  id: string;
  timestamp: number;
  name: string;
  duration: number; // minutes
  caloriesBurned: number;
}

export interface AppState {
  profile: UserProfile | null;
  foodLogs: FoodLogEntry[];
  activities: ActivityEntry[];
}

export interface TDEEResult {
  bmr: number;
  tdee: number;
  recommendedCalories: number;
  sugarLimit: number;
  sodiumLimit: number;
}