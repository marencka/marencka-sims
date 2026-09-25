const KEY = "marencka:intro@1";

const SCRIPT = [
  { to: 9,   ms: 240, text: "Reticulating splines…" },
  { to: 18,  ms: 360, text: "Loading Alexis…" },
  { to: 31,  ms: 280, text: "Brewing caffeine…" },
  { to: 38,  ms: 460, text: "Untangling the yarn skein..." },
  { to: 54,  ms: 260, text: "Charging social battery…" },
  { to: 61,  ms: 540, text: "Compiling Chromium (this one always takes a while)…" },
  { to: 73,  ms: 240, text: "Resolving merge conflict…" },
  { to: 85,  ms: 300, text: "Watching tonight's sunset…" },
  { to: 100, ms: 200, text: "Rendering Alexis..." }
];

const root = document.querySelector(".boot");
const play = window.__intro === "play" && root;

let resolveReady;
export const ready = new Promise((res) => { resolveReady = res; });

if (!play) {
  root?.remove();
  resolveReady();
} else {
  runIntro(root).catch(() => root.remove()).finally(resolveReady);
}

async function runIntro(el) {
  const fill = el.querySelector(".boot__fill");
  const pct = el.querySelector(".boot__pct");
  const status = el.querySelector(".boot__status");
  const hud = document.querySelector(".hud");

  if (hud) hud.inert = true;
  document.documentElement.classList.add("is-booting");

  let skipped = false;
  let finishStep = null;
  const skip = () => { skipped = true; finishStep?.(); };

  const keys = new AbortController();
  el.addEventListener("click", skip);
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Enter") skip();
  }, { signal: keys.signal });

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const run = (from, to, ms) =>
    tween(fill, pct, from, to, ms, (abort) => { finishStep = abort; });

  if (reduced) {
    status.textContent = "Loading Alexis…";
    await run(0, 100, 400);
  } else {
    let from = 0;
    for (const step of SCRIPT) {
      if (skipped) break;
      status.textContent = step.text;
      await run(from, step.to, step.ms);
      from = step.to;
    }
    if (skipped) await run(Number(pct.dataset.v || 0), 100, 180);
  }
  finishStep = null;
  keys.abort();

  await wait(reduced ? 200 : 420);

  el.classList.add("is-done");
  await wait(reduced ? 0 : 520);
  el.remove();

  if (hud) hud.inert = false;
  document.documentElement.classList.remove("is-booting");
  try { localStorage.setItem(KEY, String(Date.now())); } catch {  }
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function tween(fill, pct, from, to, ms, expose) {
  return new Promise((resolve) => {
    const t0 = performance.now();
    let done = false;

    const set = (v) => {
      fill.style.width = v + "%";
      pct.textContent = Math.round(v) + "%";
      pct.dataset.v = v;
    };

    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(guard);
      set(to);
      resolve();
    };

    const frame = (now) => {
      if (done) return;
      const p = Math.min(1, (now - t0) / ms);
      if (p < 1) { set(from + (to - from) * p); requestAnimationFrame(frame); }
      else finish();
    };

    const guard = setTimeout(finish, ms + 60);

    expose?.(finish);
    requestAnimationFrame(frame);
  });
}
