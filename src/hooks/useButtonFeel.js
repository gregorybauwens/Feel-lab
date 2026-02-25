import { useRef } from "react";
import { springAnimate } from "../utils/spring";
import { playSound, releaseSound } from "../sounds/soundEngine";

/**
 * Shared spring-physics hook for all button variants.
 * getParams: () => params object  (always read fresh to avoid stale closures)
 */
export function useButtonFeel(getParams) {
  const p = () => (typeof getParams === "function" ? getParams() : getParams.current);

  const btnRef     = useRef(null);
  const scaleRef   = useRef(1);
  const cancelAnim = useRef(null);
  const isDownRef  = useRef(false);
  const isHovRef   = useRef(false);

  function applyScale(s) {
    scaleRef.current = s;
    if (btnRef.current) btnRef.current.style.transform = `scale(${s.toFixed(5)})`;
  }

  function applyShadow(state) {
    if (!btnRef.current) return;
    const { shadowDepth: s = 0.8, colorShift: c = 0.8 } = p();
    if (state === "pressed") {
      btnRef.current.style.boxShadow = `0 1px ${Math.round(s * 3)}px rgba(0,0,0,${(0.15 * s).toFixed(2)})`;
      btnRef.current.style.filter    = `brightness(${(1 - c * 0.13).toFixed(3)})`;
    } else if (state === "hover") {
      btnRef.current.style.boxShadow = `0 ${Math.round(s * 7)}px ${Math.round(s * 14)}px rgba(0,0,0,${(0.22 * s).toFixed(2)})`;
      btnRef.current.style.filter    = `brightness(${(1 + c * 0.09).toFixed(3)})`;
    } else {
      btnRef.current.style.boxShadow = `0 ${Math.round(s * 3)}px ${Math.round(s * 8)}px rgba(0,0,0,${(0.18 * s).toFixed(2)})`;
      btnRef.current.style.filter    = "brightness(1)";
    }
  }

  function go(to, { bounce = 0, ms }) {
    cancelAnim.current?.();
    cancelAnim.current = springAnimate({ from: scaleRef.current, to, bounce, durationMs: ms, onUpdate: applyScale });
  }

  function doRelease() {
    isDownRef.current = false;
    const { speed = 1, bounce = 0, hoverLift = 2, sound = "soft" } = p();
    releaseSound(sound);
    const toScale = isHovRef.current ? 1 + hoverLift / 100 : 1;
    applyShadow(isHovRef.current ? "hover" : "idle");
    go(toScale, { bounce, ms: 180 / speed });
  }

  const handlers = {
    onMouseEnter() {
      isHovRef.current = true;
      if (isDownRef.current) return;
      const { hoverLift = 2, speed = 1 } = p();
      applyShadow("hover");
      go(1 + hoverLift / 100, { ms: 120 / speed });
    },
    onMouseLeave() {
      isHovRef.current = false;
      if (isDownRef.current) { doRelease(); return; }
      applyShadow("idle");
      go(1, { ms: 150 / (p().speed ?? 1) });
    },
    onMouseDown() {
      if (p().disabled) return;
      isDownRef.current = true;
      const { pressDepth = 5, speed = 1, sound = "soft" } = p();
      playSound(sound);
      applyShadow("pressed");
      go(1 - pressDepth / 100, { ms: 90 / speed });
    },
    onMouseUp() {
      if (!isDownRef.current) return;
      doRelease();
    },
  };

  return { btnRef, handlers, applyShadow };
}
