export type Language = 'en' | 'id';

export interface UserProfile {
  name: string;
  age: number;
  sex: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain' | 'recompose';
  targetWeightLossPerWeek?: number; // kg
  language: Language;
}

export interface FoodLogEntry {
  id: string;
  timestamp: number;
  name: string;
  quantity: string;
  calories: number;
  protein: number; // g
  fiber?: number; // g
  vitaminC?: number; // mg
  biotin?: number; // mcg
  zinc?: number; // mg
  omega3?: number; // mg
  vitaminE?: number; // mg
  sugar: number; // g
  sodium: number; // mg
}

export interface SleepLogEntry {
  id: string;
  timestamp: number;
  durationHours: number;
  restednessScore: number; // 1-5
}

export interface CycleLogEntry {
  id: string;
  timestamp: number;
  cycleDay: number;
  symptoms: string[];
}

export interface SelfCareLogEntry {
  id: string;
  timestamp: number;
  checkedItems: string[]; // List of IDs or names of completed tasks
}

export interface MeasurementEntry {
  id: string;
  timestamp: number;
  weight: number;
  waist: number;
  hips: number;
  neck: number;
  bodyFatPercentage?: number;
}

export interface ActivityEntry {
  id: string;
  timestamp: number;
  name: string;
  duration: number; // minutes
  caloriesBurned: number;
}

export interface WaterLogEntry {
  id: string;
  timestamp: number;
  amountMl: number;
}

export interface TDEEResult {
  bmr: number;
  tdee: number;
  recommendedCalories: number;
  proteinLimit: number;
  fiberLimit: number;
  vitaminCLimit: number;
  biotinLimit: number;
  zincLimit: number;
  omega3Limit: number;
  vitaminELimit: number;
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
  goal: 'lose' | 'maintain' | 'gain' | 'recompose';
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
  goal?: 'lose' | 'maintain' | 'gain' | 'recompose';
}

export interface AchievedPlan extends WeightPlanResult {
  achievedDate: number;
  endWeight: number;
}

export interface AppState {
  profile: UserProfile | null;
  foodLogs: FoodLogEntry[];
  activities: ActivityEntry[];
  measurements: MeasurementEntry[];
  waterLogs: WaterLogEntry[];
  sleepLogs: SleepLogEntry[];
  cycleLogs: CycleLogEntry[];
  selfCareLogs: SelfCareLogEntry[];
  activePlan: WeightPlanResult | null;
  planHistory: AchievedPlan[];
}

export function calculateStreak(state: AppState): number {
  const allLogs = [
    ...(state.foodLogs || []),
    ...(state.activities || []),
    ...(state.waterLogs || []),
    ...(state.sleepLogs || []),
    ...(state.cycleLogs || []),
    ...(state.selfCareLogs || []),
  ];

  if (allLogs.length === 0) return 0;

  const dates = new Set(
    allLogs.map(log => new Date(log.timestamp).setHours(0, 0, 0, 0))
  );

  const sortedDates = Array.from(dates).sort((a, b) => b - a);
  
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date(today).getTime() - 86400000;

  let streak = 0;
  let currentDate = today;

  // Check if they logged today or yesterday to continue streak
  const lastLogDate = sortedDates[0];
  if (lastLogDate < yesterday) return 0;
  
  if (lastLogDate === today || lastLogDate === yesterday) {
    for (const date of sortedDates) {
      if (date === currentDate) {
        streak++;
        currentDate -= 86400000;
      } else if (date < currentDate) {
        break;
      }
    }
  }

  return streak;
}
