import test from 'node:test';
import assert from 'node:assert/strict';

// Sleep Quality
import { calculateSleepScore, getSleepSkinCorrelation } from './sleepQuality';
import { SleepLogEntry, SkinJournalEntry } from './types';

// Gut Health
import { calculateGutScore, getTodayFiber, PROBIOTIC_PRESETS } from './gutHealth';
import { FoodLogEntry } from './types';

// UV Index
import { getUVRiskLevel } from './uvIndex';

// Hair & Nail
import { calculateHairNailScore, getPhaseHairTip } from './hairNailHealth';

// Circadian
import { getMealTimingAnalysis } from './circadian';

// Monthly Report
import { generateMonthlyReport } from './monthlyReport';
import type { AppState } from './types';

// ─── Sleep Quality Tests ─────────────────────────────────────────────────────

test('calculateSleepScore: high score for ideal 8h sleep with 5/5 rested', () => {
  const log: SleepLogEntry = { id: '1', timestamp: Date.now(), durationHours: 8, restednessScore: 5 };
  const score = calculateSleepScore(log, 0);
  assert.ok(score.total >= 80, `Expected >= 80, got ${score.total}`);
  assert.equal(score.durationScore, 50);
  assert.equal(score.restednessScore, 35);
  assert.equal(score.caffeinePenalty, 0);
});

test('calculateSleepScore: applies caffeine penalty correctly', () => {
  const log: SleepLogEntry = { id: '2', timestamp: Date.now(), durationHours: 8, restednessScore: 5 };
  const withCaffeine = calculateSleepScore(log, 80);
  assert.ok(withCaffeine.caffeinePenalty > 0, 'Caffeine penalty should be > 0');
  assert.ok(withCaffeine.total < 85, 'Score should be reduced by caffeine penalty');
});

test('calculateSleepScore: poor sleep (4h, rested=1) produces low score', () => {
  const log: SleepLogEntry = { id: '3', timestamp: Date.now(), durationHours: 4, restednessScore: 1 };
  const score = calculateSleepScore(log, 60);
  assert.ok(score.total < 40, `Expected < 40, got ${score.total}`);
});

test('getSleepSkinCorrelation: returns null for insufficient data', () => {
  const result = getSleepSkinCorrelation([], [], 'en');
  assert.equal(result, null);
});

// ─── Gut Health Tests ────────────────────────────────────────────────────────

test('PROBIOTIC_PRESETS: all presets have required fields', () => {
  for (const p of PROBIOTIC_PRESETS) {
    assert.ok(p.id);
    assert.ok(p.name && p.nameId);
    assert.ok(p.icon);
    assert.ok(typeof p.isPrebiotic === 'boolean');
  }
});

test('calculateGutScore: perfect score for meeting all targets', () => {
  const score = calculateGutScore(25, 2);
  assert.equal(score.total, 100);
  assert.equal(score.fiberPercent, 100);
});

test('calculateGutScore: zero score for no fiber and no probiotics', () => {
  const score = calculateGutScore(0, 0);
  assert.equal(score.total, 0);
});

test('calculateGutScore: partial score for 50% fiber and 1 probiotic', () => {
  const score = calculateGutScore(12.5, 1);
  assert.ok(score.total > 0 && score.total < 100);
});

test('getTodayFiber: sums fiber from today\'s food logs correctly', () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const tomorrow = today + 86400000;
  const logs: FoodLogEntry[] = [
    { id: '1', timestamp: today + 1000, name: 'Oats', quantity: '100g', calories: 300, protein: 10, fiber: 8, sugar: 2, sodium: 10 },
    { id: '2', timestamp: today + 2000, name: 'Kale', quantity: '50g', calories: 30, protein: 2, fiber: 3, sugar: 1, sodium: 5 },
    { id: '3', timestamp: tomorrow + 1000, name: 'Yesterday', quantity: '1', calories: 0, protein: 0, fiber: 10, sugar: 0, sodium: 0 },
  ];
  const total = getTodayFiber(logs, today, tomorrow);
  assert.equal(total, 11);
});

// ─── UV Index Tests ──────────────────────────────────────────────────────────

test('getUVRiskLevel: categorizes UV index ranges correctly', () => {
  assert.equal(getUVRiskLevel(1).level, 'low');
  assert.equal(getUVRiskLevel(3).level, 'moderate');
  assert.equal(getUVRiskLevel(6).level, 'high');
  assert.equal(getUVRiskLevel(9).level, 'very_high');
  assert.equal(getUVRiskLevel(11).level, 'extreme');
});

test('getUVRiskLevel: all risk levels have bilingual advice', () => {
  for (const uv of [1, 4, 7, 9, 12]) {
    const risk = getUVRiskLevel(uv);
    assert.ok(risk.adviceEn.length > 10);
    assert.ok(risk.adviceId.length > 10);
    assert.ok(risk.spfRequired >= 15);
  }
});

// ─── Hair & Nail Tests ───────────────────────────────────────────────────────

test('calculateHairNailScore: high score for meeting all nutrient targets', () => {
  const score = calculateHairNailScore(30, 8, 1100, 15);
  assert.ok(score.total >= 80, `Expected >= 80, got ${score.total}`);
});

test('calculateHairNailScore: low score for near-zero nutrients', () => {
  const score = calculateHairNailScore(0, 0, 0, 0);
  assert.ok(score.total < 10, `Expected < 10, got ${score.total}`);
});

test('getPhaseHairTip: returns bilingual tip for all 4 cycle phases', () => {
  const phases = ['menstrual', 'follicular', 'ovulatory', 'luteal'] as const;
  for (const phase of phases) {
    const tipEn = getPhaseHairTip(phase, 'en');
    const tipId = getPhaseHairTip(phase, 'id');
    assert.ok(tipEn.length > 20);
    assert.ok(tipId.length > 20);
  }
});

// ─── Circadian Tests ─────────────────────────────────────────────────────────

test('getMealTimingAnalysis: returns no_logs status when no food logged', () => {
  const result = getMealTimingAnalysis([], 23);
  assert.equal(result.status, 'no_logs');
});

test('getMealTimingAnalysis: detects late eating when last meal <2h before bedtime', () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const lateLog: FoodLogEntry = {
    id: '1',
    timestamp: today + 22 * 3600 * 1000, // 10pm
    name: 'Late Snack', quantity: '1', calories: 200, protein: 5, sugar: 5, sodium: 100
  };
  const result = getMealTimingAnalysis([lateLog], 23, today);
  assert.equal(result.status, 'late_eating');
});

test('getMealTimingAnalysis: optimal when eating window <= 12h and 3h+ before bed', () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const morning: FoodLogEntry = {
    id: '1', timestamp: today + 8 * 3600 * 1000, // 8am
    name: 'Breakfast', quantity: '1', calories: 400, protein: 20, sugar: 5, sodium: 200
  };
  const afternoon: FoodLogEntry = {
    id: '2', timestamp: today + 17 * 3600 * 1000, // 5pm
    name: 'Dinner', quantity: '1', calories: 600, protein: 30, sugar: 8, sodium: 400
  };
  const result = getMealTimingAnalysis([morning, afternoon], 23, today);
  assert.equal(result.status, 'optimal');
  assert.equal(result.windowHours, 9);
});

// ─── Monthly Report Tests ────────────────────────────────────────────────────

test('generateMonthlyReport: generates valid report for empty state', () => {
  const emptyState: AppState = {
    profile: null,
    foodLogs: [], activities: [], measurements: [],
    waterLogs: [], sleepLogs: [], cycleLogs: [],
    selfCareLogs: [], activePlan: null, planHistory: []
  };
  const report = generateMonthlyReport(emptyState, []);
  assert.equal(report.daysTracked, 0);
  assert.equal(report.avgGlowScore, 0);
  assert.ok(report.month.length > 0);
  assert.equal(report.milestones.length, 0);
});

test('generateMonthlyReport: correctly counts tracking days', () => {
  const today = Date.now();
  const emptyState: AppState = {
    profile: null,
    foodLogs: [
      { id: '1', timestamp: today, name: 'Test', quantity: '1', calories: 300, protein: 10, sugar: 5, sodium: 100 }
    ],
    activities: [], measurements: [],
    waterLogs: [{ id: 'w1', timestamp: today, amountMl: 2500 }],
    sleepLogs: [], cycleLogs: [], selfCareLogs: [],
    activePlan: null, planHistory: []
  };
  const report = generateMonthlyReport(emptyState, []);
  assert.ok(report.daysTracked >= 1);
  assert.ok(report.waterAdherencePercent >= 0);
});
