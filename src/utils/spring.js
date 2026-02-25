export function easeOut(t) { return 1 - (1 - t) ** 3; }

export function springAnimate({ from, to, bounce, durationMs, onUpdate, onComplete }) {
  const overshoot = bounce > 0 ? to + bounce / 100 : to;
  const start = performance.now();
  let handle;
  function tick(now) {
    const t = Math.min((now - start) / durationMs, 1);
    let val;
    if (bounce <= 0) { val = from + (to - from) * easeOut(t); }
    else if (t < 0.65) { val = from + (overshoot - from) * easeOut(t / 0.65); }
    else { val = overshoot + (to - overshoot) * easeOut((t - 0.65) / 0.35); }
    onUpdate(val);
    if (t < 1) handle = requestAnimationFrame(tick);
    else { onUpdate(to); onComplete?.(); }
  }
  handle = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(handle);
}
