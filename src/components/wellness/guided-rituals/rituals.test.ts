import { test } from 'node:test';
import assert from 'node:assert';
import {
  RitualType,
  getRitualSteps,
  isStepRoutine,
  getTotalCycles,
  getModalTitle,
  getModalDesc,
  getCompletionMessage,
} from '@/components/wellness/guided-rituals/rituals';

const STEP_ROUTINE_TYPES: RitualType[] = ['depuff', 'posture', 'cryo', 'drybrush', 'eye_refresh', 'guasha'];
const BREATHWORK_TYPES: RitualType[] = ['breathwork', 'digest'];
const ALL_TYPES: RitualType[] = [...STEP_ROUTINE_TYPES, ...BREATHWORK_TYPES];

test('step routines have valid steps in both languages', () => {
  for (const type of STEP_ROUTINE_TYPES) {
    for (const isId of [false, true]) {
      const steps = getRitualSteps(type, isId);
      assert.ok(steps.length >= 3, `${type} (isId=${isId}) should have at least 3 steps`);
      for (const step of steps) {
        assert.ok(step.title.length > 0, `${type} step title must be non-empty`);
        assert.ok(step.desc.length > 20, `${type} step desc must be meaningful`);
        assert.ok(step.duration > 0 && step.duration <= 60, `${type} step duration must be 1–60s`);
        assert.ok(step.icon.length > 0, `${type} step must have an icon`);
      }
    }
  }
});

test('each language yields distinct copy for the same ritual', () => {
  for (const type of STEP_ROUTINE_TYPES) {
    const en = getRitualSteps(type, false);
    const id = getRitualSteps(type, true);
    assert.notStrictEqual(en[0].title, id[0].title, `${type} titles should differ between locales`);
    // Structure must match across locales
    assert.strictEqual(en.length, id.length);
    assert.deepStrictEqual(
      en.map((s) => s.duration),
      id.map((s) => s.duration)
    );
  }
});

test('isStepRoutine classifies types correctly', () => {
  for (const type of STEP_ROUTINE_TYPES) {
    assert.strictEqual(isStepRoutine(type), true, `${type} should be a step routine`);
  }
  for (const type of BREATHWORK_TYPES) {
    assert.strictEqual(isStepRoutine(type), false, `${type} should not be a step routine`);
  }
});

test('getTotalCycles: digest uses 2 cycles, breathwork uses 4', () => {
  assert.strictEqual(getTotalCycles('digest'), 2);
  assert.strictEqual(getTotalCycles('breathwork'), 4);
});

test('modal title, desc, and completion message are non-empty in both languages', () => {
  for (const type of ALL_TYPES) {
    for (const isId of [false, true]) {
      assert.ok(getModalTitle(type, isId).length > 5);
      assert.ok(getModalDesc(type, isId).length > 20);
      assert.ok(getCompletionMessage(type, isId).length > 20);
    }
  }
});

test('completion messages differ between locales', () => {
  for (const type of ALL_TYPES) {
    assert.notStrictEqual(
      getCompletionMessage(type, false),
      getCompletionMessage(type, true),
      `${type} completion message should differ between locales`
    );
  }
});
