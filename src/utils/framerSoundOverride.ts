/**
 * Generates the static Framer code override file content.
 * All 20 sounds inlined — identical Web Audio synthesis to Feel Lab.
 */
export function getFramerSoundOverride(): string {
  return `// FeelLabSound.ts — Feel Lab Sound Override for Framer
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE
// 1. Framer: Assets panel → Code tab → "+" → New File → name it "FeelLabSound"
// 2. Paste this entire file → Cmd+S
// 3. Select any element on your canvas
// 4. Right panel → Overrides → pick "FeelLabSound" → "SoundOnClick"
// 5. Choose your sound from the dropdown — done!
// Note: sounds only play in Preview (Cmd+P), not on the canvas.
// ─────────────────────────────────────────────────────────────────────────────

import { Override } from "framer"

// ── Audio context ─────────────────────────────────────────────────────────────
let _ctx: AudioContext | null = null
function getCtx(): AudioContext {
  if (!_ctx) _ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  if (_ctx.state === "suspended") _ctx.resume()
  return _ctx
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function noiseBuf(ctx: AudioContext, sec: number, decay: number): AudioBuffer {
  const n = Math.ceil(ctx.sampleRate * sec)
  const buf = ctx.createBuffer(1, n, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay)
  return buf
}

function osc(ctx: AudioContext, type: OscillatorType, freq: number, freqEnd: number | null, gain: number, dur: number, startAt = 0) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq
  if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + startAt + dur)
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, ctx.currentTime + startAt)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + dur)
  o.connect(g); g.connect(ctx.destination)
  o.start(ctx.currentTime + startAt); o.stop(ctx.currentTime + startAt + dur + 0.02)
}

// ── Sounds ────────────────────────────────────────────────────────────────────
function playSoft() {
  const ctx = getCtx()
  const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.05, 3)
  const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 900; f.Q.value = 0.8
  const g = ctx.createGain(); g.gain.value = 0.22
  src.connect(f); f.connect(g); g.connect(ctx.destination); src.start()
}

function playSnap() {
  const ctx = getCtx()
  const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.02, 6)
  const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2400; f.Q.value = 0.4
  const g = ctx.createGain(); g.gain.value = 0.45
  src.connect(f); f.connect(g); g.connect(ctx.destination); src.start()
}

function playThud()   { osc(getCtx(), "sine",     160,  35,   0.9,  0.2)  }
function playPop()    { osc(getCtx(), "sine",     380,  90,   0.7,  0.1)  }
function playRetro()  { osc(getCtx(), "square",   880,  null, 0.09, 0.07) }
function playZap()    { osc(getCtx(), "sawtooth", 1800, 80,   0.12, 0.25) }
function playJump()   { osc(getCtx(), "square",   200,  800,  0.08, 0.14) }

function playChime() {
  const ctx = getCtx()
  ;[523.25, 659.25, 783.99].forEach((freq, i) => {
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq
    const g = ctx.createGain(); const t = ctx.currentTime + i * 0.055
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.14, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55)
    o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.62)
  })
}

function playGlitch() {
  const ctx = getCtx()
  const o = ctx.createOscillator(); o.type = "sawtooth"
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.07, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
  ;[180,920,140,1300,260,700,80,1100].forEach((f,i) => o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.024))
  o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.22)
}

function playCoin() {
  const ctx = getCtx()
  ;[[988, 0], [1319, 0.09]].forEach(([freq, t]) => osc(ctx, "square", freq, null, 0.07, 0.28, t))
}

function playWarp() {
  const ctx = getCtx()
  ;[0, 12].forEach(detune => {
    const o = ctx.createOscillator(); o.type = "sawtooth"; o.detune.value = detune
    o.frequency.setValueAtTime(200, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.35)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.06, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.38)
  })
}

function playPowerUp() {
  const ctx = getCtx()
  ;[261.63, 329.63, 392, 523.25].forEach((freq, i) => osc(ctx, "square", freq, null, 0.07, 0.2, i * 0.08))
}

function playPluck() {
  const ctx = getCtx()
  const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.01, 1)
  const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 330; f.Q.value = 40
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.5, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85)
  src.connect(f); f.connect(g); g.connect(ctx.destination); src.start()
}

function playKnock() {
  const ctx = getCtx()
  osc(ctx, "sine", 130, 55, 0.85, 0.09)
  const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.008, 4)
  const g = ctx.createGain(); g.gain.value = 0.25
  src.connect(g); g.connect(ctx.destination); src.start()
}

function playShutter() {
  const ctx = getCtx()
  ;[0, 0.06].forEach((delay, i) => {
    const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.012, i === 0 ? 5 : 8)
    const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 1800
    const g = ctx.createGain(); g.gain.value = i === 0 ? 0.38 : 0.18
    src.connect(f); f.connect(g); g.connect(ctx.destination)
    src.start(ctx.currentTime + delay)
  })
}

function playPing() {
  const ctx = getCtx()
  ;[[2093, 0.2, 1.6], [2093 * 2.756, 0.055, 1.0]].forEach(([freq, gain, dur]) =>
    osc(ctx, "sine", freq, null, gain, dur))
}

function playWhoosh() {
  const ctx = getCtx()
  const dur = 0.22
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / d.length)
  const src = ctx.createBufferSource(); src.buffer = buf
  const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 0.5
  f.frequency.setValueAtTime(150, ctx.currentTime)
  f.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + dur)
  const g = ctx.createGain(); g.gain.value = 0.32
  src.connect(f); f.connect(g); g.connect(ctx.destination); src.start()
}

function playAlien() {
  const ctx = getCtx()
  const carrier = ctx.createOscillator(); carrier.type = "sine"
  carrier.frequency.setValueAtTime(300, ctx.currentTime)
  carrier.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.18)
  const mod = ctx.createOscillator(); mod.type = "sine"; mod.frequency.value = 40
  const modG = ctx.createGain(); modG.gain.value = 180
  mod.connect(modG); modG.connect(carrier.frequency)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.09, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
  carrier.connect(g); g.connect(ctx.destination)
  carrier.start(); carrier.stop(ctx.currentTime + 0.24)
  mod.start(); mod.stop(ctx.currentTime + 0.24)
}

// Charge: builds while held, discharges on release
let _chOsc: OscillatorNode | null = null
let _chGain: GainNode | null = null

function playChargeStart() {
  const ctx = getCtx()
  if (_chOsc) { try { _chOsc.stop() } catch {} _chOsc = null }
  const o = ctx.createOscillator(); o.type = "sawtooth"
  o.frequency.setValueAtTime(80, ctx.currentTime)
  o.frequency.linearRampToValueAtTime(900, ctx.currentTime + 3)
  const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 10
  const lfoG = ctx.createGain(); lfoG.gain.value = 25
  lfo.connect(lfoG); lfoG.connect(o.frequency)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, ctx.currentTime)
  g.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.12)
  o.connect(g); g.connect(ctx.destination); o.start(); lfo.start()
  _chOsc = o; _chGain = g
}

function playChargeEnd() {
  const ctx = getCtx()
  if (_chGain) { _chGain.gain.setValueAtTime(0.09, ctx.currentTime); _chGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1) }
  if (_chOsc) { try { _chOsc.stop(ctx.currentTime + 0.12) } catch {} _chOsc = null }
  osc(ctx, "sawtooth", 1200, 60, 0.18, 0.2)
}

// ── Sound dispatch ────────────────────────────────────────────────────────────
const PLAY: Record<string, () => void> = {
  none: () => {},
  soft: playSoft, snap: playSnap, thud: playThud, pop: playPop,
  chime: playChime, retro: playRetro, glitch: playGlitch, coin: playCoin,
  zap: playZap, jump: playJump, warp: playWarp, powerUp: playPowerUp,
  pluck: playPluck, knock: playKnock, shutter: playShutter,
  ping: playPing, whoosh: playWhoosh, alien: playAlien,
  charge: playChargeStart,
}
const RELEASE: Record<string, (() => void) | undefined> = {
  charge: playChargeEnd,
}

// ── Overrides — one per sound, pick from the Override dropdown ────────────────
function make(key: string): Override {
  return {
    onMouseDown() { PLAY[key]?.() },
    onMouseUp()   { RELEASE[key]?.() },
    onMouseLeave() { RELEASE[key]?.() },
  }
}

export function Soft():    Override { return make("soft")    }
export function Snap():    Override { return make("snap")    }
export function Thud():    Override { return make("thud")    }
export function Pop():     Override { return make("pop")     }
export function Chime():   Override { return make("chime")   }
export function Retro():   Override { return make("retro")   }
export function Glitch():  Override { return make("glitch")  }
export function Coin():    Override { return make("coin")    }
export function Zap():     Override { return make("zap")     }
export function Jump():    Override { return make("jump")    }
export function Warp():    Override { return make("warp")    }
export function PowerUp(): Override { return make("powerUp") }
export function Pluck():   Override { return make("pluck")   }
export function Knock():   Override { return make("knock")   }
export function Shutter(): Override { return make("shutter") }
export function Ping():    Override { return make("ping")    }
export function Whoosh():  Override { return make("whoosh")  }
export function Alien():   Override { return make("alien")   }
export function Charge():  Override { return make("charge")  }
`
}
