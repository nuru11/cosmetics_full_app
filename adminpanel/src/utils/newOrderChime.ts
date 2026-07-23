/**
 * Short ascending chime for new orders (Web Audio — no asset files).
 * C major arpeggio with a bright finish, similar to POS / kitchen alerts.
 */
const CHIME_NOTES: { freq: number; at: number; duration: number; type: OscillatorType }[] = [
  { freq: 523.25, at: 0, duration: 0.1, type: "sine" }, // C5
  { freq: 659.25, at: 0.09, duration: 0.1, type: "sine" }, // E5
  { freq: 783.99, at: 0.18, duration: 0.14, type: "triangle" }, // G5
  { freq: 1046.5, at: 0.3, duration: 0.35, type: "sine" }, // C6 — bright “ta-da” finish
];

const MASTER_VOLUME = 0.22;

function playNote(
  ctx: AudioContext,
  freq: number,
  startAt: number,
  duration: number,
  type: OscillatorType
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ctx.destination);

  const t0 = startAt;
  const t1 = startAt + 0.012;
  const tEnd = startAt + duration;

  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(MASTER_VOLUME, t1);
  gain.gain.exponentialRampToValueAtTime(0.001, tEnd);

  osc.start(t0);
  osc.stop(tEnd + 0.02);
}

export function playNewOrderChime() {
  try {
    const ctx = new AudioContext();
    const start = ctx.currentTime;

    for (const note of CHIME_NOTES) {
      playNote(ctx, note.freq, start + note.at, note.duration, note.type);
    }

    const totalMs = (CHIME_NOTES[CHIME_NOTES.length - 1].at + CHIME_NOTES[CHIME_NOTES.length - 1].duration + 0.1) * 1000;
    window.setTimeout(() => void ctx.close(), totalMs);
  } catch {
    // AudioContext unavailable (e.g. blocked autoplay before user gesture)
  }
}
