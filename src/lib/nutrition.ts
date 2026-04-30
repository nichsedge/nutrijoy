import { UserProfile, TDEEResult } from './types';

export function calculateTDEE(profile: UserProfile): TDEEResult {
  // Mifflin-St Jeor Equation
  let bmr: number;
  if (profile.sex === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const tdee = bmr * multipliers[profile.activityLevel];

  let recommendedCalories = tdee;
  if (profile.goal === 'lose') {
    recommendedCalories = tdee - 500; // Standard 500 kcal deficit
  } else if (profile.goal === 'gain') {
    recommendedCalories = tdee + 300;
  }

  // WHO Guidelines: Sugar < 10% of total energy, Sodium < 2000mg
  const sugarLimit = (recommendedCalories * 0.1) / 4; // 1g sugar = 4 kcal
  const sodiumLimit = 2000;

  return {
    bmr,
    tdee,
    recommendedCalories: Math.round(recommendedCalories),
    sugarLimit: Math.round(sugarLimit),
    sodiumLimit: Math.round(sodiumLimit),
  };
}