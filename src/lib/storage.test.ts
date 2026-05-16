import { test } from 'node:test';
import assert from 'node:assert';
import { AppStateSchema, importData, sanitizeState } from './storage';

test('AppStateSchema validates correct state', () => {
  const validState = {
    profile: {
      name: 'Test User',
      age: 30,
      sex: 'male',
      height: 180,
      weight: 80,
      activityLevel: 'moderate',
      goal: 'maintain',
      language: 'en'
    },
    foodLogs: [],
    activities: [],
    measurements: [],
    waterLogs: [],
    sleepLogs: [],
    cycleLogs: [],
    selfCareLogs: [],
    activePlan: null,
    planHistory: []
  };

  assert.doesNotThrow(() => {
    AppStateSchema.parse(validState);
  });
});

test('AppStateSchema rejects state with invalid types', () => {
  const invalidState = {
    profile: null,
    foodLogs: 'This should be an array',
    activities: [],
    measurements: [],
    waterLogs: [],
    sleepLogs: [],
    cycleLogs: [],
    selfCareLogs: [],
    activePlan: null,
    planHistory: []
  };

  assert.throws(() => {
    AppStateSchema.parse(invalidState);
  }, /Expected array, received string/);
});

test('sanitizeState migrates legacy targetLossKg into targetChangeKg', () => {
  const sanitized = sanitizeState({
    profile: null,
    foodLogs: [],
    activities: [],
    measurements: [],
    waterLogs: [],
    sleepLogs: [],
    cycleLogs: [],
    selfCareLogs: [],
    activePlan: {
      id: 'plan-1',
      dailyTarget: 1900,
      dailyDeficit: 400,
      bmr: 1500,
      tdee: 2300,
      status: 'safe',
      targetLossKg: 5,
      durationWeeks: 10,
      startWeight: 80,
      goal: 'lose'
    },
    planHistory: [
      {
        id: 'plan-0',
        dailyTarget: 1900,
        dailyDeficit: 400,
        bmr: 1500,
        tdee: 2300,
        status: 'safe',
        targetLossKg: 3,
        durationWeeks: 8,
        startWeight: 78,
        goal: 'lose',
        achievedDate: Date.now(),
        endWeight: 75
      }
    ]
  });

  assert.equal(sanitized.activePlan?.targetChangeKg, 5);
  assert.equal(sanitized.planHistory[0]?.targetChangeKg, 3);
});

test('AppStateSchema rejects state missing required fields in nested objects', () => {
  const invalidState = {
    profile: {
      name: 'Test User',
      language: 'en'
    },
    foodLogs: [],
    activities: [],
    measurements: [],
    waterLogs: [],
    sleepLogs: [],
    cycleLogs: [],
    selfCareLogs: [],
    activePlan: null,
    planHistory: []
  };

  assert.throws(() => {
    AppStateSchema.parse(invalidState);
  });
});

class MockFileReader {
  public onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
  public onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;
  private readonly content: string;

  constructor(content: string) {
    this.content = content;
  }

  readAsText() {
    if (this.onload) {
      const event = {
        target: { result: this.content }
      } as unknown as ProgressEvent<FileReader>;
      this.onload(event);
    }
  }
}

test('importData rejects invalid JSON structure (malformed value types)', async () => {
  const invalidJsonString = '{"profile":{"name":"Test","age":"thirty","sex":"male","height":180,"weight":80,"activityLevel":"moderate","goal":"maintain","language":"en"},"foodLogs":[],"activities":[],"measurements":[],"waterLogs":[],"sleepLogs":[],"cycleLogs":[],"selfCareLogs":[],"activePlan":null,"planHistory":[]}';
  const mockFile = {} as File;
  const originalFileReader = global.FileReader;

  global.FileReader = class extends MockFileReader {
    constructor() {
      super(invalidJsonString);
    }
  } as unknown as typeof FileReader;

  try {
    await assert.rejects(
      importData(mockFile),
      /Expected number, received string/
    );
  } finally {
    global.FileReader = originalFileReader;
  }
});

test('importData rejects malformed JSON text', async () => {
  const malformed = '{"profile":';
  const mockFile = {} as File;
  const originalFileReader = global.FileReader;

  global.FileReader = class extends MockFileReader {
    constructor() {
      super(malformed);
    }
  } as unknown as typeof FileReader;

  try {
    await assert.rejects(importData(mockFile));
  } finally {
    global.FileReader = originalFileReader;
  }
});
