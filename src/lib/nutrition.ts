import {
  UserProfile,
  TDEEResult,
  WeightPlanInput,
  WeightPlanResult,
  SkinGlowScore,
  FoodLogEntry,
  WaterLogEntry,
  SleepLogEntry,
  Language,
} from './types';

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
    goal,
  };
}

export function calculateSkinGlowScore(
  foodLogs: FoodLogEntry[],
  waterLogs: WaterLogEntry[],
  sleepLogs: SleepLogEntry[],
  profile: UserProfile | null,
  language: Language = 'en'
): SkinGlowScore {
  const isId = language === 'id';
  const sex = profile?.sex || 'female';

  // 1. Antioxidant & Glow Micronutrients (40 pts)
  const vitCTarget = 90;
  const vitETarget = 15;
  const zincTarget = sex === 'female' ? 8 : 11;
  const omega3Target = sex === 'female' ? 1100 : 1600;
  const biotinTarget = 30;

  const totalVitC = foodLogs.reduce((acc, f) => acc + (f.vitaminC || 0), 0);
  const totalVitE = foodLogs.reduce((acc, f) => acc + (f.vitaminE || 0), 0);
  const totalZinc = foodLogs.reduce((acc, f) => acc + (f.zinc || 0), 0);
  const totalOmega3 = foodLogs.reduce((acc, f) => acc + (f.omega3 || 0), 0);
  const totalBiotin = foodLogs.reduce((acc, f) => acc + (f.biotin || 0), 0);

  const vitCPct = Math.min(1, totalVitC / vitCTarget);
  const vitEPct = Math.min(1, totalVitE / vitETarget);
  const zincPct = Math.min(1, totalZinc / zincTarget);
  const omega3Pct = Math.min(1, totalOmega3 / omega3Target);
  const biotinPct = Math.min(1, totalBiotin / biotinTarget);

  const avgMicroPct = vitCPct * 0.3 + vitEPct * 0.2 + zincPct * 0.2 + omega3Pct * 0.2 + biotinPct * 0.1;
  const antioxidantScore = Math.round(avgMicroPct * 40);

  // 2. Hydration (35 pts)
  const totalWater = waterLogs.reduce((acc, w) => acc + w.amountMl, 0);
  const hydrationPct = Math.min(1, totalWater / 2000);
  const hydrationScore = Math.round(hydrationPct * 35);

  // 3. Sleep & Rest (25 pts)
  const latestSleep = sleepLogs.length > 0 ? sleepLogs[sleepLogs.length - 1] : null;
  let sleepScore = 15; // default reasonable base if not logged yet
  if (latestSleep) {
    const durPct = Math.min(1, latestSleep.durationHours / 7);
    const restPct = Math.min(1, (latestSleep.restednessScore || 3) / 5);
    sleepScore = Math.round((durPct * 0.6 + restPct * 0.4) * 25);
  }

  const rawScore = antioxidantScore + hydrationScore + sleepScore;
  const score = Math.min(100, Math.max(0, rawScore));

  let status: SkinGlowScore['status'] = 'needs_care';
  let label = isId ? 'Butuh Hidrasi & Istirahat 💧' : 'Needs Hydration & Rest 💧';

  if (score >= 80) {
    status = 'radiant';
    label = isId ? 'Bercahaya & Sehat ✨' : 'Radiant & Glowing ✨';
  } else if (score >= 50) {
    status = 'blooming';
    label = isId ? 'Mekar & Segar 🌸' : 'Blooming Glow 🌸';
  }

  // Dynamic Tip based on lowest contributor
  let topTip = '';
  if (hydrationPct < 0.6) {
    topTip = isId
      ? 'Tingkatkan asupan air putih untuk menjaga kekenyalan kulit dan mengurangi kantung mata.'
      : 'Boost water intake to 2L+ to plump skin cells and flush out excess morning puffiness.';
  } else if (avgMicroPct < 0.5) {
    topTip = isId
      ? 'Tambahkan buah beri, jeruk, atau salmon untuk asupan Vitamin C & Omega-3 pemicu kolagen.'
      : 'Add berries, citrus, or fatty fish to support natural collagen synthesis and skin elasticity.';
  } else if (latestSleep && latestSleep.durationHours < 7) {
    topTip = isId
      ? 'Prioritaskan tidur 7-8 jam malam ini untuk proses regenerasi sel kulit dan reduksi kortisol.'
      : 'Prioritize 7–8 hours of restorative sleep tonight for overnight cellular repair.';
  } else {
    topTip = isId
      ? 'Nutrisi dan hidrasimu sangat optimal! Pertahankan kilau alami kulitmu hari ini.'
      : 'Your glow habits are on point! Radiant skin barrier is well-supported today.';
  }

  return {
    score,
    status,
    label,
    antioxidantScore,
    hydrationScore,
    sleepScore,
    topTip,
  };
}
