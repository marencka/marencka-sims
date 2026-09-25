import { projects, about, contact, resume, source, ui, NAV_ROUTES } from "./content.js";
import { registerView, openDialog, closeDialog, currentDialog, onDismiss } from "./dialog.js";
import { track } from "./analytics.js";

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

registerView("resume", {
  title: ui.titles.resume,
  render() {
    const frag = document.createDocumentFragment();
    frag.append(el("p", "dialog__lede", resume.note));
    const row = el("div", "dialog__actions");
    resume.links.forEach(({ label, href, newTab, download }) => {
      const a = el("a", "dialog__btn panel", label);
      a.href = href;
      if (newTab)   { a.target = "_blank"; a.rel = "noopener"; }
      if (download) a.setAttribute("download", download);
      a.addEventListener("click", () => {
        track("resume_view", { method: download ? "download" : "open" });
      });
      row.append(a);
    });
    frag.append(row);
    return frag;
  }
});

registerView("projects", {
  title: ui.titles.projects,
  render() {
    const frag = document.createDocumentFragment();
    frag.append(el("p", "dialog__lede", ui.projectsIntro));
    const list = el("ul", "plist");
    projects.forEach((p) => {
      const li = el("li");
      const a = el("a", "plist__item panel");
      a.href = `#/projects/${p.id}`;
      a.append(el("span", "plist__name", p.name), el("span", "plist__tag", p.tag));
      li.append(a);
      list.append(li);
    });
    frag.append(list);
    return frag;
  }
});

registerView("project", {
  title: ({ project }) => project.name,
  render({ project }) {
    const frag = document.createDocumentFragment();
    frag.append(el("p", "dialog__tag", project.tag), el("p", "dialog__prose", project.blurb));
    const row = el("div", "dialog__actions");
    const back = el("a", "dialog__btn panel", ui.backToProjects);
    back.href = "#/projects";
    back.dataset.autofocus = "";
    row.append(back);
    if (project.link) {
      const out = el("a", "dialog__btn panel", ui.visitProject);
      out.href = project.link;
      out.target = "_blank";
      out.rel = "noopener";
      row.append(out);
    }
    frag.append(row);
    return frag;
  }
});

registerView("about", {
  title: ui.titles.about,
  render() {
    const frag = document.createDocumentFragment();
    about.forEach((para) => frag.append(el("p", "dialog__prose", para)));
    return frag;
  }
});

registerView("contact", {
  title: ui.titles.contact,
  render() {
    const frag = document.createDocumentFragment();
    frag.append(el("p", "dialog__lede", contact.intro));
    const dl = el("dl", "clist");
    contact.links.forEach(({ label, value, href }) => {
      const a = el("a", "clist__link", value);
      a.href = href;
      if (!href.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noopener"; }
      const dd = el("dd");
      dd.append(a);
      dl.append(el("dt", null, label), dd);
    });
    frag.append(dl);
    return frag;
  }
});

registerView("source", {
  title: ui.titles.source,
  render() {
    const frag = document.createDocumentFragment();
    frag.append(el("p", "dialog__lede", source.intro));

    frag.append(el("h3", "dialog__head", ui.sourceHeads.credits));

    const list = el("ul", "credits");
    source.credits.forEach(({ label, value, href, note }) => {
      const li = el("li", "credits__item");
      li.append(el("span", "credits__label", label));
      if (href) {
        const a = el("a", "clist__link credits__name", value);
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener";
        li.append(a);
      } else {
        li.append(el("span", "credits__name", value));
      }
      li.append(el("p", "credits__note", note));
      list.append(li);
    });
    frag.append(list);

    frag.append(el("h3", "dialog__head", ui.sourceHeads.build),
                el("p", "dialog__prose", source.buildIntro));

    const build = el("dl", "build");
    source.build.forEach(({ label, text }) => {
      const dd = el("dd", null, text);
      build.append(el("dt", null, label), dd);
    });
    frag.append(build);
    return frag;
  }
});

function resolve(hash) {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (!parts.length) return null;

  const [head, sub] = parts;
  if (head === "projects" && sub) {
    const project = projects.find((p) => p.id === sub);
    return project ? { id: "project", params: { project }, key: `project:${sub}` } : { id: "projects", key: "projects" };
  }
  return { id: head, params: {}, key: head };
}

let currentKey = null;

function route() {
  const match = resolve(location.hash);

  if (!match) {
    currentKey = null;
    closeDialog();
    return;
  }
  if (match.key === currentKey && currentDialog()) return;

  if (openDialog(match.id, match.params || {})) {
    currentKey = match.key;
    track("panel_open", { panel: match.key });
  } else {
    currentKey = null;
    closeDialog();
    history.replaceState(null, "", location.pathname + location.search + "#/");
  }
}

onDismiss(() => {
  currentKey = null;
  closeDialog();
  history.replaceState(null, "", location.pathname + location.search + "#/");
});

window.addEventListener("hashchange", route);
window.addEventListener("popstate", route);

document.querySelectorAll(".navbtn").forEach((btn) => {
  const href = NAV_ROUTES[btn.dataset.nav];
  if (!href) return;
  btn.addEventListener("click", () => {
    if (href.startsWith("#")) location.hash = href;
    else window.open(href, "_blank", "noopener");
  });
});

route();
