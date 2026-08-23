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

export type SkinCondition = 'radiant' | 'clear' | 'dry' | 'breakout' | 'puffy';

export interface CycleLogEntry {
  id: string;
  timestamp: number;
  cycleDay: number;
  symptoms: string[];
  skinCondition?: SkinCondition;
}

export interface SelfCareLogEntry {
  id: string;
  timestamp: number;
  checkedItems: string[]; // List of IDs or names of completed tasks
  skinCondition?: SkinCondition;
}

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

export interface CyclePhaseInfo {
  phase: CyclePhase;
  phaseName: string;
  daysRange: string;
  summary: string;
  nutritionAdvice: string[];
  workoutAdvice: string[];
  skinAdvice: string;
  calorieAdjustmentKcal: number;
}

export interface SkinGlowScore {
  score: number; // 0-100
  status: 'radiant' | 'blooming' | 'needs_care';
  label: string;
  antioxidantScore: number;
  hydrationScore: number;
  sleepScore: number;
  topTip: string;
}

export interface GlowRecipe {
  id: string;
  name: string;
  nameId: string;
  tag: string;
  tagId: string;
  calories: number;
  protein: number;
  fiber: number;
  vitaminC: number;
  vitaminE: number;
  zinc: number;
  omega3: number;
  biotin: number;
  sugar: number;
  sodium: number;
  quantity: string;
  prepTime: string;
  glowBenefit: string;
  glowBenefitId: string;
  ingredients: string[];
  ingredientsId: string[];
}

export interface PartnerCheer {
  id: string;
  fromName: string;
  toName?: string;
  message: string;
  timestamp: number;
  icon: string;
}

export interface TimedHydrationMilestone {
  hour: number;
  targetMl: number;
  title: string;
  titleId: string;
  emoji: string;
}

export interface SkinJournalEntry {
  id: string;
  timestamp: number;
  skinCondition: SkinCondition;
  photoUrl?: string;
  note?: string;
}

export interface CaffeineLogEntry {
  id: string;
  timestamp: number;
  name: string;
  caffeineMg: number;
  icon?: string;
}

export interface AffirmationItem {
  id: string;
  textEn: string;
  textId: string;
  author: string;
  phase?: CyclePhase;
}

export interface SleepQualityScore {
  total: number;
  durationScore: number;
  restednessScore: number;
  caffeinePenalty: number;
  consistencyBonus: number;
  label: string;
  labelId: string;
  tip: string;
  tipId: string;
  colorClass: string;
}

export interface GutHealthScore {
  fiberG: number;
  fiberTarget: number;
  fiberPercent: number;
  probioticServings: number;
  probioticTarget: number;
  total: number;
  label: string;
  labelId: string;
  tip: string;
  tipId: string;
  colorClass: string;
}

export interface ProbioticLogEntry {
  id: string;
  timestamp: number;
  foodName: string;
  foodNameId: string;
  icon: string;
  servings: number;
}

export interface HairNailScore {
  biotinScore: number;
  ironScore: number;
  zincScore: number;
  omega3Score: number;
  vitaminEScore: number;
  total: number;
  label: string;
  labelId: string;
  tip: string;
  tipId: string;
  colorClass: string;
}

export interface HairNailAssessment {
  id: string;
  timestamp: number;
  shedding: 'normal' | 'increased' | 'significant';
  nailCondition: 'strong' | 'brittle' | 'ridged';
  scalpCondition: 'healthy' | 'dry' | 'oily' | 'irritated';
  notes?: string;
}

export interface MonthlyReport {
  month: string;
  daysTracked: number;
  avgGlowScore: number;
  glowTrend: number;
  avgSleepHours: number;
  longestStreak: number;
  waterAdherencePercent: number;
  topNutrients: string[];
  skinDistribution: { radiant: number; clear: number; dry: number; puffy: number; breakout: number };
  bestGlowDay: { date: string; score: number } | null;
  worstGlowDay: { date: string; score: number } | null;
  milestones: string[];
  milestonesId: string[];
  earliestJournalPhoto: string | null;
  latestJournalPhoto: string | null;
}

export interface BeautyTea {
  id: string;
  name: string;
  nameId: string;
  icon: string;
  tagline: string;
  taglineId: string;
  steepMinutes: number;
  ingredients: string[];
  ingredientsId: string[];
  beautyBenefits: string;
  beautyBenefitsId: string;
  targetPhase?: CyclePhase;
  targetSkinCondition?: SkinCondition;
  antioxidantMg: number; // estimated polyphenols / vit C
}

export interface PlateSequenceCheck {
  veggiesFirst: boolean;
  proteinSecond: boolean;
  carbsLast: boolean;
}

export interface SolfeggioPreset {
  freq: number;
  name: string;
  nameId: string;
  purpose: string;
  purposeId: string;
  icon: string;
  color: string;
}

export type SkincareCategory = 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment' | 'oil';

export interface SkincareProduct {
  id: string;
  name: string;
  category: SkincareCategory;
  activeIngredients: string[];
  openedDate: number; // timestamp
  paoMonths: number;  // Period After Opening in months (e.g. 3, 6, 12)
  icon?: string;
}

export interface IngredientConflict {
  pair: [string, string];
  severity: 'caution' | 'warning' | 'high';
  messageEn: string;
  messageId: string;
}

export interface SkinBarrierScore {
  score: number; // 0-100
  status: 'optimal' | 'vulnerable' | 'compromised';
  tewlLevel: string; // e.g. "Low (Protected)"
  labelEn: string;
  labelId: string;
  tipEn: string;
  tipId: string;
  colorClass: string;
}

export interface CellularHydrationItem {
  id: string;
  nameEn: string;
  nameId: string;
  icon: string;
  waterMl: number;
  minerals: { sodiumMg: number; potassiumMg: number; magnesiumMg: number };
  benefitEn: string;
  benefitId: string;
}

export interface RestorativeYogaPose {
  id: string;
  name: string;
  nameId: string;
  sanskrit: string;
  durationSec: number;
  icon: string;
  instructionsEn: string;
  instructionsId: string;
  benefitEn: string;
  benefitId: string;
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

export interface LegacyWeightPlanResult extends WeightPlanResult {
  targetLossKg?: number;
}

export interface AchievedPlan extends WeightPlanResult {
  achievedDate: number;
  endWeight: number;
}

export type HistoryLogEntry =
  | (FoodLogEntry & { type: 'food' })
  | (ActivityEntry & { type: 'activity' })
  | (WaterLogEntry & { type: 'water'; name: string })
  | (SleepLogEntry & { type: 'sleep'; name: string })
  | (CycleLogEntry & { type: 'cycle'; name: string })
  | (SelfCareLogEntry & { type: 'selfCare'; name: string })
  | (MeasurementEntry & { type: 'measurement'; name: string });

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
