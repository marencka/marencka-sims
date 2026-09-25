import { career, skills, traits, motives, wants, fears, ui } from "./content.js";
import { ready } from "./boot.js";

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls) => Object.assign(document.createElement(tag), cls ? { className: cls } : {});

const arrows = (v) =>
  v >= 75 ? ["", "▸▸"] : v >= 45 ? ["", "▸"] : v >= 25 ? ["◂", ""] : ["◂◂", ""];

const mood = (v) =>
  v >= 85 ? "Great" : v >= 65 ? "Good" : v >= 45 ? "Fine" : v >= 25 ? "Low" : "Desperate";

function ambitionBar(level) {
  const wrap = el("div", "ambit");
  wrap.dataset.tip = ui.panel.ambition;
  wrap.dataset.tipSub = `${level} of 10`;

  const track = el("div", "ambit__track");
  track.setAttribute("role", "meter");
  track.setAttribute("aria-valuenow", level);
  track.setAttribute("aria-valuemin", 0);
  track.setAttribute("aria-valuemax", 10);
  track.setAttribute("aria-label", ui.panel.ambition);
  track.setAttribute("aria-valuetext", `${level} of 10`);

  const fill = el("div", "ambit__fill");
  track.append(fill);
  ready.then(() => setTimeout(() => { fill.style.width = level * 10 + "%"; }, 140));

  wrap.append(track);
  return wrap;
}

function traitSlider({ low, high, level }, { at = 0 } = {}) {
  const lead = level >= 5 ? high : low;
  const row = el("div", "trait");
  row.dataset.tip = `${low} \u2013 ${high}`;
  row.dataset.tipSub = `${lead}, ${level} of 10`;

  const pole = (text, side) => {
    const n = Object.assign(el("span", `trait__pole trait__pole--${side}`), { textContent: text });
    if (text === lead) n.classList.add("is-lead");
    return n;
  };

  const track = el("div", "trait__track");
  track.setAttribute("role", "meter");
  track.setAttribute("aria-valuenow", level);
  track.setAttribute("aria-valuemin", 0);
  track.setAttribute("aria-valuemax", 10);
  track.setAttribute("aria-label", `${low} to ${high}`);
  track.setAttribute("aria-valuetext", `${level} of 10 toward ${high}`);

  const fill = el("div", "trait__fill");
  const thumb = el("div", "trait__thumb");
  track.append(fill, thumb);

  ready.then(() => setTimeout(() => {
    fill.style.width = level * 10 + "%";
    thumb.style.left = level * 10 + "%";
  }, at));

  row.append(pole(low, "low"), track, pole(high, "high"));
  return row;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

const workdayNames = () =>
  career.workdays.map((d) => DAYS[d]).join(", ");

function scheduleStrip() {
  const today = new Date().getDay();
  const strip = el("div", "career__days");
  strip.setAttribute("role", "img");
  strip.setAttribute("aria-label", `Works ${workdayNames()}, ${career.hours}`);
  DAY_INITIALS.forEach((letter, d) => {
    const cell = el("span", "career__day");
    cell.classList.toggle("is-work", career.workdays.includes(d));
    cell.classList.toggle("is-today", d === today);
    cell.textContent = letter;
    strip.append(cell);
  });
  return strip;
}

function pipTrack(level, { name, unit, at = 0 }) {
  const track = el("span", "meter__track");
  track.setAttribute("role", "meter");
  track.setAttribute("aria-valuenow", level);
  track.setAttribute("aria-valuemin", 0);
  track.setAttribute("aria-valuemax", 10);
  track.setAttribute("aria-label", `${name}, ${unit} ${level} of 10`);
  for (let i = 0; i < 10; i++) {
    const seg = el("i", "meter__seg");
    track.append(seg);
    if (i < level) ready.then(() => setTimeout(() => seg.classList.add("is-filled"), at + i * 40));
  }
  return track;
}

function meterList(rows, { unit, delay = 0 } = {}) {
  const list = el("div", "meters");
  rows.forEach(({ name, level }, r) => {
    const row = el("div", "meter");
    row.dataset.tip = name;
    row.dataset.tipSub = `${unit} ${level} of 10`;
    row.append(
      Object.assign(el("span", "meter__label"), { textContent: name }),
      pipTrack(level, { name, unit, at: delay + 120 + r * 70 })
    );
    list.append(row);
  });
  return list;
}

function factRow(label, value) {
  const row = el("div", "fact");
  const cell = el("span", "fact__value");
  cell.append(value);
  row.append(Object.assign(el("span", "fact__label"), { textContent: label }), cell);
  return row;
}

const views = {
  motives: {
    head: "Needs",
    render(mount) {
      const grid = el("div", "needs");
      motives.forEach(({ name, value }, i) => {
        const [dn, up] = arrows(value);
        const cell = el("div", "need");
        cell.dataset.tip = name;
        cell.dataset.tipSub = `${mood(value)} · ${value}%`;
        cell.innerHTML = `
          <span class="need__label">${name}</span>
          <div class="need__row">
            <span class="need__arrow need__arrow--down">${dn}</span>
            <div class="need__track" role="meter" aria-valuenow="${value}"
                 aria-valuemin="0" aria-valuemax="100" aria-label="${name}">
              <div class="need__fill" style="width:0"></div>
            </div>
            <span class="need__arrow need__arrow--up">${up}</span>
          </div>`;
        grid.append(cell);

        const fill = cell.querySelector(".need__fill");
        fill.style.backgroundPosition = `${value}% 0`;
        ready.then(() =>
          requestAnimationFrame(() =>
            setTimeout(() => { fill.style.width = value + "%"; }, 60 * i)));
      });
      mount.append(grid);
    }
  },

  career: {
    head: "Career",
    render(mount) {
      const box = el("div", "career");

      const head = el("div", "job__head");
      if (career.logo) {
        head.append(Object.assign(el("img", "job__logo"), {
          src: `assets/${career.logo}`, alt: career.employer, decoding: "async"
        }));
      }
      head.append(Object.assign(el("h2", "job__title"), { textContent: career.title }));

      const facts = el("div", "facts");
      facts.append(
        ...[
          [ui.panel.company,  career.employer],
          [ui.panel.team,     career.team],
          [ui.panel.since,    career.since],
          [ui.panel.schedule, scheduleStrip()],
          [ui.panel.hours,    career.hours]
        ].filter(([, value]) => value).map(([label, value]) => factRow(label, value))
      );

      const side = el("div", "job__side");
      side.append(
        Object.assign(el("h3", "job__sidehead"), { textContent: ui.panel.ambition }),
        ambitionBar(career.ambition)
      );
      if (career.next) {
        const next = el("p", "job__next");
        next.append(
          Object.assign(el("span", "job__nextlabel"), { textContent: ui.panel.next + ":"}),
          career.next
        );
        side.append(next);
      }

      box.append(head, facts, side);
      mount.append(box);
    }
  },

  skills: {
    head: "Skills",
    render(mount) {
      const box = el("div", "skillpage");

      const left = el("div", "skillpage__col");
      left.append(
        Object.assign(el("h3", "col__head"), { textContent: ui.panel.skills }),
        meterList(skills, { unit: "Level" })
      );

      const rows = el("div", "traits");
      traits.forEach((t, i) => rows.append(traitSlider(t, { at: 200 + i * 70 })));

      const right = el("div", "skillpage__col");
      right.append(
        Object.assign(el("h3", "col__head"), { textContent: ui.panel.traits }),
        rows
      );

      box.append(left, right);
      mount.append(box);
    }
  }
};

const hud = $(".hud");
const tabs = [...document.querySelectorAll(".tab")];
const body = $("#panel-body");
const head = $("#panel-head");

export function show(name) {
  const view = views[name];
  if (!view) return;

  hud.dataset.tab = name;
  tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)));

  head.textContent = view.head;
  body.replaceChildren();
  body.setAttribute("aria-label", view.head);
  view.render(body);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => show(tab.dataset.tab));
});

$("[role=tablist]")?.addEventListener("keydown", (e) => {
  const i = tabs.indexOf(document.activeElement);
  if (i < 0) return;
  const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
  if (!step) return;
  e.preventDefault();
  const next = tabs[(i + step + tabs.length) % tabs.length];
  next.focus();
  show(next.dataset.tab);
});

function renderTiles(mount, items, kind) {
  items.forEach(({ img, label, points }) => {
    const tile = el("button", "tile");
    tile.dataset.kind = kind;
    tile.type = "button";
    tile.setAttribute("aria-label", `${label}, ${points > 0 ? "+" : ""}${points} points`);
    tile.dataset.tip = label;
    tile.dataset.tipSub = `${points > 0 ? "+" : ""}${points.toLocaleString()} Aspiration`;
    tile.innerHTML = `<img class="tile__art" src="assets/${img}.webp" alt="" decoding="async">
      <span class="tile__pts">${Math.round(Math.abs(points) / 1000)}</span>`;
    mount.append(tile);
  });
}

function tick() {
  const d = new Date();
  let h = d.getHours();
  const ampm = h < 12 ? "am" : "pm";
  h = h % 12 || 12;
  $("#clock").textContent =
    `${DAYS[d.getDay()]} ${h}:${String(d.getMinutes()).padStart(2, "0")} ${ampm}`;
}

tick();
setInterval(tick, 10_000);

renderTiles($("#wants"), wants, "want");
renderTiles($("#fears"), fears, "fear");
show("motives");
