import { test } from 'node:test';
import assert from 'node:assert';
import { AppStateSchema, importData } from './storage';

test('AppStateSchema validates correct state', () => {
  const validState = {
    profile: {
      name: "Test User",
      age: 30,
      sex: "male",
      height: 180,
      weight: 80,
      activityLevel: "moderate",
      goal: "maintain",
      language: "en"
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
    foodLogs: "This should be an array", // Invalid type
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

test('AppStateSchema rejects state missing required fields in nested objects', () => {
    const invalidState = {
      profile: {
        name: "Test User",
        // missing age, sex, etc.
        language: "en"
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

test('importData rejects invalid JSON structure (e.g. from malicious input)', async () => {
    // Mocking File object to pass to importData
    const invalidJsonString = '{"profile": {"name": "Test", "age": "thirty", "sex": "male", "height": 180, "weight": 80, "activityLevel": "moderate", "goal": "maintain", "language": "en"}, "foodLogs": [], "activities": [], "measurements": [], "waterLogs": [], "sleepLogs": [], "cycleLogs": [], "selfCareLogs": [], "activePlan": null, "planHistory": []}';

    // Create a mock File and FileReader environment
    const mockFile = {} as File;

    // Temporarily replace global FileReader for testing
    const originalFileReader = global.FileReader;

    class MockFileReader {
      onload: ((event: any) => void) | null = null;
      onerror: ((event: any) => void) | null = null;

      readAsText() {
        if (this.onload) {
          // Simulate successful read but with invalid data type for 'age'
          this.onload({ target: { result: invalidJsonString } });
        }
      }
    }

    (global as any).FileReader = MockFileReader;

    try {
        await assert.rejects(
            importData(mockFile),
            /Expected number, received string/
        );
    } finally {
        // Restore original FileReader
        global.FileReader = originalFileReader;
    }
});
