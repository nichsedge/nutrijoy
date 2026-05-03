const { performance } = require('perf_hooks');

const logs = [];
const now = Date.now();
for (let i = 0; i < 10000; i++) {
  logs.push({ timestamp: now - i * 1000000 });
}

function runBaseline() {
  const start = performance.now();
  const groupedLogs = {};
  logs.forEach(log => {
    const date = new Date(log.timestamp).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groupedLogs[date]) {
      groupedLogs[date] = [];
    }
    groupedLogs[date].push(log);
  });
  const end = performance.now();
  return end - start;
}

function runOptimized() {
  const start = performance.now();
  const groupedLogs = {};
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  logs.forEach(log => {
    const date = dateFormatter.format(new Date(log.timestamp));
    if (!groupedLogs[date]) {
      groupedLogs[date] = [];
    }
    groupedLogs[date].push(log);
  });
  const end = performance.now();
  return end - start;
}

// Warmup
for (let i = 0; i < 5; i++) {
  runBaseline();
  runOptimized();
}

let baselineTotal = 0;
let optimizedTotal = 0;
const iterations = 10;

for (let i = 0; i < iterations; i++) {
  baselineTotal += runBaseline();
  optimizedTotal += runOptimized();
}

console.log(`Baseline average: ${(baselineTotal / iterations).toFixed(2)} ms`);
console.log(`Optimized average: ${(optimizedTotal / iterations).toFixed(2)} ms`);
console.log(`Speedup: ${(baselineTotal / optimizedTotal).toFixed(2)}x`);
