/**
 * soundEngine.js — Self-contained Web Audio sound engine
 *
 * Zero dependencies. Works in React, Framer, Webflow, or plain JS.
 *
 * Framer usage:
 *   1. Add this file to your Framer project assets / code folder
 *   2. In your code component:
 *      import { playSound, releaseSound } from "./soundEngine"
 *      <button onMouseDown={() => playSound("snap")} onMouseUp={() => releaseSound("snap")} />
 *
 * Export sounds as WAV:
 *   import { downloadSound, downloadAllSounds } from "./soundEngine"
 *   await downloadSound("snap")       // downloads snap.wav
 *   await downloadAllSounds()         // downloads all sounds
 */

// ── Audio context ─────────────────────────────────────────────────────────────
let _liveCtx = null;

export function getLiveCtx() {
  if (!_liveCtx) _liveCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (_liveCtx.state === "suspended") _liveCtx.resume();
  return _liveCtx;
}

// ── Low-level helpers ─────────────────────────────────────────────────────────
function noiseBuf(ctx, sec, decay = 2) {
  const len = Math.ceil(ctx.sampleRate * sec);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  return buf;
}

function chain(ctx, src, ...nodes) {
  let n = src;
  for (const next of nodes) { n.connect(next); n = next; }
  n.connect(ctx.destination);
  src.start?.(ctx.currentTime);
}

function osc(ctx, { type = "sine", freq, freqEnd, gain, gainEnd, dur, startAt = 0 }) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
  if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + startAt + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, ctx.currentTime + startAt);
  g.gain.exponentialRampToValueAtTime(gainEnd ?? 0.001, ctx.currentTime + startAt + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(ctx.currentTime + startAt); o.stop(ctx.currentTime + startAt + dur + 0.02);
}

// ── Original sounds ───────────────────────────────────────────────────────────

function _soft(ctx) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.05, 3);
  const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 900; f.Q.value = 0.8;
  const g = ctx.createGain(); g.gain.value = 0.22;
  chain(ctx, src, f, g);
}

function _snap(ctx) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.02, 6);
  const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2400; f.Q.value = 0.4;
  const g = ctx.createGain(); g.gain.value = 0.45;
  chain(ctx, src, f, g);
}

function _thud(ctx) {
  osc(ctx, { type: "sine", freq: 160, freqEnd: 35, gain: 0.9, dur: 0.2 });
}

function _pop(ctx) {
  osc(ctx, { type: "sine", freq: 380, freqEnd: 90, gain: 0.7, dur: 0.1 });
}

function _chime(ctx) {
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq;
    const g = ctx.createGain(); const t = ctx.currentTime + i * 0.055;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.14, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.62);
  });
}

function _retro(ctx) {
  osc(ctx, { type: "square", freq: 880, gain: 0.09, gainEnd: 0.001, dur: 0.07 });
}

function _glitch(ctx) {
  const o = ctx.createOscillator(); o.type = "sawtooth";
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.07, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  [180, 920, 140, 1300, 260, 700, 80, 1100].forEach((f, i) =>
    o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.024));
  o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.22);
}

function _coin(ctx) {
  [[988, 0], [1319, 0.09]].forEach(([freq, startAt]) =>
    osc(ctx, { type: "square", freq, gain: 0.07, dur: 0.28, startAt }));
}

// ── 10 new sounds ─────────────────────────────────────────────────────────────

/** Retro laser gun — descending sawtooth sweep */
function _zap(ctx) {
  osc(ctx, { type: "sawtooth", freq: 1800, freqEnd: 80, gain: 0.12, dur: 0.25 });
}

/** 8-bit ascending pitch — bouncy video game jump */
function _jump(ctx) {
  osc(ctx, { type: "square", freq: 200, freqEnd: 800, gain: 0.08, dur: 0.14 });
}

/** Detuned dual sawtooth ascending — portal / teleport warp */
function _warp(ctx) {
  [0, 12].forEach(detune => {
    const o = ctx.createOscillator(); o.type = "sawtooth"; o.detune.value = detune;
    o.frequency.setValueAtTime(200, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.35);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.38);
  });
}

/** Ascending C-major arpeggio — level-up fanfare */
function _powerUp(ctx) {
  [261.63, 329.63, 392, 523.25].forEach((freq, i) =>
    osc(ctx, { type: "square", freq, gain: 0.07, dur: 0.2, startAt: i * 0.08 }));
}

/** High-Q bandpass on noise burst — plucked string */
function _pluck(ctx) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.01, 1);
  const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 330; f.Q.value = 40;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.5, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
  chain(ctx, src, f, g);
}

/** Low-freq thump + click transient — hollow wood knock */
function _knock(ctx) {
  osc(ctx, { type: "sine", freq: 130, freqEnd: 55, gain: 0.85, dur: 0.09 });
  // Transient click on top
  const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.008, 4);
  const g = ctx.createGain(); g.gain.value = 0.25;
  chain(ctx, src, g);
}

/** Two-phase mechanical noise burst — DSLR shutter */
function _shutter(ctx) {
  [0, 0.06].forEach((delay, i) => {
    const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.012, i === 0 ? 5 : 8);
    const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 1800;
    const g = ctx.createGain(); g.gain.value = i === 0 ? 0.38 : 0.18;
    src.connect(f); f.connect(g); g.connect(ctx.destination);
    src.start(ctx.currentTime + delay);
  });
}

/** Pure sine + inharmonic overtone, long tail — struck wine glass */
function _ping(ctx) {
  const dur = 1.6;
  [[2093, 0.2, dur], [2093 * 2.756, 0.055, dur * 0.6]].forEach(([freq, gain, d]) =>
    osc(ctx, { type: "sine", freq, gain, gainEnd: 0.001, dur: d }));
}

/** Band-swept noise with bell-curve amplitude — fast air whoosh */
function _whoosh(ctx) {
  const dur = 0.22;
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / d.length);
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 0.5;
  f.frequency.setValueAtTime(150, ctx.currentTime);
  f.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + dur);
  const g = ctx.createGain(); g.gain.value = 0.32;
  chain(ctx, src, f, g);
}

/** FM buzz that warbles up — alien / robot communication */
function _alien(ctx) {
  const carrier = ctx.createOscillator(); carrier.type = "sine";
  carrier.frequency.setValueAtTime(300, ctx.currentTime);
  carrier.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.18);
  const modulator = ctx.createOscillator(); modulator.type = "sine"; modulator.frequency.value = 40;
  const modGain = ctx.createGain(); modGain.gain.value = 180;
  modulator.connect(modGain); modGain.connect(carrier.frequency);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.09, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
  carrier.connect(g); g.connect(ctx.destination);
  carrier.start(); carrier.stop(ctx.currentTime + 0.24);
  modulator.start(); modulator.stop(ctx.currentTime + 0.24);
}

// ── Charge — interactive: builds while held, releases on mouse-up ─────────────
let _chargeOsc = null; let _chargeGainNode = null;

function _chargeStart(ctx) {
  const isOffline = typeof OfflineAudioContext !== "undefined" && ctx instanceof OfflineAudioContext;
  if (!isOffline && _chargeOsc) { try { _chargeOsc.stop(); } catch {} _chargeOsc = null; }

  const o = ctx.createOscillator(); o.type = "sawtooth";
  o.frequency.setValueAtTime(80, ctx.currentTime);
  o.frequency.linearRampToValueAtTime(900, ctx.currentTime + 3);

  // LFO adds wobble that speeds up as it charges
  const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 10;
  const lfoG = ctx.createGain(); lfoG.gain.value = 25;
  lfo.connect(lfoG); lfoG.connect(o.frequency);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0, ctx.currentTime);
  g.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.12);
  o.connect(g); g.connect(ctx.destination);
  o.start(); lfo.start();

  if (!isOffline) { _chargeOsc = o; _chargeGainNode = g; }
}

function _chargeEnd() {
  const ctx = getLiveCtx();
  if (_chargeGainNode) {
    _chargeGainNode.gain.setValueAtTime(0.09, ctx.currentTime);
    _chargeGainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  }
  if (_chargeOsc) { try { _chargeOsc.stop(ctx.currentTime + 0.12); } catch {} _chargeOsc = null; }
  // Discharge burst: descending sawtooth through lowpass
  const o = ctx.createOscillator(); o.type = "sawtooth";
  o.frequency.setValueAtTime(1200, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2);
  const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 2000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.18, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
  o.connect(f); f.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.22);
}

// ── SOUNDS map ────────────────────────────────────────────────────────────────
// duration: how long to render when exporting to WAV
export const SOUNDS = {
  none:    { label: "None",     desc: "Silent",                duration: 0.1,  play: () => {},                        release: null },
  soft:    { label: "Soft",     desc: "Muted felt click",      duration: 0.5,  play: () => _soft(getLiveCtx()),       release: null },
  snap:    { label: "Snap",     desc: "Crisp mechanical",      duration: 0.3,  play: () => _snap(getLiveCtx()),       release: null },
  thud:    { label: "Thud",     desc: "Heavy impact",          duration: 0.5,  play: () => _thud(getLiveCtx()),       release: null },
  pop:     { label: "Pop",      desc: "Bubble burst",          duration: 0.3,  play: () => _pop(getLiveCtx()),        release: null },
  chime:   { label: "Chime",    desc: "Bright arpeggio",       duration: 1.0,  play: () => _chime(getLiveCtx()),      release: null },
  retro:   { label: "Retro",    desc: "8-bit square beep",     duration: 0.3,  play: () => _retro(getLiveCtx()),      release: null },
  glitch:  { label: "Glitch",   desc: "Digital artifact",      duration: 0.4,  play: () => _glitch(getLiveCtx()),     release: null },
  coin:    { label: "Coin",     desc: "Pickup jingle",         duration: 0.6,  play: () => _coin(getLiveCtx()),       release: null },
  // ── New ──
  zap:     { label: "Zap",      desc: "Retro laser",           duration: 0.4,  play: () => _zap(getLiveCtx()),        release: null },
  jump:    { label: "Jump",     desc: "8-bit ascending",       duration: 0.3,  play: () => _jump(getLiveCtx()),       release: null },
  warp:    { label: "Warp",     desc: "Teleport sweep",        duration: 0.55, play: () => _warp(getLiveCtx()),       release: null },
  powerUp: { label: "Power Up", desc: "Level-up fanfare",      duration: 0.75, play: () => _powerUp(getLiveCtx()),    release: null },
  pluck:   { label: "Pluck",    desc: "Guitar string",         duration: 1.0,  play: () => _pluck(getLiveCtx()),      release: null },
  knock:   { label: "Knock",    desc: "Wooden knock",          duration: 0.4,  play: () => _knock(getLiveCtx()),      release: null },
  shutter: { label: "Shutter",  desc: "Camera click",          duration: 0.25, play: () => _shutter(getLiveCtx()),    release: null },
  ping:    { label: "Ping",     desc: "Glass resonance",       duration: 2.0,  play: () => _ping(getLiveCtx()),       release: null },
  whoosh:  { label: "Whoosh",   desc: "Air rush",              duration: 0.4,  play: () => _whoosh(getLiveCtx()),     release: null },
  alien:   { label: "Alien",    desc: "FM robot signal",       duration: 0.4,  play: () => _alien(getLiveCtx()),      release: null },
  charge:  { label: "Charge",   desc: "Builds while held",     duration: 1.5,  play: () => _chargeStart(getLiveCtx()), release: _chargeEnd },
};

// Render functions that accept a context (for WAV export)
const RENDER_FNS = {
  soft: _soft, snap: _snap, thud: _thud, pop: _pop, chime: _chime,
  retro: _retro, glitch: _glitch, coin: _coin,
  zap: _zap, jump: _jump, warp: _warp, powerUp: _powerUp,
  pluck: _pluck, knock: _knock, shutter: _shutter, ping: _ping,
  whoosh: _whoosh, alien: _alien,
  charge: _chargeStart, // renders a partial charge build
};

// ── Public API ────────────────────────────────────────────────────────────────
export function playSound(name)    { SOUNDS[name]?.play(); }
export function releaseSound(name) { SOUNDS[name]?.release?.(); }

// ── WAV export ────────────────────────────────────────────────────────────────
function bufferToWav(buffer) {
  const ch = buffer.numberOfChannels;
  const len = buffer.length * ch * 2;
  const out = new ArrayBuffer(44 + len);
  const v = new DataView(out);
  const str = (off, s) => [...s].forEach((c, i) => v.setUint8(off + i, c.charCodeAt(0)));
  str(0, "RIFF"); v.setUint32(4, 36 + len, true);
  str(8, "WAVE"); str(12, "fmt "); v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); v.setUint16(22, ch, true);
  v.setUint32(24, buffer.sampleRate, true);
  v.setUint32(28, buffer.sampleRate * ch * 2, true);
  v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true);
  str(36, "data"); v.setUint32(40, len, true);
  let off = 44;
  for (let i = 0; i < buffer.length; i++)
    for (let c = 0; c < ch; c++) {
      const s = Math.max(-1, Math.min(1, buffer.getChannelData(c)[i]));
      v.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7FFF, true); off += 2;
    }
  return new Blob([out], { type: "audio/wav" });
}

export async function renderToWav(name) {
  const s = SOUNDS[name];
  if (!s || name === "none") return null;
  const dur = s.duration + 0.15;
  const offCtx = new OfflineAudioContext(1, Math.ceil(44100 * dur), 44100);
  RENDER_FNS[name]?.(offCtx);
  const buffer = await offCtx.startRendering();
  return bufferToWav(buffer);
}

export async function downloadSound(name) {
  const blob = await renderToWav(name);
  if (!blob) return;
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob), download: `btn-${name}.wav`,
  });
  a.click(); URL.revokeObjectURL(a.href);
}

export async function downloadAllSounds() {
  for (const name of Object.keys(SOUNDS)) {
    if (name === "none") continue;
    await downloadSound(name);
    await new Promise(r => setTimeout(r, 300));
  }
}
