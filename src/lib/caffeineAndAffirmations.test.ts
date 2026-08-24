import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRemainingCaffeine, getCaffeineCutoffHour, getSleepImpact, CAFFEINE_PRESETS } from './caffeine';
import { getDailyAffirmation, AFFIRMATIONS } from './affirmations';
import { CaffeineLogEntry } from './types';

test('CAFFEINE_PRESETS: contains standard beverages with accurate mg amounts', () => {
  assert.ok(CAFFEINE_PRESETS.length >= 5, 'Should have at least 5 preset beverages');
  for (const preset of CAFFEINE_PRESETS) {
    assert.ok(preset.name && preset.nameId);
    assert.ok(preset.caffeineMg > 0);
  }
});

test('calculateRemainingCaffeine: computes 5-hour half-life clearance curve', () => {
  const baseTime = 1000000000000;
  const mockLogs: CaffeineLogEntry[] = [{ id: '1', timestamp: baseTime, name: 'Espresso', caffeineMg: 100 }];

  // At t = 0 hours
  const activeAt0 = calculateRemainingCaffeine(mockLogs, baseTime);
  assert.equal(activeAt0, 100);

  // At t = 5 hours (1 half-life -> 50mg)
  const activeAt5h = calculateRemainingCaffeine(mockLogs, baseTime + 5 * 3600 * 1000);
  assert.equal(activeAt5h, 50);

  // At t = 10 hours (2 half-lives -> 25mg)
  const activeAt10h = calculateRemainingCaffeine(mockLogs, baseTime + 10 * 3600 * 1000);
  assert.equal(activeAt10h, 25);
});

test('getCaffeineCutoffHour: computes 10-hour clearance cutoff before bedtime', () => {
  const cutoff = getCaffeineCutoffHour(23); // 11 PM
  assert.equal(cutoff.cutoffHour, 13); // 1 PM (13:00)
  assert.equal(cutoff.cutoffTimeStr, '1:00 PM');
});

test('getSleepImpact: categorizes bedtime caffeine levels correctly', () => {
  const optimal = getSleepImpact(10);
  assert.equal(optimal.level, 'optimal');

  const moderate = getSleepImpact(35);
  assert.equal(moderate.level, 'moderate');

  const high = getSleepImpact(80);
  assert.equal(high.level, 'high');
});

test('getDailyAffirmation: returns phase-tailored and general affirmations in EN and ID', () => {
  const menstrualAffirmation = getDailyAffirmation('menstrual', 1);
  assert.equal(menstrualAffirmation.phase, 'menstrual');
  assert.ok(menstrualAffirmation.textEn.length > 10);
  assert.ok(menstrualAffirmation.textId.length > 10);

  const follicularAffirmation = getDailyAffirmation('follicular', 1);
  assert.equal(follicularAffirmation.phase, 'follicular');

  const generalAffirmation = getDailyAffirmation(undefined, 2);
  assert.ok(generalAffirmation.textEn.length > 10);
});
