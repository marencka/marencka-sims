import { notice } from "./content.js";
import { ready } from "./boot.js";
import { show } from "./hud.js";

const BEAT = 900;

let current = null;

const COMPACT = matchMedia("(max-width: 820px)");

if (window.__intro === "play") {
  ready.then(() => setTimeout(() => raise(notice), BEAT));
}

export function raise(msg) {
  if (msg.mobile && COMPACT.matches) msg = { ...msg, ...msg.mobile };
  if (current) current.dismiss();

  const el = document.createElement("div");
  el.className = "notice";
  el.setAttribute("role", "status");

  const tip = (msg.tab || msg.go) ? ` data-tip="${msg.cta}" data-tip-sub="${msg.ctaSub}"` : "";
  el.innerHTML = `
    <button class="notice__text" type="button"${tip}>${msg.text}</button>
    <div class="notice__pfp">
      <img class="notice__sim" src="${msg.portrait || notice.portrait}" alt="">
    </div>
    <button class="notice__close" type="button" data-tip="${msg.close || notice.close}">
      <span class="sr">${msg.close || notice.close}</span>
    </button>`;
  document.body.append(el);

  const keys = new AbortController();

  function dismiss() {
    if (current !== handle) return;
    current = null;
    keys.abort();
    el.classList.add("is-going");
    el.addEventListener("animationend", () => el.remove(), { once: true });
    setTimeout(() => el.remove(), 400);
  }

  const handle = { dismiss };
  current = handle;

  el.querySelector(".notice__close").addEventListener("click", dismiss);

  el.querySelector(".notice__text").addEventListener("click", () => {
    if (msg.tab) show(msg.tab);
    else if (msg.go) location.hash = msg.go;
    dismiss();
  });

  addEventListener("keydown", (e) => {
    if (e.key === "Escape") dismiss();
  }, { signal: keys.signal });

  return handle;
}
