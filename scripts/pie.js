import { pieVerbs } from "./content.js";
import { createHub } from "./pie-hub.js";
import { currentDialog } from "./dialog.js";
import { raise } from "./notice.js";

const FINE = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 821px)");

const CHROME = ".hud, .dialog-scrim, .notice, .boot, .tip";

const EDGE = 10;
const DEAD = 0.55;

let root, hub, items = [];
let open = false;
let anchor = { x: 0, y: 0 };
let sel = -1;

function build() {
  root = document.createElement("div");
  root.className = "pie";
  root.hidden = true;
  root.setAttribute("role", "menu");

  hub = createHub();
  root.append(hub.el);

  items = pieVerbs.map((verb, i) => {
    const pill = document.createElement("button");
    pill.className = "pie__item";
    pill.type = "button";
    pill.setAttribute("role", "menuitem");
    pill.tabIndex = -1;
    pill.innerHTML =
      '<span class="pie__knob" aria-hidden="true"></span>' +
      '<span class="pie__face" aria-hidden="true"></span>' +
      '<span class="pie__label"></span>';
    pill.querySelector(".pie__label").textContent = verb.label;
    pill.addEventListener("click", (e) => {
      e.stopPropagation();
      if (open) pick(i);
    });

    root.append(pill);
    return { verb, pill };
  });

  document.body.append(root);
}

function radii() {
  const s = getComputedStyle(root);
  return {
    rx: parseFloat(s.getPropertyValue("--pie-rx")),
    ry: parseFloat(s.getPropertyValue("--pie-ry"))
  };
}

function layout() {
  const { rx, ry } = radii();
  const n = items.length;

  items.forEach(({ pill }, i) => {
    const t = (i * 2 * Math.PI) / n;
    const kx = rx * Math.sin(t);
    const ky = -ry * Math.cos(t);

    const vertical = Math.abs(Math.sin(t)) < 0.05;
    if (vertical) {
      pill.style.left = "0px";
      pill.style.top = `${ky}px`;
      pill.dataset.side = Math.cos(t) > 0 ? "top" : "bottom";
    } else {
      pill.style.left = `${kx}px`;
      pill.style.top = `${ky}px`;
      pill.dataset.side = Math.sin(t) > 0 ? "right" : "left";
    }
  });
}

function clampToViewport() {
  let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
  items.forEach(({ pill }) => {
    const box = pill.getBoundingClientRect();
    l = Math.min(l, box.left); t = Math.min(t, box.top);
    r = Math.max(r, box.right); b = Math.max(b, box.bottom);
  });

  let dx = 0, dy = 0;
  if (r > innerWidth - EDGE) dx = innerWidth - EDGE - r;
  if (l + dx < EDGE) dx = EDGE - l;
  if (b > innerHeight - EDGE) dy = innerHeight - EDGE - b;
  if (t + dy < EDGE) dy = EDGE - t;

  if (dx || dy) {
    anchor = { x: anchor.x + dx, y: anchor.y + dy };
    root.style.left = `${anchor.x}px`;
    root.style.top = `${anchor.y}px`;
  }
}

function select(i) {
  if (i === sel) return;
  if (sel >= 0) delete items[sel].pill.dataset.on;
  sel = i;
  if (sel >= 0) items[sel].pill.dataset.on = "";
}

function track(x, y) {
  const dx = x - anchor.x;
  const dy = y - anchor.y;
  const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
  hub.setAngle(angle);

  const { rx } = radii();
  if (Math.hypot(dx, dy) < rx * DEAD) {
    select(-1);
    return;
  }
  const n = items.length;
  select((Math.round(((angle % 360) + 360) % 360 / (360 / n)) % n + n) % n);
}

function openPie(x, y) {
  if (!root) build();
  anchor = { x, y };
  root.style.left = `${x}px`;
  root.style.top = `${y}px`;
  root.hidden = false;
  open = true;
  sel = -1;
  layout();
  clampToViewport();
  hub.neutral();
  requestAnimationFrame(() => root.dataset.in = "");
}

function closePie() {
  if (!open) return;
  open = false;
  select(-1);
  hub.stop();
  delete root.dataset.in;
  root.hidden = true;
}

function pick(i) {
  const { verb } = items[i];
  closePie();
  if (verb.go) location.hash = verb.go;
  else if (verb.say) raise({ text: verb.say });
}

document.addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  if (!FINE.matches) { closePie(); return; }

  if (open) {
    if (e.target.closest?.(CHROME)) { closePie(); return; }
    track(e.clientX, e.clientY);
    e.preventDefault();
    if (sel >= 0) pick(sel);
    else closePie();
    return;
  }

  if (currentDialog()) return;
  if (e.target.closest?.(CHROME)) return;
  if (document.documentElement.dataset.intro !== "seen" &&
      document.querySelector(".boot")) return;

  openPie(e.clientX, e.clientY);
});

document.addEventListener("pointermove", (e) => {
  if (open) track(e.clientX, e.clientY);
}, { passive: true });

document.addEventListener("keydown", (e) => {
  if (!open) return;
  if (e.key === "Escape") { e.preventDefault(); closePie(); return; }

  const n = items.length;
  if (e.key === "Enter" || e.key === " ") {
    if (sel >= 0) { e.preventDefault(); pick(sel); }
    return;
  }
  const back = e.key === "ArrowLeft" || e.key === "ArrowUp";
  const fwd = e.key === "ArrowRight" || e.key === "ArrowDown";
  if (!back && !fwd) return;
  e.preventDefault();
  const next = sel < 0 ? (fwd ? 0 : n - 1) : (sel + (fwd ? 1 : -1) + n) % n;
  select(next);
  hub.setAngle((next * 360) / n);
});

addEventListener("blur", closePie);
addEventListener("resize", closePie);
addEventListener("scroll", closePie, { passive: true, capture: true });
