// audio.js — tiny WebAudio synth blips for KOPITIAM RUSH. No audio files:
// every sound is a short oscillator envelope, so the game ships zero
// assets and loads nothing over the network.

let audioCtx = null;
let muted = false;

export function ensureAudio() {
  if (!audioCtx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    } catch (e) {
      audioCtx = null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

export function isMuted() {
  return muted;
}

function blip(freq, duration, type, gainValue, slideTo) {
  if (muted) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + duration);
  gain.gain.setValueAtTime(gainValue || 0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playAddIngredient() { blip(520, 0.09, 'triangle', 0.07, 700); }
export function playWrongIngredient() { blip(180, 0.18, 'sawtooth', 0.05, 120); }
export function playServeDish() { blip(660, 0.12, 'sine', 0.09, 990); blip(880, 0.16, 'sine', 0.07, 1320); }
export function playCustomerWalkout() { blip(220, 0.3, 'square', 0.04, 110); }
export function playNightClear() { blip(523, 0.12, 'sine', 0.08); setTimeout(() => blip(659, 0.12, 'sine', 0.08), 110); setTimeout(() => blip(784, 0.22, 'sine', 0.09), 220); }
export function playBossAlarm() { blip(440, 0.14, 'square', 0.05, 440); setTimeout(() => blip(440, 0.14, 'square', 0.05, 440), 180); }
