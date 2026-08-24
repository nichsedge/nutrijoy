let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Play a soothing, crystal harmonic chime for water logs or checklist items
 */
export function playChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [659.25, 880]; // E5, A5

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.08, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.5);
    });
  } catch {
    // Graceful fallback if audio is disabled
  }
}

/**
 * Play a warm, uplifting major chord for 100% rituals or partner cheers
 */
export function playSuccessChord() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // C5, E5, G5, B5 (Major 7th sparkle)
    const chord = [523.25, 659.25, 783.99, 987.77];

    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);

      gain.gain.setValueAtTime(0.06, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.9);
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Play a gentle 432Hz ambient tone for breathwork transitions
 */
export function playBreathTone(frequency: number = 432, duration: number = 0.6) {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play a resonant, warm meditation singing bowl / tea gong
 */
export function playGong() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    // Harmonic frequencies of a singing bowl
    const freqs = [261.63, 523.25, 784.88, 1046.5];
    const gains = [0.15, 0.08, 0.04, 0.02];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gains[idx], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    });
  } catch {
    // Graceful fallback
  }
}

// Active Solfeggio tone references
let activeOsc: OscillatorNode | null = null;
let activeSubOsc: OscillatorNode | null = null;
let activeGain: GainNode | null = null;

/**
 * Starts continuous solfeggio healing frequency tone with soft harmonic ambient layer
 */
export function startSolfeggioTone(frequency: number = 528, volume: number = 0.08) {
  stopSolfeggioTone(); // stop any active tone first

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    activeGain = ctx.createGain();
    activeGain.gain.setValueAtTime(0.0001, now);
    activeGain.gain.linearRampToValueAtTime(volume, now + 1.2); // Smooth 1.2s fade-in

    // Fundamental frequency
    activeOsc = ctx.createOscillator();
    activeOsc.type = 'sine';
    activeOsc.frequency.setValueAtTime(frequency, now);

    // Soft sub-octave harmonic (1 octave down) for depth & warmth
    activeSubOsc = ctx.createOscillator();
    activeSubOsc.type = 'sine';
    activeSubOsc.frequency.setValueAtTime(frequency / 2, now);

    activeOsc.connect(activeGain);
    activeSubOsc.connect(activeGain);
    activeGain.connect(ctx.destination);

    activeOsc.start(now);
    activeSubOsc.start(now);
  } catch {
    // Graceful fallback
  }
}

/**
 * Smoothly stops continuous solfeggio tone with gentle fade-out
 */
export function stopSolfeggioTone() {
  if (!activeGain || !activeOsc) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    activeGain.gain.setValueAtTime(activeGain.gain.value, now);
    activeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8); // Smooth 0.8s fade-out

    setTimeout(() => {
      try {
        activeOsc?.stop();
        activeSubOsc?.stop();
        activeOsc?.disconnect();
        activeSubOsc?.disconnect();
        activeGain?.disconnect();
      } catch {
        // ignore
      }
      activeOsc = null;
      activeSubOsc = null;
      activeGain = null;
    }, 850);
  } catch {
    activeOsc = null;
    activeSubOsc = null;
    activeGain = null;
  }
}
