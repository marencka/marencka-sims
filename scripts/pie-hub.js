const RING = 24;
const SHEET = 25;
const NEUTRAL = 24;
const STEP = 360 / RING;

const EASE = 0.18;
const SETTLED = 0.4;

const reduced = matchMedia("(prefers-reduced-motion: reduce)");

const delta = (from, to) => ((to - from + 540) % 360) - 180;

export function createHub() {
  const el = document.createElement("div");
  el.className = "pie__hub";
  el.setAttribute("aria-hidden", "true");

  let target = 0;
  let shown = 0;
  let frame = -1;
  let raf = 0;
  let straight = true;

  function paint() {
    const i = straight
      ? NEUTRAL
      : (Math.round(shown / STEP) % RING + RING) % RING;
    if (i === frame) return;
    frame = i;
    el.style.backgroundPositionX = `${(i * 100) / (SHEET - 1)}%`;
  }

  function step() {
    const d = delta(shown, target);
    if (Math.abs(d) < SETTLED) {
      shown = target;
      raf = 0;
      paint();
      return;
    }
    shown += d * EASE;
    paint();
    raf = requestAnimationFrame(step);
  }

  return {
    el,

    setAngle(angle) {
      target = ((angle % 360) + 360) % 360;
      if (straight) {
        straight = false;
        shown = target;
        paint();
        return;
      }
      if (reduced.matches) {
        shown = target;
        paint();
        return;
      }
      if (!raf) raf = requestAnimationFrame(step);
    },

    neutral() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      straight = true;
      paint();
    },

    stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}
