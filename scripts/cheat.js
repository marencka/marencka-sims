import { funds, cheats } from "./content.js";

const pill = document.querySelector(".r-simoleon");
const out = document.getElementById("funds");

function load() {
  try {
    const saved = parseInt(localStorage.getItem(funds.key), 10);
    if (Number.isFinite(saved)) return saved;
  } catch (e) {  }
  return funds.start;
}

function save(n) {
  try { localStorage.setItem(funds.key, String(n)); } catch (e) {  }
}

let balance = load();

const money = (n) => `§${n.toLocaleString("en-US")}`;

const TICK = 900;

function render(n) {
  if (out) out.textContent = money(n);
}

let raf = 0;

function countTo(from, to) {
  cancelAnimationFrame(raf);
  raf = 0;

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || document.hidden || from === to) return render(to);

  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / TICK);
    const e = 1 - Math.pow(1 - p, 3);
    render(Math.round(from + (to - from) * e));
    raf = p < 1 ? requestAnimationFrame(step) : 0;
  };
  raf = requestAnimationFrame(step);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;
  cancelAnimationFrame(raf);
  raf = 0;
  render(balance);
});

function add(amount) {
  const from = balance;
  balance += amount;
  save(balance);
  countTo(from, balance);

  if (pill) {
    pill.classList.remove("is-paid");
    void pill.offsetWidth;
    pill.classList.add("is-paid");
  }
}

render(balance);

let current = null;

function open() {
  if (current) return current.input.focus();

  const box = document.createElement("div");
  box.className = "cheat";
  box.innerHTML = `
    <input class="cheat__input" type="text" spellcheck="false" autocomplete="off"
           autocapitalize="off" autocorrect="off" aria-label="${cheats.label}">
    <p class="cheat__out" role="status"></p>`;
  document.body.append(box);

  const input = box.querySelector(".cheat__input");
  const line = box.querySelector(".cheat__out");
  const keys = new AbortController();

  const prev = document.activeElement;

  function close() {
    if (current !== handle) return;
    current = null;
    keys.abort();
    box.remove();
    if (prev && prev.isConnected) prev.focus();
  }

  const handle = { input, close };
  current = handle;

  function run() {
    const cmd = input.value.trim().toLowerCase();
    if (!cmd) return;

    const hit = cheats.commands[cmd];
    if (!hit) {
      line.textContent = cheats.error(cmd);
      line.classList.add("is-error");
      input.select();
      return;
    }

    close();
    add(hit.amount);
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); run(); }
    if (e.key === "Escape") { e.preventDefault(); close(); }
    if (line.textContent && e.key.length === 1) {
      line.textContent = "";
      line.classList.remove("is-error");
    }
  });

  addEventListener("pointerdown", (e) => {
    if (!box.contains(e.target)) close();
  }, { signal: keys.signal });

  input.focus();
  return handle;
}

addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey && e.code === "KeyC") {
    e.preventDefault();
    open();
  }
});
