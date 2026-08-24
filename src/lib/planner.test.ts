import { test } from 'node:test';
import assert from 'node:assert';
import { parseDecimalInput, getPlanTargetChange, getPlanFinalTargetWeight, getPlanProgress } from './planner';
import type { LegacyWeightPlanResult, MeasurementEntry } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

function makeMeasurement(weight: number, timestamp: number): MeasurementEntry {
  return {
    id: `m-${timestamp}`,
    timestamp,
    weight,
    waist: 0,
    hips: 0,
    neck: 0,
  };
}

test('parseDecimalInput handles international decimal commas', () => {
  assert.strictEqual(parseDecimalInput('72,5'), 72.5);
  assert.strictEqual(parseDecimalInput('72.5'), 72.5);
});

test('parseDecimalInput returns 0 for empty or invalid input', () => {
  assert.strictEqual(parseDecimalInput(''), 0);
  assert.strictEqual(parseDecimalInput('abc'), 0);
});

test('getPlanTargetChange prefers targetChangeKg over legacy field', () => {
  assert.strictEqual(getPlanTargetChange({ targetChangeKg: 4 } as LegacyWeightPlanResult), 4);
  assert.strictEqual(getPlanTargetChange({ targetLossKg: 6 } as LegacyWeightPlanResult), 6);
  // Both present: new field wins
  assert.strictEqual(getPlanTargetChange({ targetChangeKg: 4, targetLossKg: 6 } as LegacyWeightPlanResult), 4);
  assert.strictEqual(getPlanTargetChange({} as LegacyWeightPlanResult), 0);
});

test('getPlanFinalTargetWeight adds for gain and subtracts for loss', () => {
  const gain = getPlanFinalTargetWeight({ goal: 'gain', startWeight: 60, targetChangeKg: 5 } as LegacyWeightPlanResult);
  const loss = getPlanFinalTargetWeight({ goal: 'lose', startWeight: 80, targetChangeKg: 5 } as LegacyWeightPlanResult);
  assert.strictEqual(gain, 65);
  assert.strictEqual(loss, 75);
});

test('getPlanProgress handles degenerate plan (no duration/change)', () => {
  const result = getPlanProgress(
    { durationWeeks: 0, startWeight: 70, targetChangeKg: 3 } as LegacyWeightPlanResult,
    [],
    71
  );
  assert.strictEqual(result.currentWeek, 0);
  assert.deepStrictEqual(result.weeklyData, []);
  assert.strictEqual(result.latestWeight, 71);
});

test('getPlanProgress builds weekly targets for a loss plan', () => {
  const startDate = Date.now() - 10 * DAY_MS; // ~week 2
  const plan = {
    goal: 'lose',
    startWeight: 80,
    targetChangeKg: 8,
    durationWeeks: 8,
    startDate,
  } as LegacyWeightPlanResult;

  const result = getPlanProgress(plan, [], 80);

  assert.strictEqual(result.weeklyData.length, 8);
  assert.strictEqual(result.currentWeek, 2); // floor(10/7)+1 = 2
  assert.strictEqual(result.currentWeekTarget, 78); // 80 - (8/8 * 1)
  assert.strictEqual(result.finalTargetWeight, 72);
  // No measurements yet → falls back to profile weight, 0% progress
  assert.strictEqual(result.weekProgress, 0);
});

test('getPlanProgress computes progress from latest measurement', () => {
  const startDate = Date.now() - 28 * DAY_MS;
  const plan = {
    goal: 'lose',
    startWeight: 80,
    targetChangeKg: 4,
    durationWeeks: 4,
    startDate,
  } as LegacyWeightPlanResult;

  const measurements = [
    makeMeasurement(79, startDate + 7 * DAY_MS),
    makeMeasurement(77, startDate + 21 * DAY_MS), // latest
    makeMeasurement(78.5, startDate + 14 * DAY_MS),
  ];

  const result = getPlanProgress(plan, measurements, 80);
  assert.strictEqual(result.latestWeight, 77);
  // |77-80| = 3 of 4 kg → 75%
  assert.strictEqual(result.weekProgress, 75);
});

test('getPlanProgress clamps progress to 0–100%', () => {
  const startDate = Date.now() - 28 * DAY_MS;
  const plan = {
    goal: 'lose',
    startWeight: 80,
    targetChangeKg: 2,
    durationWeeks: 4,
    startDate,
  } as LegacyWeightPlanResult;

  const overshoot = getPlanProgress(plan, [makeMeasurement(70, startDate + DAY_MS)], 80);
  assert.strictEqual(overshoot.weekProgress, 100);

  const gainedBack = getPlanProgress(plan, [makeMeasurement(82, startDate + DAY_MS)], 80);
  assert.strictEqual(gainedBack.weekProgress, 100); // abs(82-80)=2 → 100%, still clamped
});

test('getPlanProgress ignores measurements before plan start', () => {
  const startDate = Date.now() - 14 * DAY_MS;
  const plan = {
    goal: 'lose',
    startWeight: 80,
    targetChangeKg: 2,
    durationWeeks: 4,
    startDate,
  } as LegacyWeightPlanResult;

  const result = getPlanProgress(plan, [makeMeasurement(75, startDate - DAY_MS)], 80);
  assert.strictEqual(result.latestWeight, 80); // fallback used
});
