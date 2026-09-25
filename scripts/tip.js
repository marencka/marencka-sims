const DELAY = 240;
const GAP   = 10;
const EDGE  = 6;

const tip = document.createElement("div");
tip.className = "tip";
tip.setAttribute("aria-hidden", "true");
document.body.append(tip);

let timer = 0;
let shown = null;
let pending = null;

function place(el) {
  const r = el.getBoundingClientRect();
  const t = tip.getBoundingClientRect();

  const x = Math.min(
    Math.max(r.left + r.width / 2 - t.width / 2, EDGE),
    window.innerWidth - t.width - EDGE
  );

  let y = r.top - t.height - GAP;
  if (y < EDGE) y = Math.min(r.bottom + GAP, window.innerHeight - t.height - EDGE);

  tip.style.translate = `${Math.round(x)}px ${Math.round(y)}px`;
}

function show(el) {
  tip.textContent = el.dataset.tip;
  if (el.dataset.tipSub) {
    const sub = document.createElement("span");
    sub.className = "tip__sub";
    sub.textContent = el.dataset.tipSub;
    tip.append(sub);
  }
  place(el);
  tip.dataset.show = "";
  shown = el;
}

function hide() {
  clearTimeout(timer);
  timer = 0;
  pending = null;
  if (!shown) return;
  shown = null;
  delete tip.dataset.show;
}

function arm(el, delay) {
  if (el === shown || el === pending) return;
  hide();
  if (!delay) { show(el); return; }
  pending = el;
  timer = setTimeout(() => { pending = null; show(el); }, delay);
}

document.addEventListener("pointerover", (e) => {
  if (e.pointerType === "touch") return;
  const el = e.target.closest?.("[data-tip]");
  if (el) arm(el, DELAY); else hide();
});

document.addEventListener("focusin", (e) => {
  const el = e.target.closest?.("[data-tip]");
  if (el && el.matches(":focus-visible")) arm(el, 0); else hide();
});

document.addEventListener("focusout", hide);
document.addEventListener("pointerdown", hide);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
window.addEventListener("blur", hide);
window.addEventListener("resize", hide);
window.addEventListener("scroll", hide, { passive: true, capture: true });
