/* First-party analytics for the case study. No cookies, no third parties and no typed text. Visitor and session ids
   live in localStorage. Everything else is measured here and sent as one growing record per page load.

   Session: ends after 30 minutes without activity, shared across tabs. ?me switches tracking off for this browser, ?notme back on.
   Active time counts only while the tab is visible and there was input in the last 60 seconds, because long-form reading has pauses. */

type Props = Record<string, string | number>;
let emit: (name: string, p?: Props) => void = () => {};

/** Record a named event from product code. Safe to call at any time. */
export const track = (name: string, p?: Props) => { try { emit(name, p); } catch { /* never break the page */ } };

const store = (k: string, v?: string | null) => {
  try {
    if (v === undefined) return localStorage.getItem(k);
    if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v);
  } catch { /* private mode */ }
  return null;
};
const rid = () => Math.random().toString(36).slice(2, 12).padEnd(10, "0");
const clip = (t: unknown, n = 70) => String(t ?? "").replace(/\s+/g, " ").trim().slice(0, n);
const IDLE = 60_000, MAX_EV = 430;
const INTERACTIVE = "a[href],button,summary,select,input,label,[role=button],[role=tab],[role=switch],[role=radio],[role=checkbox],[data-track]";
const CHARTY = "[role=img],.shot,.vt,[class*=vz],[class*=chart],[class*=stage]";
const CONTACTS: [RegExp, string][] = [[/linkedin\.com\/in\/praharsha/i, "linkedin"], [/mail\.google\.com|^mailto:/i, "email"], [/quickcall/i, "call"], [/praharsha\.s\.gy\/portfolio/i, "portfolio"]];
const contactOf = (href: string) => CONTACTS.find(([r]) => r.test(href))?.[1] ?? "";

function run() {
  const q = new URLSearchParams(location.search);
  if (q.has("me")) store("pn-me", "1");
  if (q.has("notme")) store("pn-me", null);
  const debug = q.has("pndebug");
  if (store("pn-me") || (!debug && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname))) return;

  /* ---------- who ---------- */
  const t0 = Date.now();
  let vid = store("pn-vid");
  const returning = !!vid;
  if (!vid) { vid = rid(); store("pn-vid", vid); store("pn-first", String(t0)); }
  const first = Number(store("pn-first")) || t0;
  let sid = store("pn-sid");
  const fresh = !sid || t0 - (Number(store("pn-last")) || 0) > 30 * 60_000;
  if (fresh) { sid = rid(); store("pn-sid", sid); store("pn-s0", String(t0)); store("pn-n", String((Number(store("pn-n")) || 0) + 1)); }
  const s0 = Number(store("pn-s0")) || t0, sn = Number(store("pn-n")) || 1;
  const touch = () => store("pn-last", String(Date.now()));
  touch();

  /* ---------- where from: this session's entry and the visitor's first ever touch ---------- */
  let rh = "";
  try { rh = document.referrer ? new URL(document.referrer).hostname : ""; } catch { /* bad referrer */ }
  if (rh === location.hostname) rh = "";
  const utm: Record<string, string> = {};
  for (const k of ["source", "medium", "campaign", "content", "term"]) { const v = q.get(`utm_${k}`); if (v) utm[k] = v.slice(0, 60); }
  const clid = ["gclid", "fbclid", "li_fat_id", "msclkid", "ttclid"].find((k) => q.has(k)) || "";
  const tag = (q.get("ref") || "").slice(0, 60);
  const here = (location.pathname + location.hash).slice(0, 100);
  let src: Record<string, unknown> | null = null;
  if (!fresh) try { src = JSON.parse(store("pn-src") || "null"); } catch { /* corrupt */ }
  if (!src) { src = { ref: rh ? document.referrer.split("?")[0].slice(0, 200) : "", rh, utm, clid, tag, land: here }; store("pn-src", JSON.stringify(src)); }
  let ft: Record<string, unknown> | null = null;
  try { ft = JSON.parse(store("pn-ft") || "null"); } catch { /* corrupt */ }
  if (!ft) { ft = { rh: src.rh, utm: src.utm, tag: src.tag, t: t0 }; store("pn-ft", JSON.stringify(ft)); }

  /* ---------- state for this page load ---------- */
  const ctx = rid().slice(0, 8);
  const ev: unknown[][] = [];
  const cnt: Record<string, number> = {}, sec: Record<string, [number, number, number]> = {}, blk: Record<string, number> = {}, ms: Record<string, number> = {}, wc: Record<string, number> = {}, perf: Record<string, number> = {};
  let act = 0, fg = 0, hid = 0, depth = 0, rev = 0, px = 0, lastY = scrollY, lastDir = 0, lastInput = Date.now(), vis = !document.hidden, dirty = true, lastSent = "", cur = "";
  let videoOpen = false, nodes: { id: string; el: HTMLElement }[] = [], heads: { k: string; el: HTMLElement }[] = [];
  const since = () => Math.round((Date.now() - t0) / 1000);
  const secId = (el: HTMLElement) => el.dataset.sec || el.id || "";

  function add(name: string, p?: Props) {
    cnt[name] = (cnt[name] || 0) + 1;
    dirty = true;
    if (ev.length < MAX_EV) ev.push(p ? [name, since(), cur, p] : [name, since(), cur]);
  }
  emit = (name, p) => { add(name, p); soon(); };

  function scan() {
    nodes = ([...document.querySelectorAll("main > section, footer.foot")] as HTMLElement[]).map((el) => ({ id: secId(el), el })).filter((x) => x.id);
    heads = ([...document.querySelectorAll("main h2, main h3")] as HTMLElement[]).map((el) => ({ k: clip(el.textContent, 46), el })).filter((x) => x.k);
    for (const n of nodes) { const w = (n.el.innerText || "").split(/\s+/).filter(Boolean).length; if (w) wc[n.id] = w; }
  }
  const atLine = <T extends { el: HTMLElement }>(list: T[]) => { const y = innerHeight * 0.4; let c: T | null = null; for (const x of list) if (x.el.getBoundingClientRect().top <= y) c = x; return c as T | null; };

  function measure() {
    const h = document.documentElement, d = Math.min(100, Math.round(((scrollY + innerHeight) / Math.max(1, h.scrollHeight)) * 100));
    if (d > depth) { depth = d; dirty = true; for (const m of [25, 50, 75, 90, 100]) if (d >= m && ms[m] == null) ms[m] = since(); }
    const n = atLine(nodes);
    if (n && n.id !== cur) {
      cur = n.id;
      const s = (sec[cur] ||= [0, 0, since()]);
      s[1]++; dirty = true;
      add("section", { s: cur });
    }
  }

  /* heartbeat: one second of active time, credited to the section and heading at the reading line */
  setInterval(() => {
    if (vis) fg++;
    if (!(vis && (videoOpen || Date.now() - lastInput < IDLE))) return;
    act++; dirty = true;
    measure();
    if (cur && sec[cur]) sec[cur][0]++;
    const h = atLine(heads);
    if (h && (h.k in blk || Object.keys(blk).length < 110)) blk[h.k] = (blk[h.k] || 0) + 1;
    if (act % 15 === 0) touch();
  }, 1000);
  for (const t of ["mousemove", "keydown", "touchstart", "pointerdown", "wheel"]) addEventListener(t, () => { lastInput = Date.now(); }, { passive: true, capture: true });

  let scrollT = 0;
  addEventListener("scroll", () => {
    lastInput = Date.now();
    const dy = scrollY - lastY;
    if (dy) { const dir = Math.sign(dy); if (lastDir && dir !== lastDir && Math.abs(dy) > 2) rev++; lastDir = dir; px += Math.abs(dy); lastY = scrollY; }
    if (!scrollT) scrollT = window.setTimeout(() => { scrollT = 0; measure(); }, 200);
  }, { passive: true });

  /* ---------- every click ---------- */
  const burst: { t: number; x: number; y: number }[] = [];
  let lastContact = "", lastContactT = 0;
  const labelOf = (el: Element) => clip(el.getAttribute("data-track") || el.getAttribute("aria-label") || el.getAttribute("title") || (el as HTMLElement).innerText || el.getAttribute("alt") || el.querySelector?.("img")?.getAttribute("alt") || el.tagName.toLowerCase());
  document.addEventListener("click", (e) => {
    lastInput = Date.now();
    const t = e.target as Element | null;
    if (!t || t.nodeType !== 1) return;
    const hit = t.closest(INTERACTIVE);
    const a = t.closest("a[href]") as HTMLAnchorElement | null;
    const host = nodes.find((n) => n.el.contains(t)) || atLine(nodes);
    const box = host?.el.getBoundingClientRect();
    const p: Props = { l: labelOf(hit || t.closest("p,li,h1,h2,h3,h4,img,figure") || t), x: Math.round((e.clientX / Math.max(1, innerWidth)) * 1000) };
    if (host && box) { p.y = Math.round(((e.clientY - box.top) / Math.max(1, box.height)) * 1000); p.at = host.id; }
    let kind = hit ? "control" : "text";
    if (a) {
      const href = a.getAttribute("href") || "";
      const c = contactOf(href);
      if (href.startsWith("#")) { kind = t.closest("header.nav") ? "nav" : "jump"; p.to = href.slice(1); }
      else if (c) {
        kind = "contact"; p.c = c;
        if (c !== lastContact || Date.now() - lastContactT > 1500) { lastContact = c; lastContactT = Date.now(); add("contact", { c, via: "click", at: String(p.at || cur) }); }
      } else { kind = "source"; try { p.h = new URL(a.href).hostname.replace(/^www\./, ""); } catch { /* */ } }
    } else if (hit) {
      if (hit.matches("summary,[aria-expanded],[role=tab],[role=switch],[role=radio],[role=checkbox]")) kind = "toggle";
      const st = hit.getAttribute("aria-expanded") || hit.getAttribute("aria-selected") || hit.getAttribute("aria-checked");
      if (st) p.st = st;
    }
    p.k = kind;
    add("click", p);
    const now = Date.now();
    burst.push({ t: now, x: e.clientX, y: e.clientY });
    while (burst.length && now - burst[0].t > 800) burst.shift();
    if (burst.length >= 3 && burst.every((b) => Math.abs(b.x - e.clientX) < 40 && Math.abs(b.y - e.clientY) < 40)) { add("rage", { l: p.l }); burst.length = 0; }
    soon(kind === "contact" ? 800 : 5000);
  }, true);

  /* ---------- expand, copy, select, keyboard, print, hover, video, errors ---------- */
  document.addEventListener("toggle", (e) => {
    const d = e.target as HTMLDetailsElement;
    if (d.tagName === "DETAILS") add(d.open ? "expand" : "collapse", { l: clip(d.querySelector("summary b")?.textContent || d.querySelector("summary")?.textContent) });
  }, true);
  document.addEventListener("copy", () => { const s = String(getSelection() || ""); add("copy", { n: s.length, t: clip(s, 80) }); soon(); });
  let selT = 0;
  document.addEventListener("selectionchange", () => {
    clearTimeout(selT);
    selT = window.setTimeout(() => { const s = String(getSelection() || ""); if (s.length >= 20) add("select", { n: s.length, t: clip(s, 80) }); }, 900);
  });
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase(), mod = e.metaKey || e.ctrlKey;
    if (mod && k === "f") add("find");
    else if (mod && k === "p") add("print_key");
    else if (mod && k === "s") add("save_key");
    else if (["arrowdown", "arrowup", "pagedown", "pageup", " ", "home", "end"].includes(k)) { cnt.key_scroll = (cnt.key_scroll || 0) + 1; dirty = true; }
    else if (k === "tab") { cnt.key_tab = (cnt.key_tab || 0) + 1; dirty = true; }
  }, true);
  addEventListener("beforeprint", () => { add("print"); send(false); });
  addEventListener("hashchange", () => add("hash", { to: location.hash.slice(1, 40) }));
  addEventListener("orientationchange", () => add("rotate", { to: innerWidth > innerHeight ? "landscape" : "portrait" }));
  let hovT = 0, hovEl: Element | null = null, hovs = 0;
  document.addEventListener("pointerover", (e) => {
    if ((e as PointerEvent).pointerType === "touch") return;
    const el = (e.target as Element)?.closest?.(CHARTY) || null;
    if (el === hovEl) return;
    hovEl = el; clearTimeout(hovT);
    if (el && hovs < 60) hovT = window.setTimeout(() => { hovs++; add("hover", { l: labelOf(el) }); }, 1200);
  }, { passive: true });
  addEventListener("error", (e) => {
    const tgt = e.target as HTMLElement & { src?: string };
    if (tgt && tgt !== (window as unknown) && tgt.tagName) add("asset_fail", { l: clip(tgt.src || tgt.tagName, 80) });
    else add("js_error", { m: clip(e.message, 90), f: clip(`${(e.filename || "").split("/").pop()}:${e.lineno}`, 40) });
  }, true);
  addEventListener("unhandledrejection", (e) => add("js_error", { m: clip((e.reason as Error)?.message || e.reason, 90), f: "promise" }));
  (window as unknown as { __pnVideo?: (open: boolean) => void }).__pnVideo = (o) => { videoOpen = o; };

  /* ---------- Core Web Vitals and load timing ---------- */
  const po = (type: string, cb: (es: PerformanceEntry[]) => void, extra?: object) => { try { new PerformanceObserver((l) => cb(l.getEntries())).observe({ type, buffered: true, ...extra } as PerformanceObserverInit); } catch { /* unsupported */ } };
  po("largest-contentful-paint", (es) => { perf.lcp = Math.round(es[es.length - 1].startTime); dirty = true; });
  po("paint", (es) => { for (const x of es) if (x.name === "first-contentful-paint") perf.fcp = Math.round(x.startTime); });
  let cls = 0;
  po("layout-shift", (es) => { for (const x of es as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) if (!x.hadRecentInput) cls += x.value; perf.cls = Math.round(cls * 1000); });
  po("event", (es) => { for (const x of es) if (x.duration > (perf.inp || 0)) perf.inp = Math.round(x.duration); }, { durationThreshold: 40 });
  addEventListener("load", () => setTimeout(() => {
    const n = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (n) { perf.ttfb = Math.round(n.responseStart); perf.dom = Math.round(n.domContentLoadedEventEnd); perf.load = Math.round(n.loadEventEnd || n.domComplete); perf.nav = n.type === "reload" ? 1 : n.type === "back_forward" ? 2 : 0; }
    dirty = true;
  }, 800));

  /* ---------- send: 8s after load, then on a slowing schedule, plus whenever the reader leaves ---------- */
  const conn = () => { try { return (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType || ""; } catch { return ""; } };
  const record = () => ({
    v: 1, sid, vid, ctx, t0, t1: Date.now(), here,
    ses: { s0, n: sn, first, ret: returning ? 1 : 0 }, src, ft,
    dev: { vw: innerWidth, vh: innerHeight, sw: screen.width, sh: screen.height, dpr: Math.round(devicePixelRatio * 10) / 10, lang: navigator.language, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, dark: matchMedia("(prefers-color-scheme: dark)").matches ? 1 : 0, touch: navigator.maxTouchPoints > 0 ? 1 : 0, conn: conn(), mem: (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 0, rm: matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0, wd: navigator.webdriver ? 1 : 0 },
    eng: { act, wall: since(), fg, hid, depth, exit: cur, rev, px: Math.round(px), docH: document.documentElement.scrollHeight },
    sec, blk, ms, wc, cnt, ev, perf,
  });
  function send(beacon: boolean) {
    const body = record();
    const sig = JSON.stringify([body.eng.act, body.eng.depth, body.eng.hid, ev.length, cnt, perf]);
    if (sig === lastSent) return;
    lastSent = sig; dirty = false;
    const payload = JSON.stringify(body);
    if (debug) console.log("[pn-track]", body);
    if (beacon && payload.length < 60000 && navigator.sendBeacon?.("/api/hit", new Blob([payload], { type: "application/json" }))) return;
    fetch("/api/hit", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: payload.length < 60000 }).catch(() => {});
  }
  let sendT = 0;
  function soon(ms2 = 5000) { clearTimeout(sendT); sendT = window.setTimeout(() => send(false), ms2); }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { vis = false; hid++; touch(); add("tab_hide"); send(true); }
    else { vis = true; lastInput = Date.now(); add("tab_show"); }
  });
  addEventListener("pagehide", () => { touch(); send(true); });
  setTimeout(() => { scan(); measure(); }, 500);
  setTimeout(() => send(false), 8000);
  setInterval(scan, 15000);
  setInterval(() => { if (dirty && vis) send(false); }, 45000);
}

export function startTracking() { try { run(); } catch { /* never break the page */ } }
