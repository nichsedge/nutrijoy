import test from 'node:test';
import assert from 'node:assert/strict';

// Skincare Shelf & PAO
import { SKINCARE_PRESETS, calculatePaoStatus, detectIngredientConflicts } from './skincareShelf';
import { SkincareProduct } from './types';

// Skin Barrier & TEWL
import { calculateSkinBarrierScore, BARRIER_RESCUE_STEPS } from './skinBarrier';

// Cellular Hydration & Minerals
import { CELLULAR_HYDRATION_PRESETS, calculateHydrationMultiplier } from './cellularHydration';

// Period Relief Sanctuary
import { RESTORATIVE_YOGA_POSES, CRAMP_RELIEF_FOODS } from './periodRelief';

// Morning Sunlight
import { getSunlightRecommendedMinutes, getCircadianPhaseBenefits } from './circadianSunlight';

// ─── Skincare Shelf & PAO Tests ──────────────────────────────────────────────

test('SKINCARE_PRESETS: defines standard skincare items with PAO months', () => {
  assert.ok(SKINCARE_PRESETS.length >= 6);
  for (const p of SKINCARE_PRESETS) {
    assert.ok(p.name && p.category);
    assert.ok(p.paoMonths >= 1 && p.paoMonths <= 24);
    assert.ok(p.activeIngredients.length > 0);
  }
});

test('calculatePaoStatus: detects fresh vs expired product', () => {
  const now = Date.now();
  // Opened 10 days ago with 3 months PAO -> Fresh
  const freshProd: SkincareProduct = {
    id: '1',
    name: 'Fresh Vit C',
    category: 'serum',
    activeIngredients: ['vitamin_c'],
    openedDate: now - 10 * 24 * 60 * 60 * 1000,
    paoMonths: 3
  };
  const freshStatus = calculatePaoStatus(freshProd, now);
  assert.equal(freshStatus.isExpired, false);
  assert.ok(freshStatus.daysRemaining > 60);

  // Opened 120 days ago with 3 months PAO (90 days) -> Expired
  const expiredProd: SkincareProduct = {
    id: '2',
    name: 'Old Vit C',
    category: 'serum',
    activeIngredients: ['vitamin_c'],
    openedDate: now - 120 * 24 * 60 * 60 * 1000,
    paoMonths: 3
  };
  const expiredStatus = calculatePaoStatus(expiredProd, now);
  assert.equal(expiredStatus.isExpired, true);
  assert.equal(expiredStatus.daysRemaining, 0);
});

test('detectIngredientConflicts: alerts on Retinol + AHA/BHA collision', () => {
  const products: SkincareProduct[] = [
    { id: '1', name: 'Retinol Serum', category: 'serum', activeIngredients: ['retinol'], openedDate: Date.now(), paoMonths: 6 },
    { id: '2', name: 'Glycolic Toner', category: 'toner', activeIngredients: ['aha_bha'], openedDate: Date.now(), paoMonths: 12 }
  ];
  const conflicts = detectIngredientConflicts(products);
  assert.equal(conflicts.length, 1);
  assert.equal(conflicts[0].severity, 'high');
});

// ─── Skin Barrier & TEWL Tests ───────────────────────────────────────────────

test('calculateSkinBarrierScore: high score with optimal lipids and water', () => {
  const barrier = calculateSkinBarrierScore(1100, 15, 2000, true, 0);
  assert.ok(barrier.score >= 80, `Expected >= 80, got ${barrier.score}`);
  assert.equal(barrier.status, 'optimal');
});

test('calculateSkinBarrierScore: penalizes heavy AC exposure and low lipids', () => {
  const barrier = calculateSkinBarrierScore(0, 0, 800, false, 10);
  assert.ok(barrier.score < 40, `Expected < 40, got ${barrier.score}`);
  assert.ok(barrier.tewlLevel.includes('TEWL'));
});

test('BARRIER_RESCUE_STEPS: has 3 soothing recovery protocol steps', () => {
  assert.equal(BARRIER_RESCUE_STEPS.length, 3);
});

// ─── Cellular Hydration Tests ────────────────────────────────────────────────

test('CELLULAR_HYDRATION_PRESETS: all items have positive mineral and water values', () => {
  assert.ok(CELLULAR_HYDRATION_PRESETS.length >= 4);
  for (const item of CELLULAR_HYDRATION_PRESETS) {
    assert.ok(item.waterMl > 0);
    assert.ok(item.minerals.sodiumMg >= 0);
    assert.ok(item.minerals.potassiumMg >= 0);
  }
});

test('calculateHydrationMultiplier: increases effective hydration with mineral boosts', () => {
  const plain = calculateHydrationMultiplier(2000, 0);
  assert.equal(plain.multiplier, 1.0);
  assert.equal(plain.effectiveHydrationMl, 2000);

  const mineral = calculateHydrationMultiplier(2000, 2);
  assert.ok(mineral.multiplier > 1.0);
  assert.ok(mineral.effectiveHydrationMl > 2000);
});

// ─── Period Relief Sanctuary Tests ───────────────────────────────────────────

test('RESTORATIVE_YOGA_POSES: has valid restorative poses with bilingual instructions', () => {
  assert.equal(RESTORATIVE_YOGA_POSES.length, 3);
  for (const pose of RESTORATIVE_YOGA_POSES) {
    assert.ok(pose.name && pose.nameId && pose.sanskrit);
    assert.ok(pose.durationSec >= 120);
    assert.ok(pose.instructionsEn.length > 20);
    assert.ok(pose.instructionsId.length > 20);
  }
});

test('CRAMP_RELIEF_FOODS: lists magnesium & anti-inflammatory foods', () => {
  assert.ok(CRAMP_RELIEF_FOODS.length >= 3);
});

// ─── Circadian Morning Sunlight Tests ────────────────────────────────────────

test('getSunlightRecommendedMinutes: adjusts for sunny vs overcast conditions', () => {
  assert.equal(getSunlightRecommendedMinutes(false), 10);
  assert.equal(getSunlightRecommendedMinutes(true), 20);
});

test('getCircadianPhaseBenefits: returns synchronized status when complete', () => {
  const complete = getCircadianPhaseBenefits(10, 10);
  assert.ok(complete.statusEn.includes('Synchronized'));
  assert.ok(complete.statusId.includes('Tersinkronisasi'));
});
