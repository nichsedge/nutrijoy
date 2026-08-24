import test from 'node:test';
import assert from 'node:assert/strict';
import { GLOW_RECIPES, TIMED_HYDRATION_MILESTONES } from './glowRecipes';

test('GLOW_RECIPES: contains valid nutrient profiles and benefits', () => {
  assert.ok(GLOW_RECIPES.length >= 5, 'Should have at least 5 curated glow recipes');

  for (const recipe of GLOW_RECIPES) {
    assert.ok(recipe.id, 'Recipe must have an id');
    assert.ok(recipe.name && recipe.nameId, 'Recipe must have English and Indonesian names');
    assert.ok(recipe.calories > 0, `Recipe ${recipe.name} must have positive calories`);
    assert.ok(recipe.protein > 0, `Recipe ${recipe.name} must have positive protein`);
    assert.ok(recipe.vitaminC >= 0, `Recipe ${recipe.name} must have valid vitamin C`);
    assert.ok(recipe.omega3 >= 0, `Recipe ${recipe.name} must have valid omega 3`);
    assert.ok(recipe.ingredients.length > 0, `Recipe ${recipe.name} must have ingredients`);
    assert.ok(recipe.glowBenefit.length > 10, `Recipe ${recipe.name} must have detailed glow benefit`);
  }
});

test('TIMED_HYDRATION_MILESTONES: defines 4 progressive daily milestones up to 2500ml', () => {
  assert.equal(TIMED_HYDRATION_MILESTONES.length, 4);

  const targets = TIMED_HYDRATION_MILESTONES.map((m) => m.targetMl);
  assert.deepEqual(targets, [500, 1250, 2000, 2500]);

  // Ensure hours are strictly ascending
  for (let i = 1; i < TIMED_HYDRATION_MILESTONES.length; i++) {
    assert.ok(
      TIMED_HYDRATION_MILESTONES[i].hour > TIMED_HYDRATION_MILESTONES[i - 1].hour,
      'Milestone hours should be ascending'
    );
  }
});
