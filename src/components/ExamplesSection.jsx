import { useEffect, useRef } from "react";
import { useButtonFeel } from "../hooks/useButtonFeel";
import { PhosphorIcon } from "../utils/icons";

// ── Size tokens ───────────────────────────────────────────────────────────────
const SIZE = {
  sm: { h: "h-9",  px: "px-4", text: "text-sm",      icon: 14, gap: "gap-1.5" },
  md: { h: "h-11", px: "px-5", text: "text-[14px]",  icon: 16, gap: "gap-2"   },
  lg: { h: "h-13", px: "px-7", text: "text-[15px]",  icon: 18, gap: "gap-2.5" },
};

// ── 30 Examples ───────────────────────────────────────────────────────────────
const EXAMPLES = [
  // ── CTAs ─────────────────────────────────────────────────────────────────
  {
    id: 1,  label: "Get Started",    vibe: "confident",    category: "CTA",
    pressDepth: 5,  hoverLift: 2,  bounce: 2.5, speed: 1.2, shadowDepth: 0.9, colorShift: 0.8,
    cornerRadius: 999, buttonColor: "#6366f1", textColor: "#ffffff",
    leadingIcon: null, trailingIcon: "ArrowRight", size: "md", sound: "chime",
  },
  {
    id: 2,  label: "Try for Free",   vibe: "fresh",        category: "CTA",
    pressDepth: 5,  hoverLift: 2,  bounce: 2,   speed: 1.2, shadowDepth: 0.7, colorShift: 0.8,
    cornerRadius: 999, buttonColor: "#0d9488", textColor: "#ffffff",
    leadingIcon: "Sparkle", trailingIcon: null, size: "md", sound: "chime",
  },
  {
    id: 3,  label: "Learn More",     vibe: "minimal",      category: "CTA",
    pressDepth: 3,  hoverLift: 1,  bounce: 0,   speed: 1.5, shadowDepth: 0.4, colorShift: 0.5,
    cornerRadius: 8, buttonColor: "#1e293b", textColor: "#94a3b8",
    leadingIcon: null, trailingIcon: "ArrowRight", size: "sm", sound: "soft",
  },
  {
    id: 4,  label: "Join Waitlist",  vibe: "exclusive",    category: "CTA",
    pressDepth: 4,  hoverLift: 1.5, bounce: 1,  speed: 1.3, shadowDepth: 0.6, colorShift: 0.7,
    cornerRadius: 999, buttonColor: "#18181b", textColor: "#a1a1aa",
    leadingIcon: "Bell", trailingIcon: null, size: "md", sound: "soft",
  },

  // ── Commerce ──────────────────────────────────────────────────────────────
  {
    id: 5,  label: "Add to Cart",    vibe: "rewarding",    category: "Commerce",
    pressDepth: 6,  hoverLift: 2,  bounce: 3,   speed: 1.1, shadowDepth: 1.0, colorShift: 1.0,
    cornerRadius: 16, buttonColor: "#10b981", textColor: "#ffffff",
    leadingIcon: "ShoppingCart", trailingIcon: null, size: "md", sound: "coin",
  },
  {
    id: 6,  label: "Buy Now",        vibe: "punchy",       category: "Commerce",
    pressDepth: 5,  hoverLift: 2,  bounce: 2,   speed: 1.3, shadowDepth: 0.9, colorShift: 0.9,
    cornerRadius: 999, buttonColor: "#f97316", textColor: "#ffffff",
    leadingIcon: "CreditCard", trailingIcon: null, size: "md", sound: "snap",
  },
  {
    id: 7,  label: "Shop Collection", vibe: "editorial",   category: "Commerce",
    pressDepth: 3,  hoverLift: 1,  bounce: 0,   speed: 1.4, shadowDepth: 0.5, colorShift: 0.6,
    cornerRadius: 4, buttonColor: "#111827", textColor: "#f9fafb",
    leadingIcon: null, trailingIcon: "ArrowRight", size: "lg", sound: "soft",
  },
  {
    id: 8,  label: "Checkout",       vibe: "decisive",     category: "Commerce",
    pressDepth: 4,  hoverLift: 1.5, bounce: 1,  speed: 1.3, shadowDepth: 0.7, colorShift: 0.8,
    cornerRadius: 12, buttonColor: "#1d4ed8", textColor: "#ffffff",
    leadingIcon: "CreditCard", trailingIcon: null, size: "md", sound: "thud",
  },

  // ── Social ────────────────────────────────────────────────────────────────
  {
    id: 9,  label: "Follow",         vibe: "social",       category: "Social",
    pressDepth: 6,  hoverLift: 3,  bounce: 4,   speed: 1.0, shadowDepth: 0.8, colorShift: 1.0,
    cornerRadius: 999, buttonColor: "#6366f1", textColor: "#ffffff",
    leadingIcon: "Plus", trailingIcon: null, size: "sm", sound: "chime",
  },
  {
    id: 10, label: "Like",           vibe: "delightful",   category: "Social",
    pressDepth: 8,  hoverLift: 4,  bounce: 5,   speed: 0.9, shadowDepth: 1.0, colorShift: 1.2,
    cornerRadius: 999, buttonColor: "#f43f5e", textColor: "#ffffff",
    leadingIcon: "Heart", trailingIcon: null, size: "sm", sound: "pop",
  },
  {
    id: 11, label: "Subscribe",      vibe: "committed",    category: "Social",
    pressDepth: 5,  hoverLift: 2,  bounce: 2,   speed: 1.1, shadowDepth: 0.8, colorShift: 0.9,
    cornerRadius: 16, buttonColor: "#dc2626", textColor: "#ffffff",
    leadingIcon: "Bell", trailingIcon: null, size: "md", sound: "coin",
  },
  {
    id: 12, label: "Share",          vibe: "effortless",   category: "Social",
    pressDepth: 5,  hoverLift: 2,  bounce: 2.5, speed: 1.1, shadowDepth: 0.7, colorShift: 0.8,
    cornerRadius: 999, buttonColor: "#7c3aed", textColor: "#ffffff",
    leadingIcon: null, trailingIcon: "ShareNetwork", size: "sm", sound: "warp",
  },

  // ── Creative / Fun ────────────────────────────────────────────────────────
  {
    id: 13, label: "Launch",         vibe: "epic",         category: "Creative",
    pressDepth: 7,  hoverLift: 3,  bounce: 4,   speed: 1.0, shadowDepth: 1.1, colorShift: 1.1,
    cornerRadius: 999, buttonColor: "#1e1b4b", textColor: "#a5b4fc",
    leadingIcon: "Rocket", trailingIcon: null, size: "md", sound: "warp",
  },
  {
    id: 14, label: "Level Up",       vibe: "triumphant",   category: "Creative",
    pressDepth: 8,  hoverLift: 4,  bounce: 5,   speed: 0.8, shadowDepth: 1.2, colorShift: 1.2,
    cornerRadius: 999, buttonColor: "#d97706", textColor: "#ffffff",
    leadingIcon: "Trophy", trailingIcon: null, size: "md", sound: "powerUp",
  },
  {
    id: 15, label: "Cast Spell",     vibe: "mystical",     category: "Creative",
    pressDepth: 7,  hoverLift: 3,  bounce: 4,   speed: 0.9, shadowDepth: 1.0, colorShift: 1.0,
    cornerRadius: 999, buttonColor: "#7c3aed", textColor: "#e9d5ff",
    leadingIcon: "MagicWand", trailingIcon: null, size: "md", sound: "alien",
  },
  {
    id: 16, label: "Go Fast",        vibe: "electric",     category: "Creative",
    pressDepth: 8,  hoverLift: 5,  bounce: 6,   speed: 1.6, shadowDepth: 1.0, colorShift: 1.2,
    cornerRadius: 999, buttonColor: "#eab308", textColor: "#000000",
    leadingIcon: "Lightning", trailingIcon: null, size: "sm", sound: "zap",
  },
  {
    id: 17, label: "Fire It Up",     vibe: "charged",      category: "Creative",
    pressDepth: 7,  hoverLift: 3,  bounce: 3,   speed: 0.9, shadowDepth: 1.1, colorShift: 1.0,
    cornerRadius: 16, buttonColor: "#ea580c", textColor: "#ffffff",
    leadingIcon: "Fire", trailingIcon: null, size: "md", sound: "charge",
  },
  {
    id: 18, label: "Make Magic",     vibe: "whimsical",    category: "Creative",
    pressDepth: 8,  hoverLift: 4,  bounce: 5,   speed: 0.8, shadowDepth: 1.2, colorShift: 1.1,
    cornerRadius: 999, buttonColor: "#5b21b6", textColor: "#e9d5ff",
    leadingIcon: "Sparkle", trailingIcon: null, size: "md", sound: "alien",
  },

  // ── Professional ──────────────────────────────────────────────────────────
  {
    id: 19, label: "Save Draft",     vibe: "quiet",        category: "Professional",
    pressDepth: 3,  hoverLift: 1,  bounce: 0,   speed: 1.6, shadowDepth: 0.4, colorShift: 0.5,
    cornerRadius: 8, buttonColor: "#334155", textColor: "#e2e8f0",
    leadingIcon: "FloppyDisk", trailingIcon: null, size: "sm", sound: "soft",
  },
  {
    id: 20, label: "Export",         vibe: "purposeful",   category: "Professional",
    pressDepth: 4,  hoverLift: 1,  bounce: 0.5, speed: 1.4, shadowDepth: 0.5, colorShift: 0.6,
    cornerRadius: 10, buttonColor: "#2563eb", textColor: "#ffffff",
    leadingIcon: "DownloadSimple", trailingIcon: null, size: "sm", sound: "whoosh",
  },
  {
    id: 21, label: "Connect",        vibe: "smooth",       category: "Professional",
    pressDepth: 5,  hoverLift: 2,  bounce: 1.5, speed: 1.2, shadowDepth: 0.7, colorShift: 0.8,
    cornerRadius: 14, buttonColor: "#0891b2", textColor: "#ffffff",
    leadingIcon: "WifiHigh", trailingIcon: null, size: "md", sound: "ping",
  },
  {
    id: 22, label: "Generate",       vibe: "precise",      category: "Professional",
    pressDepth: 5,  hoverLift: 2,  bounce: 2,   speed: 1.2, shadowDepth: 0.8, colorShift: 0.9,
    cornerRadius: 999, buttonColor: "#312e81", textColor: "#a5b4fc",
    leadingIcon: "Code", trailingIcon: null, size: "md", sound: "retro",
  },

  // ── Security ──────────────────────────────────────────────────────────────
  {
    id: 23, label: "Confirm Delete", vibe: "deliberate",   category: "Security",
    pressDepth: 4,  hoverLift: 1,  bounce: 0,   speed: 1.4, shadowDepth: 0.7, colorShift: 0.8,
    cornerRadius: 8, buttonColor: "#dc2626", textColor: "#ffffff",
    leadingIcon: "Trash", trailingIcon: null, size: "md", sound: "thud",
  },
  {
    id: 24, label: "Lock Account",   vibe: "serious",      category: "Security",
    pressDepth: 3,  hoverLift: 1,  bounce: 0,   speed: 1.5, shadowDepth: 0.5, colorShift: 0.5,
    cornerRadius: 8, buttonColor: "#0f172a", textColor: "#64748b",
    leadingIcon: "Lock", trailingIcon: null, size: "sm", sound: "knock",
  },
  {
    id: 25, label: "Verify Identity", vibe: "trustworthy", category: "Security",
    pressDepth: 4,  hoverLift: 1,  bounce: 0.5, speed: 1.4, shadowDepth: 0.6, colorShift: 0.6,
    cornerRadius: 12, buttonColor: "#16a34a", textColor: "#ffffff",
    leadingIcon: "ShieldCheck", trailingIcon: null, size: "md", sound: "ping",
  },
  {
    id: 26, label: "Enable 2FA",     vibe: "secure",       category: "Security",
    pressDepth: 3,  hoverLift: 1,  bounce: 0,   speed: 1.5, shadowDepth: 0.5, colorShift: 0.6,
    cornerRadius: 10, buttonColor: "#1e293b", textColor: "#94a3b8",
    leadingIcon: "Fingerprint", trailingIcon: null, size: "sm", sound: "snap",
  },

  // ── Gaming ────────────────────────────────────────────────────────────────
  {
    id: 27, label: "Player 1 Start", vibe: "retro",        category: "Gaming",
    pressDepth: 6,  hoverLift: 2,  bounce: 2,   speed: 1.3, shadowDepth: 0.8, colorShift: 1.0,
    cornerRadius: 4, buttonColor: "#000000", textColor: "#00ff41",
    leadingIcon: "GameController", trailingIcon: null, size: "md", sound: "retro",
  },
  {
    id: 28, label: "Extra Life",     vibe: "bouncy",       category: "Gaming",
    pressDepth: 8,  hoverLift: 4,  bounce: 6,   speed: 0.8, shadowDepth: 1.0, colorShift: 1.2,
    cornerRadius: 999, buttonColor: "#22c55e", textColor: "#ffffff",
    leadingIcon: "Heart", trailingIcon: null, size: "sm", sound: "jump",
  },
  {
    id: 29, label: "Warp Zone",      vibe: "hyperspace",   category: "Gaming",
    pressDepth: 7,  hoverLift: 3,  bounce: 4,   speed: 1.0, shadowDepth: 1.0, colorShift: 1.0,
    cornerRadius: 999, buttonColor: "#7c3aed", textColor: "#ddd6fe",
    leadingIcon: "ArrowRight", trailingIcon: null, size: "md", sound: "warp",
  },
  {
    id: 30, label: "Boss Fight",     vibe: "ominous",      category: "Gaming",
    pressDepth: 5,  hoverLift: 1,  bounce: 0,   speed: 1.3, shadowDepth: 0.9, colorShift: 0.8,
    cornerRadius: 4, buttonColor: "#450a0a", textColor: "#fca5a5",
    leadingIcon: "Skull", trailingIcon: null, size: "md", sound: "glitch",
  },
];

const CATEGORIES = ["CTA", "Commerce", "Social", "Creative", "Professional", "Security", "Gaming"];

// ── Single example button ─────────────────────────────────────────────────────
function ExampleButton({ params }) {
  const { btnRef, handlers, applyShadow } = useButtonFeel(() => params);
  const { h, px, text, icon, gap } = SIZE[params.size] || SIZE.md;

  useEffect(() => { applyShadow("idle"); }, []);

  const radius = params.cornerRadius >= 100 ? "9999px" : `${params.cornerRadius}px`;

  return (
    <button
      ref={btnRef}
      {...handlers}
      className={[
        "inline-flex items-center justify-center shrink-0",
        h, px, text, gap,
        "font-semibold tracking-[0.01em] select-none cursor-pointer outline-none border-0",
      ].join(" ")}
      style={{
        willChange: "transform, box-shadow, filter",
        borderRadius: radius,
        backgroundColor: params.buttonColor,
        color: params.textColor,
      }}
    >
      {params.leadingIcon  && <PhosphorIcon name={params.leadingIcon}  size={icon} weight="bold" />}
      <span>{params.label}</span>
      {params.trailingIcon && <PhosphorIcon name={params.trailingIcon} size={icon} weight="bold" />}
    </button>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function ExamplesSection() {
  return (
    <div className="w-full max-w-5xl flex flex-col gap-12">
      <div className="flex items-baseline gap-4">
        <p className="text-xs font-semibold tracking-widest uppercase text-white/30">30 feels</p>
        <p className="text-xs text-white/15">hover · click · hold to explore</p>
      </div>

      {CATEGORIES.map(cat => {
        const items = EXAMPLES.filter(e => e.category === cat);
        return (
          <div key={cat} className="flex flex-col gap-5">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-white/20">{cat}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-6 items-end">
              {items.map(e => (
                <div key={e.id} className="flex flex-col items-center gap-2">
                  <ExampleButton params={e} />
                  <span className="text-[10px] text-white/20 font-medium tracking-wide">{e.vibe}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
