// Elegant Web Audio API synthesizer for victory fanfare
// Zero external files, zero network latency, guaranteed to work in modern browsers

export function playVictoryFanfare() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Victory arpeggio frequencies: C5, E5, G5, B5, C6
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.22, vol: 0.25 }, // C5
      { freq: 659.25, time: 0.16, dur: 0.22, vol: 0.28 }, // E5
      { freq: 783.99, time: 0.32, dur: 0.24, vol: 0.3 },  // G5
      { freq: 987.77, time: 0.48, dur: 0.24, vol: 0.32 }, // B5
      { freq: 1046.50, time: 0.64, dur: 0.85, vol: 0.35 }, // C6 (long sustained)
      { freq: 1318.51, time: 0.85, dur: 0.95, vol: 0.25 }, // E6 harmony
    ];

    notes.forEach(({ freq, time, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // rich, warm brass-like chime
      osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

      // Smooth attack and release envelope
      gain.gain.setValueAtTime(0.001, ctx.currentTime + time);
      gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + dur + 0.05);
    });

    // Also add a gentle golden bell overtone
    setTimeout(() => {
      try {
        const bell = ctx.createOscillator();
        const bellGain = ctx.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(2093.00, ctx.currentTime); // C7 sparkle
        bellGain.gain.setValueAtTime(0.12, ctx.currentTime);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        bell.connect(bellGain);
        bellGain.connect(ctx.destination);
        bell.start();
        bell.stop(ctx.currentTime + 1.2);
      } catch {
        // ignore
      }
    }, 650);

  } catch (err) {
    console.warn('Audio playback not supported or blocked:', err);
  }
}

export function playErrorBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // ignore
  }
}
