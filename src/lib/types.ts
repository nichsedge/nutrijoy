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

export interface TDEEResult {
  bmr: number;
  tdee: number;
  recommendedCalories: number;
  sugarLimit: number;
  sodiumLimit: number;
}

export interface WeightPlanInput {
  currentWeight: number;
  targetChangeKg: number;
  durationWeeks: number;
  age: number;
  height: number;
  sex: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
}

export interface WeightPlanResult {
  bmr: number;
  tdee: number;
  dailyTarget: number;
  dailyDeficit: number;
  status: 'safe' | 'too_aggressive' | 'unsafe';
  warningMessage?: string;
  // Metadata for active plans
  id?: string;
  startDate?: number;
  targetChangeKg?: number;
  durationWeeks?: number;
  startWeight?: number;
  goal?: 'lose' | 'maintain' | 'gain';
}

export interface AchievedPlan extends WeightPlanResult {
  achievedDate: number;
  endWeight: number;
}

export interface AppState {
  profile: UserProfile | null;
  foodLogs: FoodLogEntry[];
  activities: ActivityEntry[];
  activePlan: WeightPlanResult | null;
  planHistory: AchievedPlan[];
}
