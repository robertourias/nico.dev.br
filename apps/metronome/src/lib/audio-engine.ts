import type { SoundId } from "./sounds";

export function createClick(
  ctx: AudioContext,
  freq: number,
  duration: number,
  time: number,
  sound: SoundId = "click"
): void {
  try {
    if (sound === "wood") {
      createWoodClick(ctx, freq, time);
    } else if (sound === "beep") {
      createBeepClick(ctx, freq, time);
    } else {
      createSineClick(ctx, freq, duration, time);
    }
  } catch {
    // AudioContext may be closed/suspended — safe to ignore
  }
}

function createSineClick(ctx: AudioContext, freq: number, duration: number, time: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.92, time + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + duration + 0.002);
}

function createWoodClick(ctx: AudioContext, freq: number, time: number): void {
  const bufferSize = Math.ceil(ctx.sampleRate * 0.04);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  // accented (freq≥900) → 1100 Hz; normal (freq≥400) → 800 Hz; sub (freq<400) → 600 Hz
  filter.frequency.value = freq >= 900 ? 1100 : freq >= 400 ? 800 : 600;
  filter.Q.value = 8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(1.5, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(time);
  source.stop(time + 0.05);
}

function createBeepClick(ctx: AudioContext, freq: number, time: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  // accented → 1400 Hz; normal → 1000 Hz; sub → 700 Hz
  osc.frequency.value = freq >= 900 ? 1400 : freq >= 400 ? 1000 : 700;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.25, time + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.06);
}
