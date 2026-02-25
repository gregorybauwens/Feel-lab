import { useState, useRef } from "react";

const imgArrowUp = "http://localhost:3845/assets/f8845cee014aeff89139faf8159018e0396bd390.svg";

export function ShareButton({ children = "Share with friends around the world", className = "", ...props }) {
  return (
    <button
      className={[
        "group relative inline-flex items-center gap-6 px-1 cursor-pointer outline-none bg-transparent border-0",
        "font-['TWK_Lausanne',sans-serif] font-[450] text-[18px] tracking-[0.09px]",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      <span
        className="absolute inset-0 rounded-[2px] bg-[#ecb300] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        aria-hidden
      />
      <span className="relative leading-8 whitespace-nowrap text-[#ecb300] group-hover:text-black transition-colors duration-150">
        {children}
      </span>
      <span className="relative -rotate-90 size-6 shrink-0 flex items-center justify-center" aria-hidden>
        <img src={imgArrowUp} alt="" className="size-full" />
      </span>
    </button>
  );
}

const variants = {
  primary: {
    base: "bg-indigo-500 text-white shadow-indigo-500/40",
    hover: "hover:bg-indigo-400 hover:shadow-indigo-400/50",
    active: "active:bg-indigo-600",
    ring: "focus-visible:ring-indigo-500",
    ripple: "bg-white/30",
  },
  success: {
    base: "bg-emerald-500 text-white shadow-emerald-500/40",
    hover: "hover:bg-emerald-400 hover:shadow-emerald-400/50",
    active: "active:bg-emerald-600",
    ring: "focus-visible:ring-emerald-500",
    ripple: "bg-white/30",
  },
  danger: {
    base: "bg-rose-500 text-white shadow-rose-500/40",
    hover: "hover:bg-rose-400 hover:shadow-rose-400/50",
    active: "active:bg-rose-600",
    ring: "focus-visible:ring-rose-500",
    ripple: "bg-white/30",
  },
  warning: {
    base: "bg-amber-400 text-amber-950 shadow-amber-400/40",
    hover: "hover:bg-amber-300 hover:shadow-amber-300/50",
    active: "active:bg-amber-500",
    ring: "focus-visible:ring-amber-400",
    ripple: "bg-amber-900/20",
  },
  ghost: {
    base: "bg-white/8 text-white/80 border border-white/12 shadow-none",
    hover: "hover:bg-white/14 hover:text-white",
    active: "active:bg-white/5",
    ring: "focus-visible:ring-white/40",
    ripple: "bg-white/20",
  },
};

const sizes = {
  sm: "h-9 px-4 text-sm gap-1.5 rounded-xl",
  md: "h-12 px-6 text-[15px] gap-2 rounded-2xl",
  lg: "h-14 px-8 text-base gap-2.5 rounded-2xl",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-[22px] h-[22px]",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  const [ripples, setRipples] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const btnRef = useRef(null);
  const v = variants[variant];

  const addRipple = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  };

  const handleClick = (e) => {
    addRipple(e);
    onClick?.(e);
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
      className={[
        // layout
        "relative inline-flex items-center justify-center overflow-hidden select-none",
        "font-semibold tracking-[0.01em] cursor-pointer outline-none",
        // size
        sizes[size],
        // variant colors
        v.base,
        v.hover,
        v.active,
        // shadow
        "shadow-lg hover:shadow-xl",
        // transitions
        "transition-all duration-150 ease-out",
        // hover lift
        "hover:-translate-y-0.5 hover:scale-[1.03]",
        // press
        isPressed ? "scale-[0.97] translate-y-px shadow-sm" : "",
        // focus ring
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        v.ring,
        // disabled
        disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {/* Shimmer sweep on hover */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[inherit]
          bg-[linear-gradient(105deg,transparent_30%,rgba(255,255,255,0.18)_50%,transparent_70%)]
          bg-[length:200%_100%] bg-[-100%_0]
          transition-[background-position] duration-[0ms]
          hover:bg-[200%_0] hover:duration-500"
        aria-hidden
      />

      {/* Ripple container */}
      {ripples.map(({ id, x, y, size }) => (
        <span
          key={id}
          className={`pointer-events-none absolute rounded-full ${v.ripple} animate-ripple`}
          style={{ left: x, top: y, width: size, height: size }}
          aria-hidden
        />
      ))}

      {/* Leading icon */}
      {leadingIcon && (
        <span
          className={`${iconSizes[size]} flex items-center justify-center shrink-0
            transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            group-hover:-translate-x-0.5`}
          aria-hidden
        >
          {leadingIcon}
        </span>
      )}

      {/* Label */}
      <span className="relative z-10">{children}</span>

      {/* Trailing icon */}
      {trailingIcon && (
        <span
          className={`${iconSizes[size]} flex items-center justify-center shrink-0
            transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            group-hover:translate-x-0.5`}
          aria-hidden
        >
          {trailingIcon}
        </span>
      )}
    </button>
  );
}
