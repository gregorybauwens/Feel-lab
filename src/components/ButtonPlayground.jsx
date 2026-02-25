import { useState, useRef, useEffect } from "react";
import { SOUNDS, playSound, releaseSound, downloadSound, downloadAllSounds } from "../sounds/soundEngine";
import { useButtonFeel } from "../hooks/useButtonFeel";
import { PhosphorIcon, ICON_NAMES } from "../utils/icons";
import { generateFramerComponent } from "../utils/framerExport";
import { getFramerSoundOverride } from "../utils/framerSoundOverride";

// ── Constants ─────────────────────────────────────────────────────────────────
const SIZE_OPTS = ["sm", "md", "lg"];
const SIZE_LABELS = { sm: "Small", md: "Medium", lg: "Large" };
const SIZE_DIMS = {
  sm: { h: "h-9",  px: "px-4", text: "text-sm",     icon: 14 },
  md: { h: "h-12", px: "px-6", text: "text-[15px]", icon: 18 },
  lg: { h: "h-14", px: "px-8", text: "text-base",   icon: 20 },
};

const PRESETS = {
  Precise: {
    pressDepth: 3,  hoverLift: 1,  bounce: 0,   speed: 1.5, shadowDepth: 0.5, colorShift: 0.5,
    cornerRadius: 8,   buttonColor: "#6366f1", textColor: "#ffffff",
    size: "md", leadingIcon: null, trailingIcon: null, disabled: false, label: "Feel me", sound: "soft",
  },
  Snappy: {
    pressDepth: 5,  hoverLift: 2,  bounce: 2,   speed: 1.2, shadowDepth: 0.8, colorShift: 0.8,
    cornerRadius: 16,  buttonColor: "#6366f1", textColor: "#ffffff",
    size: "md", leadingIcon: null, trailingIcon: "ArrowRight", disabled: false, label: "Feel me", sound: "snap",
  },
  Bouncy: {
    pressDepth: 7,  hoverLift: 3,  bounce: 4,   speed: 0.9, shadowDepth: 1.0, colorShift: 1.0,
    cornerRadius: 20,  buttonColor: "#6366f1", textColor: "#ffffff",
    size: "md", leadingIcon: "Sparkle", trailingIcon: null, disabled: false, label: "Feel me", sound: "pop",
  },
  Playful: {
    pressDepth: 10, hoverLift: 5,  bounce: 6,   speed: 0.7, shadowDepth: 1.2, colorShift: 1.2,
    cornerRadius: 999, buttonColor: "#ec4899", textColor: "#ffffff",
    size: "lg", leadingIcon: "MagicWand", trailingIcon: null, disabled: false, label: "Feel me", sound: "powerUp",
  },
};

function contrastColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#000000" : "#ffffff";
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ButtonPlayground() {
  const [activePreset, setActivePreset] = useState("Snappy");
  const [exportingAll, setExportingAll] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [iconPicker, setIconPicker] = useState(null); // null | "leading" | "trailing"
  const [, rerender] = useState(0);

  const paramsRef = useRef({ ...PRESETS.Snappy });

  const updateParams = (key, val) => {
    paramsRef.current = { ...paramsRef.current, [key]: val };
    setActivePreset(null);
    rerender(n => n + 1);
  };

  const applyPreset = (name) => {
    paramsRef.current = { ...PRESETS[name] };
    setActivePreset(name);
    setIconPicker(null);
    rerender(n => n + 1);
  };

  const { btnRef, handlers, applyShadow } = useButtonFeel(paramsRef);

  // Sync shadow whenever params change
  useEffect(() => { applyShadow(paramsRef.current.disabled ? "idle" : "idle"); });

  const p = paramsRef.current;
  const { h, px, text, icon } = SIZE_DIMS[p.size] || SIZE_DIMS.md;

  // ── Export handlers ──────────────────────────────────────────────────────
  const handleDownloadOne = async (name) => {
    setDownloading(name); await downloadSound(name); setDownloading(null);
  };
  const handleDownloadAll = async () => {
    setExportingAll(true); await downloadAllSounds(); setExportingAll(false);
  };
  const handleDownloadOverride = () => {
    const code = getFramerSoundOverride();
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "FeelLabSound.ts"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportFramer = () => {
    const code = generateFramerComponent(paramsRef.current);
    const name = (paramsRef.current.label || "Button")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("") || "FeelButton";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${name}.tsx`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* ── Presets ── */}
      <div className="flex gap-2 flex-wrap">
        {Object.keys(PRESETS).map(name => (
          <button key={name} onClick={() => applyPreset(name)}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 cursor-pointer border-0",
              activePreset === name ? "bg-white/15 text-white" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70",
            ].join(" ")}>
            {name}
          </button>
        ))}
      </div>

      {/* ── Live preview ── */}
      <div className="flex items-center justify-center h-44 bg-white/[0.03] rounded-2xl border border-white/8">
        <button
          ref={btnRef}
          {...handlers}
          disabled={p.disabled}
          className={[
            "inline-flex items-center justify-center gap-2",
            h, px, text,
            "font-semibold tracking-[0.01em] select-none outline-none border-0",
            p.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
          style={{
            willChange: "transform, box-shadow, filter",
            borderRadius: p.cornerRadius >= 100 ? "9999px" : `${p.cornerRadius}px`,
            backgroundColor: p.buttonColor,
            color: p.textColor,
          }}
        >
          {p.leadingIcon  && <PhosphorIcon name={p.leadingIcon}  size={icon} weight="bold" />}
          <span>{p.label}</span>
          {p.trailingIcon && <PhosphorIcon name={p.trailingIcon} size={icon} weight="bold" />}
        </button>
      </div>

      {/* ── Physics sliders ── */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-6">
        <FeelSlider label="Press depth"   hint="Scale reduction on click"        value={p.pressDepth}  min={1}   max={12}  step={0.5}  format={v => `${v.toFixed(1)}%`}                  onChange={v => updateParams("pressDepth", v)} />
        <FeelSlider label="Hover lift"    hint="Scale-up on hover"               value={p.hoverLift}   min={0}   max={6}   step={0.25} format={v => `+${v.toFixed(2)}%`}                 onChange={v => updateParams("hoverLift", v)} />
        <FeelSlider label="Spring bounce" hint="Overshoot on release"            value={p.bounce}      min={0}   max={8}   step={0.2}  format={v => v === 0 ? "off" : `${v.toFixed(1)}%`} onChange={v => updateParams("bounce", v)} />
        <FeelSlider label="Speed"         hint="Overall animation tempo"         value={p.speed}       min={0.4} max={2.4} step={0.05} format={v => `${v.toFixed(2)}×`}                   onChange={v => updateParams("speed", v)} />
        <FeelSlider label="Shadow depth"  hint="Elevation and contact cues"      value={p.shadowDepth} min={0}   max={1.6} step={0.05} format={v => v.toFixed(2)}                         onChange={v => updateParams("shadowDepth", v)} />
        <FeelSlider label="Color shift"   hint="Brightness swing on interaction" value={p.colorShift}  min={0}   max={1.6} step={0.05} format={v => v.toFixed(2)}                         onChange={v => updateParams("colorShift", v)} />
      </div>

      {/* ── Shape & Color ── */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-8 items-end">
        <FeelSlider label="Corner radius" hint="Border radius"
          value={p.cornerRadius > 100 ? 100 : p.cornerRadius}
          min={0} max={100} step={1}
          format={v => v >= 100 ? "pill" : `${v}px`}
          onChange={v => updateParams("cornerRadius", v >= 100 ? 999 : v)}
        />
        <ColorSwatch label="Button" value={p.buttonColor} onChange={v => updateParams("buttonColor", v)} />
        <ColorSwatch label="Text"   value={p.textColor}   onChange={v => updateParams("textColor", v)} />
      </div>

      {/* ── Label · Size · Disabled ── */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-8 items-end">
        {/* Label */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-white/40">Label</span>
          <input
            type="text"
            value={p.label}
            onChange={e => updateParams("label", e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 h-10 text-white text-sm outline-none focus:border-white/25 transition-colors"
          />
        </div>

        {/* Size */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-white/40">Size</span>
          <div className="flex gap-1">
            {SIZE_OPTS.map(s => (
              <button key={s} onClick={() => updateParams("size", s)}
                className={[
                  "h-10 px-3 rounded-xl text-xs font-semibold transition-all duration-100 cursor-pointer border-0",
                  p.size === s ? "bg-white/15 text-white" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70",
                ].join(" ")}>
                {SIZE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Disabled */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-white/40">Disabled</span>
          <button onClick={() => updateParams("disabled", !p.disabled)}
            className={[
              "h-10 px-4 rounded-xl text-xs font-semibold transition-all duration-100 cursor-pointer border",
              p.disabled
                ? "bg-white/10 border-white/20 text-white"
                : "bg-transparent border-white/10 text-white/30 hover:border-white/20 hover:text-white/60",
            ].join(" ")}>
            {p.disabled ? "On" : "Off"}
          </button>
        </div>
      </div>

      {/* ── Icons ── */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-white/40">Icons</span>
        <div className="flex gap-3">
          {["leading", "trailing"].map(slot => {
            const key = `${slot}Icon`;
            const current = p[key];
            const isOpen = iconPicker === slot;
            return (
              <div key={slot} className="flex flex-col gap-1.5">
                <span className="text-[10px] text-white/25 capitalize">{slot}</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setIconPicker(isOpen ? null : slot)}
                    className={[
                      "h-9 px-3 rounded-xl text-xs font-semibold transition-all duration-100 cursor-pointer border-0 flex items-center gap-1.5",
                      isOpen ? "bg-white/15 text-white" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80",
                    ].join(" ")}>
                    {current
                      ? <><PhosphorIcon name={current} size={14} weight="bold" /><span>{current}</span></>
                      : <span>None</span>}
                  </button>
                  {current && (
                    <button onClick={() => updateParams(key, null)}
                      className="h-9 w-9 rounded-xl bg-white/5 text-white/30 hover:bg-white/10 hover:text-white/70 transition-all duration-100 cursor-pointer border-0 text-sm">
                      ×
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Icon picker grid */}
        {iconPicker && (
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
            <div className="flex flex-wrap gap-1.5">
              {ICON_NAMES.map(name => (
                <button key={name} title={name}
                  onClick={() => { updateParams(`${iconPicker}Icon`, name); setIconPicker(null); }}
                  className={[
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-100 cursor-pointer border-0",
                    p[`${iconPicker}Icon`] === name
                      ? "bg-indigo-500/40 text-indigo-300"
                      : "bg-white/5 text-white/40 hover:bg-white/12 hover:text-white/80",
                  ].join(" ")}>
                  <PhosphorIcon name={name} size={16} weight="bold" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Sounds ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-widest uppercase text-white/40">Sound on click</span>
          <button onClick={handleDownloadAll} disabled={exportingAll}
            className="text-[11px] font-semibold text-white/30 hover:text-white/70 transition-colors duration-150 cursor-pointer border-0 bg-transparent disabled:opacity-40">
            {exportingAll ? "Exporting…" : "Export all as WAV"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {Object.entries(SOUNDS).map(([key, s]) => (
            <div key={key} className="relative group">
              <button onClick={() => updateParams("sound", key)} title={s.desc}
                className={[
                  "w-full flex flex-col items-start px-3 py-2.5 rounded-xl border transition-all duration-100 cursor-pointer text-left",
                  p.sound === key
                    ? "bg-white/12 border-white/20 text-white"
                    : "bg-white/[0.03] border-white/8 text-white/40 hover:bg-white/8 hover:text-white/70",
                ].join(" ")}>
                <span className="text-xs font-semibold pr-4">{s.label}</span>
                <span className="text-[10px] opacity-60 mt-0.5 leading-tight">{s.desc}</span>
              </button>
              {key !== "none" && (
                <button onClick={() => handleDownloadOne(key)} disabled={downloading === key}
                  title={`Download ${s.label}.wav`}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white cursor-pointer border-0 bg-transparent text-[11px] leading-none disabled:animate-pulse">
                  {downloading === key ? "…" : "↓"}
                </button>
              )}
            </div>
          ))}
        </div>

        {p.sound === "charge" && (
          <p className="text-[11px] text-white/25">
            Charge builds while held — release to hear the discharge.
          </p>
        )}
      </div>

      {/* ── Framer export ── */}
      <div className="flex flex-col gap-3 pt-2 border-t border-white/8">
        <span className="text-xs font-semibold tracking-widest uppercase text-white/40">Export to Framer</span>

        {/* Code component */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white/60">This button</p>
            <p className="text-[11px] text-white/25 mt-0.5">Self-contained component with design &amp; sound baked in</p>
          </div>
          <button
            onClick={handleExportFramer}
            className="h-9 px-4 rounded-xl text-xs font-semibold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 hover:text-indigo-200 transition-all duration-150 cursor-pointer border border-indigo-500/30 hover:border-indigo-500/50 whitespace-nowrap"
          >
            Download .tsx
          </button>
        </div>

        {/* Sound override */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white/60">Sound override</p>
            <p className="text-[11px] text-white/25 mt-0.5">All 20 sounds — apply to any button in Framer via Overrides</p>
          </div>
          <button
            onClick={handleDownloadOverride}
            className="h-9 px-4 rounded-xl text-xs font-semibold bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 transition-all duration-150 cursor-pointer border border-white/10 hover:border-white/20 whitespace-nowrap"
          >
            Download .ts
          </button>
        </div>
      </div>

    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FeelSlider({ label, hint, value, min, max, step, format, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-white/40">{label}</span>
          {hint && <span className="ml-2 text-[10px] text-white/20 hidden sm:inline">{hint}</span>}
        </div>
        <span className="text-xs font-mono text-white/50">{format(value)}</span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute inset-x-0 h-[3px] bg-white/10 rounded-full">
          <div className="absolute left-0 top-0 h-full bg-indigo-400 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <div className="absolute size-3.5 rounded-full bg-white shadow-md pointer-events-none ring-2 ring-indigo-400/40"
          style={{ left: `calc(${pct}% - 7px)` }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
      </div>
    </div>
  );
}

function ColorSwatch({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold tracking-widest uppercase text-white/40">{label}</span>
      <div className="relative w-16 h-10 rounded-xl overflow-hidden cursor-pointer border border-white/10"
        style={{ backgroundColor: value }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <span className="absolute bottom-1 left-1 text-[8px] font-mono leading-none"
          style={{ color: contrastColor(value) }}>{value}</span>
      </div>
    </div>
  );
}
