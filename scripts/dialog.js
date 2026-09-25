import { ui } from "./content.js";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

const views = new Map();
let root, box, titleEl, bodyEl, footEl;
let openId = null;
let opener = null;

export function registerView(id, view) {
  views.set(id, view);
}

function build() {
  root = document.createElement("div");
  root.className = "dialog-scrim";
  root.hidden = true;
  root.innerHTML = `
    <div class="dialog panel" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div class="dialog__box">
        <h2 class="dialog__title" id="dialog-title"></h2>
        <div class="dialog__body"></div>
      </div>
      <div class="dialog__foot"></div>
    </div>`;
  document.body.append(root);

  box = root.querySelector(".dialog");
  titleEl = root.querySelector(".dialog__title");
  bodyEl = root.querySelector(".dialog__body");
  footEl = root.querySelector(".dialog__foot");

  root.addEventListener("mousedown", (e) => { if (e.target === root) requestClose(); });
  document.addEventListener("keydown", onKeydown);
}

function lockScroll() {
  const de = document.documentElement;
  if (window.innerWidth - de.clientWidth > 0) de.style.scrollbarGutter = "stable";
  de.classList.add("has-dialog");
}

function unlockScroll() {
  const de = document.documentElement;
  de.classList.remove("has-dialog");
  de.style.scrollbarGutter = "";
}

function onKeydown(e) {
  if (!openId) return;
  if (e.key === "Escape") { e.preventDefault(); requestClose(); return; }
  if (e.key !== "Tab") return;

  const items = [...box.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];

  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  else if (!box.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
}

function okRow() {
  const row = document.createElement("div");
  row.className = "dialog__actions";
  const btn = document.createElement("button");
  btn.className = "dialog__btn";
  btn.type = "button";
  btn.textContent = ui.ok;
  btn.addEventListener("click", requestClose);
  row.append(btn);
  return row;
}

function requestClose() {
  root.dispatchEvent(new CustomEvent("dialog:dismiss", { bubbles: true }));
}

export function openDialog(id, params = {}) {
  const view = views.get(id);
  if (!view) return false;
  if (!root) build();

  const wasOpen = openId !== null;
  if (!wasOpen) opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  openId = id;
  root.dataset.view = id;
  titleEl.textContent = typeof view.title === "function" ? view.title(params) : view.title;
  bodyEl.replaceChildren(view.render(params));
  bodyEl.scrollTop = 0;
  footEl.replaceChildren(bodyEl.querySelector(".dialog__actions") || okRow());

  root.hidden = false;
  if (!wasOpen) lockScroll();

  const scrolls = bodyEl.scrollHeight > bodyEl.clientHeight;
  if (scrolls) bodyEl.tabIndex = -1; else bodyEl.removeAttribute("tabindex");

  const target = box.querySelector("[data-autofocus]") ||
                 (scrolls ? bodyEl : null) ||
                 bodyEl.querySelector(FOCUSABLE) ||
                 box.querySelector(FOCUSABLE) || box;
  if (target === box) box.tabIndex = -1;
  target.focus();
  return true;
}

export function closeDialog() {
  if (!openId) return;
  openId = null;
  root.hidden = true;
  bodyEl.replaceChildren();
  footEl.replaceChildren();
  unlockScroll();
  if (opener && document.contains(opener)) opener.focus();
  opener = null;
}

export function currentDialog() {
  return openId;
}

export function onDismiss(fn) {
  if (!root) build();
  root.addEventListener("dialog:dismiss", fn);
}
