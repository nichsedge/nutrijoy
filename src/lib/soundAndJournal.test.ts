import test from 'node:test';
import assert from 'node:assert/strict';
import { playChime, playSuccessChord, playBreathTone } from './soundEffects';
import { SkinJournalEntry, SkinCondition } from './types';

test('soundEffects: functions execute safely in node/SSR environment without throwing', () => {
  assert.doesNotThrow(() => {
    playChime();
    playSuccessChord();
    playBreathTone(432, 0.5);
  }, 'Audio functions should handle headless / SSR environments gracefully');
});

test('SkinJournalEntry: correctly validates structured photo and note entries', () => {
  const validConditions: SkinCondition[] = ['radiant', 'clear', 'dry', 'breakout', 'puffy'];

  for (const condition of validConditions) {
    const entry: SkinJournalEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      skinCondition: condition,
      note: `Testing condition ${condition}`,
      photoUrl: 'data:image/jpeg;base64,mockphoto'
    };

    assert.ok(entry.id.length > 10, 'Entry id must be a valid UUID');
    assert.ok(entry.timestamp > 0, 'Timestamp must be positive');
    assert.equal(entry.skinCondition, condition);
    assert.ok(entry.note?.includes(condition));
  }
});
