import { UserProfile, TDEEResult, WeightPlanInput, WeightPlanResult } from './types';

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
  } else if (profile.goal === 'recompose') {
    recommendedCalories = tdee - 200; // Slight deficit for body recomposition
  }

  // Enforce minimum safe calories
  const minCalories = profile.sex === 'female' ? 1200 : 1500;
  if (recommendedCalories < minCalories) {
    recommendedCalories = minCalories;
  }

  const sugarLimit = (recommendedCalories * 0.1) / 4; 
  const sodiumLimit = 2000;
  
  // Protein: ~2.0g/kg for recomposition, ~1.6g/kg otherwise (min 50g)
  let proteinLimit = profile.goal === 'recompose' ? profile.weight * 2.0 : profile.weight * 1.6;
  proteinLimit = Math.max(50, proteinLimit);

  const fiberLimit = profile.goal === 'recompose' ? 30 : 25; // g
  const vitaminCLimit = 90; // mg
  const biotinLimit = 30; // mcg
  const zincLimit = profile.sex === 'female' ? 8 : 11; // mg
  const omega3Limit = profile.sex === 'female' ? 1100 : 1600; // mg
  const vitaminELimit = 15; // mg

  return {
    bmr,
    tdee,
    recommendedCalories: Math.round(recommendedCalories),
    proteinLimit: Math.round(proteinLimit),
    fiberLimit,
    vitaminCLimit,
    biotinLimit,
    zincLimit,
    omega3Limit,
    vitaminELimit,
    sugarLimit: Math.round(sugarLimit),
    sodiumLimit: Math.round(sodiumLimit),
  };
}

export function calculateWeightPlan(input: WeightPlanInput): WeightPlanResult {
  const { currentWeight, targetChangeKg, durationWeeks, age, height, sex, activityLevel, goal } = input;
  
  const bmr = calculateBMR(currentWeight, height, age, sex);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  
  const totalChangeNeeded = targetChangeKg * 7700;
  const days = durationWeeks * 7;
  const dailyChange = totalChangeNeeded / days;
  
  let dailyTarget = tdee;
  let dailyDeficit = 0; // Note: For weight gain, dailyDeficit will represent the daily surplus

  if (goal === 'lose') {
    dailyTarget -= dailyChange;
    dailyDeficit = dailyChange;
  } else if (goal === 'gain') {
    dailyTarget += dailyChange;
    dailyDeficit = dailyChange; // Represents surplus
  } else if (goal === 'recompose') {
    dailyTarget -= 200;
    dailyDeficit = 200;
  } else {
    dailyTarget = tdee;
    dailyDeficit = 0;
  }

  let status: WeightPlanResult['status'] = 'safe';
  let warningMessage = '';

  const minCalories = sex === 'female' ? 1200 : 1500;

  if (goal === 'lose') {
    if (dailyTarget < minCalories) {
      status = 'unsafe';
      warningMessage = `This plan requires ${Math.round(dailyTarget)} kcal/day. To be safe, your target has been floored at the minimum safe limit of ${minCalories} kcal/day.`;
      dailyTarget = minCalories;
      dailyDeficit = tdee - minCalories; // re-adjust to match the safe limit
    } else if (dailyDeficit > 1000) {
      status = 'too_aggressive';
      warningMessage = `A daily deficit of ${Math.round(dailyDeficit)} kcal is considered too aggressive. Aim for a deficit under 1000 kcal for sustainable weight loss.`;
    }
  } else if (goal === 'gain') {
    if (dailyDeficit > 1000) {
      status = 'too_aggressive';
      warningMessage = `A daily surplus of ${Math.round(dailyDeficit)} kcal is considered too aggressive. Aim for a surplus under 1000 kcal for sustainable weight gain.`;
    }
  }

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    dailyTarget: Math.round(dailyTarget),
    dailyDeficit: Math.round(dailyDeficit),
    status,
    warningMessage: warningMessage || undefined,
    goal
  };
}
