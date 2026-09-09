// =========================================================================
// Native Web Audio API Sound Synthesizer — Zero External Dependencies
// Synthesizes realistic UI sound effects directly inside the browser using
// native oscillators. No heavy audio files (MP3/WAV) required!
// =========================================================================
let audioCtx = null;
let soundEnabled = true;
let userInteracted = false;

// Browsers block AudioContext until the first user gesture (click or keypress).
// This listener "arms" the audio system on first interaction without triggering autoplay errors.
if (typeof window !== "undefined") {
  const armAudio = () => {
    userInteracted = true;
    window.removeEventListener("pointerdown", armAudio);
    window.removeEventListener("keydown", armAudio);
  };
  window.addEventListener("pointerdown", armAudio, { once: true });
  window.addEventListener("keydown", armAudio, { once: true });
}

// Safely retrieve or resume the AudioContext
const getAudioContext = () => {
  if (typeof window === "undefined" || !userInteracted) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

// Enable or mute sound effects (persisted in localStorage)
export const setSoundEnabled = (enabled) => {
  soundEnabled = enabled;
  if (typeof window !== "undefined") {
    localStorage.setItem("arte_sound_enabled", JSON.stringify(enabled));
  }
};

export const getSoundEnabled = () => {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("arte_sound_enabled");
  return stored !== null ? JSON.parse(stored) : true;
};

// =========================================================================
// SOUND EFFECT 1: Subtle Mechanical Click
// Used for: button presses, tab switches, and dial clicks.
// Synthesis: Sine wave quickly sliding down from 800Hz to 200Hz in 40ms.
// =========================================================================
export const playClick = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (_) {
    // Graceful ignore if audio policy blocks autoplay
  }
};

// =========================================================================
// SOUND EFFECT 2: Archival Transition Whoosh
// Used for: page transitions when opening new routes.
// Synthesis: Triangle wave swelling from 140Hz up to 320Hz in 220ms.
// =========================================================================
export const playTransition = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch (_) {
    // Graceful ignore if audio policy blocks autoplay
  }
};

// =========================================================================
// SOUND EFFECT 3: Harmonic Brass Chime
// Used for: favoriting a masterpiece or saving a form successfully.
// Synthesis: 3-note major chord arpeggio (C5 = 523Hz, E5 = 659Hz, G5 = 784Hz)
// with a shimmering exponential volume decay.
// =========================================================================
export const playChime = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major chord
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.025, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + idx * 0.05 + 0.35);
    });
  } catch (_) {
    // Graceful ignore if audio policy blocks autoplay
  }
};
