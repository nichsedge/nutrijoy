import { UserProfile, TDEEResult, WeightLossPlanInput, WeightLossPlanResult } from './types';

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateBMR(weight: number, height: number, age: number, sex: 'male' | 'female'): number {
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(profile: UserProfile): TDEEResult {
  const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.sex);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel];

  let recommendedCalories = tdee;
  if (profile.goal === 'lose') {
    recommendedCalories = tdee - 500; 
  } else if (profile.goal === 'gain') {
    recommendedCalories = tdee + 300;
  }

  // Enforce minimum safe calories
  const minCalories = profile.sex === 'female' ? 1200 : 1500;
  if (recommendedCalories < minCalories) {
    recommendedCalories = minCalories;
  }

  const sugarLimit = (recommendedCalories * 0.1) / 4; 
  const sodiumLimit = 2000;

  return {
    bmr,
    tdee,
    recommendedCalories: Math.round(recommendedCalories),
    sugarLimit: Math.round(sugarLimit),
    sodiumLimit: Math.round(sodiumLimit),
  };
}

export function calculateWeightLossPlan(input: WeightLossPlanInput): WeightLossPlanResult {
  const { currentWeight, targetLossKg, durationWeeks, age, height, sex, activityLevel } = input;
  
  const bmr = calculateBMR(currentWeight, height, age, sex);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  
  const totalDeficitNeeded = targetLossKg * 7700;
  const days = durationWeeks * 7;
  const dailyDeficit = totalDeficitNeeded / days;
  let dailyTarget = tdee - dailyDeficit;

  let status: WeightLossPlanResult['status'] = 'safe';
  let warningMessage = '';

  const minCalories = sex === 'female' ? 1200 : 1500;

  if (dailyTarget < minCalories) {
    status = 'unsafe';
    if (dailyTarget < 0) {
      warningMessage = `This plan is physically impossible. It requires a deficit larger than your total energy expenditure. Please set a more realistic goal.`;
      dailyTarget = 0;
    } else {
      warningMessage = `This plan results in ${Math.round(dailyTarget)} kcal/day, which is below the minimum safe limit of ${minCalories} kcal/day for your gender.`;
    }
  } else if (dailyDeficit > 1000) {
    status = 'too_aggressive';
    warningMessage = `A daily deficit of ${Math.round(dailyDeficit)} kcal is considered too aggressive. Aim for a deficit under 1000 kcal for sustainable weight loss.`;
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyTarget: Math.round(dailyTarget),
    dailyDeficit: Math.round(dailyDeficit),
    status,
    warningMessage: warningMessage || undefined
  };
}
