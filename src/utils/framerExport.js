/**
 * Generates a self-contained Framer code component from Feel Lab params.
 * The output is a single .tsx file ready to paste into Framer:
 *   Assets panel → Code → + → New File → paste → save
 */

// ── Inline sound code per sound type ─────────────────────────────────────────
const NOISE_HELPER = `
  function noiseBuf(ctx, sec, decay) {
    const n = Math.ceil(ctx.sampleRate * sec)
    const buf = ctx.createBuffer(1, n, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay)
    return buf
  }`;

function soundBlock(sound) {
  switch (sound) {
    case "none":
      return { play: `  function soundPlay() {}`, release: "" };

    case "soft":
      return {
        play: `${NOISE_HELPER}
  function soundPlay() {
    const ctx = getAudioCtx()
    const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.05, 3)
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 900; f.Q.value = 0.8
    const g = ctx.createGain(); g.gain.value = 0.22
    src.connect(f); f.connect(g); g.connect(ctx.destination); src.start()
  }`, release: "",
      };

    case "snap":
      return {
        play: `${NOISE_HELPER}
  function soundPlay() {
    const ctx = getAudioCtx()
    const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.02, 6)
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2400; f.Q.value = 0.4
    const g = ctx.createGain(); g.gain.value = 0.45
    src.connect(f); f.connect(g); g.connect(ctx.destination); src.start()
  }`, release: "",
      };

    case "thud":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
    const o = ctx.createOscillator(); o.type = "sine"
    o.frequency.setValueAtTime(160, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.2)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.9, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.22)
  }`, release: "",
      };

    case "pop":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
    const o = ctx.createOscillator(); o.type = "sine"
    o.frequency.setValueAtTime(380, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.09)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.7, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.12)
  }`, release: "",
      };

    case "chime":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
    ;[523.25, 659.25, 783.99].forEach((freq, i) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq
      const g = ctx.createGain(); const t = ctx.currentTime + i * 0.055
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.14, t + 0.01)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.55)
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.62)
    })
  }`, release: "",
      };

    case "retro":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
    const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = 880
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.09, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.1)
  }`, release: "",
      };

    case "glitch":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
    const o = ctx.createOscillator(); o.type = "sawtooth"
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.07, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    ;[180,920,140,1300,260,700,80,1100].forEach((f,i) => o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.024))
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.22)
  }`, release: "",
      };

    case "coin":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
    ;[[988, 0], [1319, 0.09]].forEach(([freq, delay]) => {
      const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = freq
      const g = ctx.createGain(); const t = ctx.currentTime + delay
      g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.32)
    })
  }`, release: "",
      };

    case "zap":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
    const o = ctx.createOscillator(); o.type = "sawtooth"
    o.frequency.setValueAtTime(1800, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.12, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.28)
  }`, release: "",
      };

    case "jump":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
    const o = ctx.createOscillator(); o.type = "square"
    o.frequency.setValueAtTime(200, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.14)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.08, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.18)
  }`, release: "",
      };

    case "warp":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
    ;[0, 12].forEach(detune => {
      const o = ctx.createOscillator(); o.type = "sawtooth"; o.detune.value = detune
      o.frequency.setValueAtTime(200, ctx.currentTime)
      o.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.35)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.06, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.38)
    })
  }`, release: "",
      };

    case "powerUp":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
    ;[261.63, 329.63, 392, 523.25].forEach((freq, i) => {
      const o = ctx.createOscillator(); o.type = "square"; o.frequency.value = freq
      const g = ctx.createGain(); const t = ctx.currentTime + i * 0.08
      g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.25)
    })
  }`, release: "",
      };

    case "pluck":
      return {
        play: `${NOISE_HELPER}
  function soundPlay() {
    const ctx = getAudioCtx()
    const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.01, 1)
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 330; f.Q.value = 40
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.5, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85)
    src.connect(f); f.connect(g); g.connect(ctx.destination); src.start()
  }`, release: "",
      };

    case "knock":
      return {
        play: `${NOISE_HELPER}
  function soundPlay() {
    const ctx = getAudioCtx()
    const o = ctx.createOscillator(); o.type = "sine"
    o.frequency.setValueAtTime(130, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.06)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.85, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.1)
    const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.008, 4)
    const g2 = ctx.createGain(); g2.gain.value = 0.25
    src.connect(g2); g2.connect(ctx.destination); src.start()
  }`, release: "",
      };

    case "shutter":
      return {
        play: `${NOISE_HELPER}
  function soundPlay() {
    const ctx = getAudioCtx()
    ;[0, 0.06].forEach((delay, i) => {
      const src = ctx.createBufferSource(); src.buffer = noiseBuf(ctx, 0.012, i === 0 ? 5 : 8)
      const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 1800
      const g = ctx.createGain(); g.gain.value = i === 0 ? 0.38 : 0.18
      src.connect(f); f.connect(g); g.connect(ctx.destination)
      src.start(ctx.currentTime + delay)
    })
  }`, release: "",
      };

    case "ping":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
    ;[[2093, 0.2, 1.6], [2093 * 2.756, 0.055, 1.0]].forEach(([freq, gain, dur]) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(gain, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur + 0.05)
    })
  }`, release: "",
      };

    case "whoosh":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
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
  }`, release: "",
      };

    case "alien":
      return {
        play: `
  function soundPlay() {
    const ctx = getAudioCtx()
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
  }`, release: "",
      };

    case "charge":
      return {
        play: `
  let _chOsc = null, _chGain = null
  function soundPlay() {
    const ctx = getAudioCtx()
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
  }`,
        release: `
  function soundRelease() {
    const ctx = getAudioCtx()
    if (_chGain) { _chGain.gain.setValueAtTime(0.09, ctx.currentTime); _chGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1) }
    if (_chOsc) { try { _chOsc.stop(ctx.currentTime + 0.12) } catch {} _chOsc = null }
    const o = ctx.createOscillator(); o.type = "sawtooth"
    o.frequency.setValueAtTime(1200, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.18, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.22)
  }`,
      };

    default:
      return { play: `  function soundPlay() {}`, release: "" };
  }
}

// ── Icon imports ──────────────────────────────────────────────────────────────
function iconImportLine(leading, trailing) {
  const icons = [leading, trailing].filter(Boolean);
  if (!icons.length) return "";
  return `import { ${icons.join(", ")} } from "@phosphor-icons/react"\n`;
}

function iconJSX(name, sizeVar) {
  if (!name) return "null";
  return `<${name} size={${sizeVar}} weight="bold" style={{ flexShrink: 0 }} />`;
}

// ── Main generator ────────────────────────────────────────────────────────────
export function generateFramerComponent(params) {
  const {
    pressDepth, hoverLift, bounce, speed, shadowDepth, colorShift,
    cornerRadius, buttonColor, textColor,
    size = "md", leadingIcon, trailingIcon,
    label = "Button", sound = "snap",
  } = params;

  const { play, release } = soundBlock(sound);
  const hasRelease = Boolean(release);
  const releaseCall = hasRelease ? "\n    soundRelease()" : "";

  const iconImport = iconImportLine(leadingIcon, trailingIcon);
  const leadingJSX  = leadingIcon  ? `\n          {${iconJSX(leadingIcon,  "sz.iconSize")}}` : "";
  const trailingJSX = trailingIcon ? `\n          {${iconJSX(trailingIcon, "sz.iconSize")}}` : "";

  const componentName = label
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join("") || "FeelButton";

  return `// ${componentName}.tsx — exported from Feel Lab
// ─────────────────────────────────────────────────────────────────────────────
// HOW TO USE IN FRAMER
// 1. Open your Framer project
// 2. Go to Assets panel (left sidebar) → Code tab → click "+"
// 3. Name the file "${componentName}"
// 4. Paste this entire file and hit Save (Cmd+S)
// 5. Drag the component onto your canvas from the Assets → Code panel
// 6. In the right panel, set the Link to any page or URL
// ─────────────────────────────────────────────────────────────────────────────

${iconImport}import { useRef } from "react"
import { addPropertyControls, ControlType } from "framer"

// ── Audio context ─────────────────────────────────────────────────────────────
let _audioCtx: AudioContext | null = null
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  if (_audioCtx.state === "suspended") _audioCtx.resume()
  return _audioCtx
}

// ── Sound: ${sound} ────────────────────────────────────────────────────────────
${play}${release}

// ── Spring physics ────────────────────────────────────────────────────────────
function easeOut(t: number) { return 1 - (1 - t) ** 3 }

function springAnimate(from: number, to: number, bounce: number, ms: number, onUpdate: (v: number) => void) {
  const overshoot = bounce > 0 ? to + bounce / 100 : to
  const start = performance.now()
  let handle: number
  function tick(now: number) {
    const t = Math.min((now - start) / ms, 1)
    let val: number
    if (bounce <= 0) val = from + (to - from) * easeOut(t)
    else if (t < 0.65) val = from + (overshoot - from) * easeOut(t / 0.65)
    else val = overshoot + (to - overshoot) * easeOut((t - 0.65) / 0.35)
    onUpdate(val)
    if (t < 1) handle = requestAnimationFrame(tick)
    else onUpdate(to)
  }
  handle = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(handle)
}

// ── Design config (baked in from Feel Lab) ────────────────────────────────────
const C = {
  pressDepth:  ${pressDepth},
  hoverLift:   ${hoverLift},
  bounce:      ${bounce},
  speed:       ${speed},
  shadowDepth: ${shadowDepth},
  colorShift:  ${colorShift},
  cornerRadius: ${cornerRadius},
  buttonColor: "${buttonColor}",
  textColor:   "${textColor}",
  size:        "${size}",
}

const SIZES = {
  sm: { height: 36, paddingX: 16, fontSize: 14, iconSize: 14, gap: 6 },
  md: { height: 48, paddingX: 24, fontSize: 15, iconSize: 18, gap: 8 },
  lg: { height: 56, paddingX: 32, fontSize: 16, iconSize: 20, gap: 10 },
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ${componentName}({
  label = "${label}",
  href,
  openInNewTab = false,
}: {
  label?: string
  href?: string
  openInNewTab?: boolean
}) {
  const btnRef    = useRef<HTMLButtonElement>(null)
  const scaleRef  = useRef(1)
  const cancelRef = useRef<(() => void) | null>(null)
  const isDown    = useRef(false)
  const isHov     = useRef(false)

  const sz = SIZES[C.size as keyof typeof SIZES] || SIZES.md
  const radius = C.cornerRadius >= 100 ? "9999px" : \`\${C.cornerRadius}px\`

  function applyScale(s: number) {
    scaleRef.current = s
    if (btnRef.current) btnRef.current.style.transform = \`scale(\${s.toFixed(4)})\`
  }

  function applyShadow(state: "pressed" | "hover" | "idle") {
    const el = btnRef.current; if (!el) return
    const s = C.shadowDepth, c = C.colorShift
    if (state === "pressed") {
      el.style.boxShadow = \`0 1px \${Math.round(s * 3)}px rgba(0,0,0,\${(0.15 * s).toFixed(2)})\`
      el.style.filter    = \`brightness(\${(1 - c * 0.13).toFixed(3)})\`
    } else if (state === "hover") {
      el.style.boxShadow = \`0 \${Math.round(s * 7)}px \${Math.round(s * 14)}px rgba(0,0,0,\${(0.22 * s).toFixed(2)})\`
      el.style.filter    = \`brightness(\${(1 + c * 0.09).toFixed(3)})\`
    } else {
      el.style.boxShadow = \`0 \${Math.round(s * 3)}px \${Math.round(s * 8)}px rgba(0,0,0,\${(0.18 * s).toFixed(2)})\`
      el.style.filter    = "brightness(1)"
    }
  }

  function go(to: number, bounce: number, ms: number) {
    cancelRef.current?.()
    cancelRef.current = springAnimate(scaleRef.current, to, bounce, ms, applyScale)
  }

  function doRelease() {
    isDown.current = false${releaseCall}
    const toScale = isHov.current ? 1 + C.hoverLift / 100 : 1
    applyShadow(isHov.current ? "hover" : "idle")
    go(toScale, C.bounce, 180 / C.speed)
  }

  const handlers = {
    onMouseEnter() {
      isHov.current = true
      if (isDown.current) return
      applyShadow("hover")
      go(1 + C.hoverLift / 100, 0, 120 / C.speed)
    },
    onMouseLeave() {
      isHov.current = false
      if (isDown.current) { doRelease(); return }
      applyShadow("idle")
      go(1, 0, 150 / C.speed)
    },
    onMouseDown() {
      isDown.current = true
      soundPlay()
      applyShadow("pressed")
      go(1 - C.pressDepth / 100, 0, 90 / C.speed)
    },
    onMouseUp() {
      if (!isDown.current) return
      doRelease()
    },
  }

  const button = (
    <button
      ref={btnRef}
      {...handlers}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sz.gap,
        height: sz.height,
        paddingLeft: sz.paddingX,
        paddingRight: sz.paddingX,
        fontSize: sz.fontSize,
        fontWeight: 600,
        letterSpacing: "0.01em",
        fontFamily: "inherit",
        borderRadius: radius,
        backgroundColor: C.buttonColor,
        color: C.textColor,
        border: "none",
        cursor: "pointer",
        outline: "none",
        userSelect: "none",
        willChange: "transform, box-shadow, filter",
        WebkitFontSmoothing: "antialiased",
      }}
    >${leadingJSX}
      <span>{label}</span>${trailingJSX}
    </button>
  )

  if (!href) return button

  return (
    <a
      href={href}
      target={openInNewTab ? "_blank" : "_self"}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      style={{ textDecoration: "none", display: "inline-flex" }}
    >
      {button}
    </a>
  )
}

// ── Framer property controls ──────────────────────────────────────────────────
addPropertyControls(${componentName}, {
  label: {
    type: ControlType.String,
    title: "Label",
    defaultValue: "${label}",
  },
  href: {
    type: ControlType.Link,
    title: "Link",
  },
  openInNewTab: {
    type: ControlType.Boolean,
    title: "New tab",
    defaultValue: false,
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
})
`;
}
