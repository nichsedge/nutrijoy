import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSkinGlowScore } from './nutrition';
import { getCyclePhase } from './cycleSync';
import { UserProfile, FoodLogEntry, WaterLogEntry, SleepLogEntry } from './types';

const mockProfile: UserProfile = {
  name: 'Sara',
  age: 26,
  sex: 'female',
  height: 165,
  weight: 55,
  activityLevel: 'moderate',
  goal: 'maintain',
  language: 'en',
};

test('calculateSkinGlowScore: calculates high score for optimal glow inputs', () => {
  const foodLogs: FoodLogEntry[] = [
    {
      id: 'f1',
      timestamp: Date.now(),
      name: 'Salmon & Veggies',
      quantity: '1 plate',
      calories: 500,
      protein: 35,
      sugar: 4,
      sodium: 300,
      vitaminC: 90,
      vitaminE: 15,
      zinc: 10,
      omega3: 1500,
      biotin: 30,
    },
  ];

  const waterLogs: WaterLogEntry[] = [
    { id: 'w1', timestamp: Date.now(), amountMl: 1000 },
    { id: 'w2', timestamp: Date.now(), amountMl: 1200 },
  ];

  const sleepLogs: SleepLogEntry[] = [
    { id: 's1', timestamp: Date.now(), durationHours: 8, restednessScore: 5 },
  ];

  const glow = calculateSkinGlowScore(foodLogs, waterLogs, sleepLogs, mockProfile, 'en');

  assert.equal(glow.status, 'radiant');
  assert.ok(glow.score >= 80, `Expected score >= 80, got ${glow.score}`);
  assert.ok(glow.antioxidantScore > 35);
  assert.equal(glow.hydrationScore, 35);
  assert.equal(glow.sleepScore, 25);
});

test('calculateSkinGlowScore: provides hydration tip when water is low', () => {
  const foodLogs: FoodLogEntry[] = [];
  const waterLogs: WaterLogEntry[] = [{ id: 'w1', timestamp: Date.now(), amountMl: 300 }];
  const sleepLogs: SleepLogEntry[] = [];

  const glow = calculateSkinGlowScore(foodLogs, waterLogs, sleepLogs, mockProfile, 'en');

  assert.equal(glow.status, 'needs_care');
  assert.ok(glow.score < 50);
  assert.ok(glow.topTip.toLowerCase().includes('water'));
});

test('getCyclePhase: correctly identifies 4 menstrual cycle phases and advice', () => {
  const menstrual = getCyclePhase(3, 'en');
  assert.equal(menstrual.phase, 'menstrual');
  assert.ok(menstrual.nutritionAdvice.some(a => a.toLowerCase().includes('iron')));

  const follicular = getCyclePhase(10, 'en');
  assert.equal(follicular.phase, 'follicular');
  assert.ok(follicular.workoutAdvice.some(a => a.toLowerCase().includes('strength')));

  const ovulatory = getCyclePhase(14, 'en');
  assert.equal(ovulatory.phase, 'ovulatory');
  assert.ok(ovulatory.nutritionAdvice.some(a => a.toLowerCase().includes('cruciferous') || a.toLowerCase().includes('estrogen')));

  const luteal = getCyclePhase(22, 'en');
  assert.equal(luteal.phase, 'luteal');
  assert.ok(luteal.calorieAdjustmentKcal > 0);
  assert.ok(luteal.nutritionAdvice.some(a => a.toLowerCase().includes('magnesium') || a.toLowerCase().includes('complex carbs')));
});

test('getCyclePhase: provides Indonesian translations when language is id', () => {
  const lutealId = getCyclePhase(21, 'id');
  assert.equal(lutealId.phaseName, 'Fase Luteal');
  assert.ok(lutealId.summary.includes('Progesteron'));
});
