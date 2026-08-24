import { test } from 'node:test';
import assert from 'node:assert';
import { ACTIVITY_MULTIPLIERS, calculateBMR, calculateTDEE, calculateWeightPlan } from './nutrition';
import type { UserProfile } from './types';

const baseProfile: UserProfile = {
  name: 'Test',
  age: 30,
  sex: 'female',
  height: 165,
  weight: 60,
  activityLevel: 'moderate',
  goal: 'maintain',
  language: 'en',
};

test('calculateBMR uses Mifflin-St Jeor for males', () => {
  // 10*80 + 6.25*180 - 5*30 + 5
  assert.strictEqual(calculateBMR(80, 180, 30, 'male'), 1780);
});

test('calculateBMR uses Mifflin-St Jeor for females', () => {
  // 10*60 + 6.25*165 - 5*30 - 161
  assert.strictEqual(calculateBMR(60, 165, 30, 'female'), 1320.25);
});

test('calculateTDEE maintains at maintenance goal', () => {
  const result = calculateTDEE({ ...baseProfile, goal: 'maintain' });
  const expected = 1320.25 * ACTIVITY_MULTIPLIERS.moderate;
  assert.strictEqual(result.bmr, 1320.25); // raw, unrounded
  assert.ok(Math.abs(result.tdee - expected) < 1);
  assert.strictEqual(result.recommendedCalories, Math.round(expected));
});

test('calculateTDEE subtracts 500 kcal for lose goal', () => {
  const result = calculateTDEE({ ...baseProfile, goal: 'lose' });
  const tdee = 1320.25 * ACTIVITY_MULTIPLIERS.moderate;
  assert.strictEqual(result.recommendedCalories, Math.round(tdee - 500));
});

test('calculateTDEE adds 300 kcal for gain goal', () => {
  const result = calculateTDEE({ ...baseProfile, goal: 'gain' });
  const tdee = 1320.25 * ACTIVITY_MULTIPLIERS.moderate;
  assert.strictEqual(result.recommendedCalories, Math.round(tdee + 300));
});

test('calculateTDEE floors at 1200 kcal minimum for females', () => {
  const tinyProfile: UserProfile = {
    ...baseProfile,
    age: 80,
    weight: 35,
    height: 140,
    activityLevel: 'sedentary',
    goal: 'lose',
  };
  const result = calculateTDEE(tinyProfile);
  assert.strictEqual(result.recommendedCalories, 1200);
});

test('calculateTDEE floors at 1500 kcal minimum for males', () => {
  const tinyProfile: UserProfile = {
    ...baseProfile,
    sex: 'male',
    age: 80,
    weight: 40,
    height: 150,
    activityLevel: 'sedentary',
    goal: 'lose',
  };
  const result = calculateTDEE(tinyProfile);
  assert.strictEqual(result.recommendedCalories, 1500);
});

test('calculateTDEE protein limit is 2.0 g/kg for recompose', () => {
  const result = calculateTDEE({ ...baseProfile, goal: 'recompose' });
  assert.strictEqual(result.proteinLimit, Math.round(60 * 2.0));
});

test('calculateTDEE protein limit is min 50g', () => {
  const result = calculateTDEE({ ...baseProfile, weight: 20, goal: 'maintain' });
  assert.strictEqual(result.proteinLimit, 50);
});

test('calculateWeightPlan safe loss plan', () => {
  const result = calculateWeightPlan({
    currentWeight: 80,
    targetChangeKg: 4,
    durationWeeks: 8,
    age: 30,
    height: 180,
    sex: 'male',
    activityLevel: 'moderate',
    goal: 'lose',
  });
  // dailyChange = 4*7700 / 56 = 550 kcal deficit — under 1000, above floor
  assert.strictEqual(result.status, 'safe');
  assert.strictEqual(result.dailyDeficit, 550);
  assert.ok(result.dailyTarget < result.tdee);
});

test('calculateWeightPlan flags too_aggressive when deficit > 1000', () => {
  const result = calculateWeightPlan({
    currentWeight: 130,
    targetChangeKg: 10,
    durationWeeks: 9,
    age: 30,
    height: 190,
    sex: 'male',
    activityLevel: 'very_active',
    goal: 'lose',
  });
  // BMR ≈ 2342.5, TDEE ≈ 4451; dailyChange = 10*7700 / 63 ≈ 1222 > 1000
  // and dailyTarget ≈ 3229 stays above the 1500 floor → aggressive but not unsafe
  assert.strictEqual(result.status, 'too_aggressive');
  assert.ok(result.warningMessage?.includes('too aggressive'));
});

test('calculateWeightPlan marks unsafe and floors target below min calories', () => {
  const result = calculateWeightPlan({
    currentWeight: 45,
    targetChangeKg: 5,
    durationWeeks: 4,
    age: 25,
    height: 155,
    sex: 'female',
    activityLevel: 'light',
    goal: 'lose',
  });
  assert.strictEqual(result.status, 'unsafe');
  assert.strictEqual(result.dailyTarget, 1200);
  assert.ok(result.warningMessage?.includes('1200'));
});

test('calculateWeightPlan gain plan adds surplus and flags aggression', () => {
  const base = {
    currentWeight: 60,
    age: 30,
    height: 170,
    sex: 'male' as const,
    activityLevel: 'moderate' as const,
  };
  const ok = calculateWeightPlan({ ...base, targetChangeKg: 2, durationWeeks: 8, goal: 'gain' });
  assert.strictEqual(ok.status, 'safe');
  assert.strictEqual(ok.dailyDeficit, 275); // surplus of ~275

  const aggressive = calculateWeightPlan({ ...base, targetChangeKg: 8, durationWeeks: 4, goal: 'gain' });
  assert.strictEqual(aggressive.status, 'too_aggressive');
});

test('calculateWeightPlan maintain has zero deficit', () => {
  const result = calculateWeightPlan({
    currentWeight: 70,
    targetChangeKg: 3,
    durationWeeks: 6,
    age: 40,
    height: 175,
    sex: 'male',
    activityLevel: 'active',
    goal: 'maintain',
  });
  assert.strictEqual(result.status, 'safe');
  assert.strictEqual(result.dailyDeficit, 0);
});
