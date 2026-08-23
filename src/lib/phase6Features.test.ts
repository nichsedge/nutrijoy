import test from 'node:test';
import assert from 'node:assert/strict';

// Botanical Beauty Teas
import { BEAUTY_TEAS, getRecommendedTea } from './beautyTeas';

// Glucose Sequencing Coach
import { GLUCOSE_SEQUENCING_STEPS, getGlucoseSequenceScore } from './glucoseCoach';

// Soundscapes & Gong
import { playGong, startSolfeggioTone, stopSolfeggioTone } from './soundEffects';

// ─── Botanical Beauty Teas Tests ─────────────────────────────────────────────

test('BEAUTY_TEAS: contains 5 unique, well-formed botanical tea formulations', () => {
  assert.equal(BEAUTY_TEAS.length, 5);
  for (const tea of BEAUTY_TEAS) {
    assert.ok(tea.id);
    assert.ok(tea.name && tea.nameId);
    assert.ok(tea.tagline && tea.taglineId);
    assert.ok(tea.steepMinutes >= 3 && tea.steepMinutes <= 7);
    assert.ok(tea.ingredients.length >= 3);
    assert.ok(tea.ingredientsId.length >= 3);
    assert.ok(tea.beautyBenefits.length > 20);
    assert.ok(tea.beautyBenefitsId.length > 20);
    assert.ok(tea.antioxidantMg > 0);
  }
});

test('getRecommendedTea: matches hormonal breakout / luteal phase with Spearmint tea', () => {
  const breakoutTea = getRecommendedTea('luteal', 'breakout');
  assert.equal(breakoutTea.id, 'spearmint_lemon');
  assert.ok(breakoutTea.name.includes('Spearmint'));
});

test('getRecommendedTea: matches radiant / ovulatory phase with Hibiscus Ruby Elixir', () => {
  const ovulatoryTea = getRecommendedTea('ovulatory', 'radiant');
  assert.equal(ovulatoryTea.id, 'hibiscus_rosehip');
});

test('getRecommendedTea: matches puffy skin with Golden Ginger De-Puff tea', () => {
  const puffyTea = getRecommendedTea(undefined, 'puffy');
  assert.equal(puffyTea.id, 'ginger_fennel');
});

// ─── Glucose Sequencing Tests ────────────────────────────────────────────────

test('GLUCOSE_SEQUENCING_STEPS: defines 3 standard food sequencing steps', () => {
  assert.equal(GLUCOSE_SEQUENCING_STEPS.length, 3);
  assert.equal(GLUCOSE_SEQUENCING_STEPS[0].step, 1);
  assert.equal(GLUCOSE_SEQUENCING_STEPS[1].step, 2);
  assert.equal(GLUCOSE_SEQUENCING_STEPS[2].step, 3);
});

test('getGlucoseSequenceScore: computes scores based on completed sequencing steps', () => {
  // All 3 completed
  const master = getGlucoseSequenceScore({ veggiesFirst: true, proteinSecond: true, carbsLast: true });
  assert.equal(master.score, 100);
  assert.ok(master.label.includes('Anti-Glycation Master'));

  // 2 completed
  const partial = getGlucoseSequenceScore({ veggiesFirst: true, proteinSecond: true, carbsLast: false });
  assert.equal(partial.score, 66);

  // 1 completed
  const single = getGlucoseSequenceScore({ veggiesFirst: true, proteinSecond: false, carbsLast: false });
  assert.equal(single.score, 33);

  // None completed
  const none = getGlucoseSequenceScore({ veggiesFirst: false, proteinSecond: false, carbsLast: false });
  assert.equal(none.score, 0);
});

// ─── Solfeggio Soundscapes & Gong Tests ──────────────────────────────────────

test('soundEffects: playGong, startSolfeggioTone, and stopSolfeggioTone run safely in Node/SSR', () => {
  assert.doesNotThrow(() => {
    playGong();
    startSolfeggioTone(432, 0.05);
    startSolfeggioTone(528, 0.05);
    stopSolfeggioTone();
  });
});
