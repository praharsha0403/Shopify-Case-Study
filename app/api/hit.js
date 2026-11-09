import { put } from '@vercel/blob';
import { clientHash } from './_lib.js';

// Public ingest. Each page load sends one growing record and every write overwrites the same file, so a retry can
// never double-count. Location comes from Vercel's edge headers; the IP address itself is not stored.
const str = (v, n = 60) => String(v == null ? '' : v).replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n);
const num = (v, max = 9e15) => Math.max(0, Math.min(max, Math.round(Number(v) || 0)));
const obj = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});
const id = (v) => (/^[a-z0-9]{4,16}$/.test(String(v || '')) ? String(v) : '');
const dec = (v) => { try { return decodeURIComponent(v || ''); } catch { return v || ''; } };
const geo = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? Math.round(n * 100) / 100 : null; };
const BOT = /bot|crawl|spider|preview|headless|lighthouse|monitor|facebookexternalhit|slackbot|whatsapp\/|linkedinbot|embedly|vercel-screenshot|pingdom|gtmetrix/i;

function browserOf(ua) {
  if (/LinkedInApp/i.test(ua)) return 'LinkedIn in-app';
  if (/FBAN|FBAV/i.test(ua)) return 'Facebook in-app';
  if (/Instagram/i.test(ua)) return 'Instagram in-app';
  if (/WhatsApp/i.test(ua)) return 'WhatsApp in-app';
  if (/Slack/i.test(ua)) return 'Slack in-app';
  if (/GSA\//.test(ua)) return 'Google app';
  if (/Edg\//.test(ua)) return 'Edge';
  if (/OPR\//.test(ua)) return 'Opera';
  if (/SamsungBrowser/.test(ua)) return 'Samsung Internet';
  if (/Firefox|FxiOS/.test(ua)) return 'Firefox';
  if (/CriOS|Chrome\//.test(ua)) return 'Chrome';
  if (/Safari\//.test(ua)) return 'Safari';
  return 'Other';
}
const osOf = (ua) => (/iPhone|iPad/.test(ua) ? 'iOS' : /Android/i.test(ua) ? 'Android' : /Mac OS/i.test(ua) ? 'macOS' : /Windows/i.test(ua) ? 'Windows' : /CrOS/.test(ua) ? 'ChromeOS' : /Linux/i.test(ua) ? 'Linux' : 'Other');
const deviceOf = (ua, touch, vw) => (/iPad|Tablet/i.test(ua) || (/Macintosh/.test(ua) && touch && vw < 1400) ? 'Tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'Mobile' : 'Desktop');
const utm = (u) => { const r = {}; for (const k of ['source', 'medium', 'campaign', 'content', 'term']) if (obj(u)[k]) r[k] = str(obj(u)[k]); return r; };
const nums = (m, keys, max, cap = 86400) => { const r = {}; let n = 0; for (const [k, v] of Object.entries(obj(m))) { if (n++ >= keys) break; r[str(k, max)] = num(v, cap); } return r; };

function clean(b) {
  const ses = obj(b.ses), src = obj(b.src), ft = obj(b.ft), dev = obj(b.dev), eng = obj(b.eng), perf = obj(b.perf);
  const sec = {}; let n = 0;
  for (const [k, v] of Object.entries(obj(b.sec))) { if (n++ >= 40 || !Array.isArray(v)) break; sec[str(k, 16)] = [num(v[0], 86400), num(v[1], 10000), num(v[2], 86400)]; }
  return {
    v: 1, sid: id(b.sid), vid: id(b.vid), ctx: id(b.ctx), t0: num(b.t0), t1: num(b.t1), here: str(b.here, 100),
    ses: { s0: num(ses.s0), n: num(ses.n, 1e5), first: num(ses.first), ret: ses.ret ? 1 : 0 },
    src: { ref: str(src.ref, 200), rh: str(src.rh, 80), utm: utm(src.utm), clid: str(src.clid, 12), tag: str(src.tag, 60), land: str(src.land, 100) },
    ft: { rh: str(ft.rh, 80), utm: utm(ft.utm), t: num(ft.t), tag: str(ft.tag, 60) },
    dev: { vw: num(dev.vw, 20000), vh: num(dev.vh, 20000), sw: num(dev.sw, 20000), sh: num(dev.sh, 20000), dpr: Math.min(6, Number(dev.dpr) || 1), lang: str(dev.lang, 16), tz: str(dev.tz, 48), dark: dev.dark ? 1 : 0, touch: dev.touch ? 1 : 0, conn: str(dev.conn, 8), mem: num(dev.mem, 256), rm: dev.rm ? 1 : 0, wd: dev.wd ? 1 : 0 },
    eng: { act: num(eng.act, 86400), wall: num(eng.wall, 86400), fg: num(eng.fg, 86400), hid: num(eng.hid, 10000), depth: num(eng.depth, 100), exit: str(eng.exit, 16), rev: num(eng.rev, 1e5), px: num(eng.px, 1e8), docH: num(eng.docH, 1e6) },
    sec, blk: nums(b.blk, 120, 48), ms: nums(b.ms, 8, 4), wc: nums(b.wc, 40, 16, 1e5), cnt: nums(b.cnt, 40, 24, 1e6),
    ev: (Array.isArray(b.ev) ? b.ev : []).slice(0, 450).map((x) => {
      const r = [str(x[0], 24), num(x[1], 86400), str(x[2], 16)];
      if (obj(x[3])) { const p = {}; let k = 0; for (const [a, v] of Object.entries(obj(x[3]))) { if (k++ >= 10) break; p[str(a, 8)] = typeof v === 'number' ? v : str(v, 90); } r.push(p); }
      return r;
    }),
    perf: nums(perf, 10, 8, 600000),
  };
}

// a small per-instance brake on floods; one reader writes about once every 45 seconds
const seen = new Map();
const throttled = (h) => {
  const now = Date.now(), e = seen.get(h);
  if (seen.size > 5000) seen.clear();
  if (!e || now - e.t > 60000) { seen.set(h, { t: now, n: 1 }); return false; }
  return ++e.n > 40;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(204).end();
  const h = req.headers, ua = String(h['user-agent'] || '');
  const origin = String(h.origin || '');
  if (BOT.test(ua) || (origin && new URL(origin).host !== h.host) || throttled(clientHash(req))) return res.status(204).end();
  try {
    const raw = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const r = clean(raw);
    const start = r.ses.s0 || r.t0;
    if (!r.sid || !r.vid || !r.ctx || !start || Math.abs(Date.now() - start) > 3 * 864e5) return res.status(204).end();
    r.geo = { country: str(h['x-vercel-ip-country'], 4), region: str(h['x-vercel-ip-country-region'], 8), city: str(dec(h['x-vercel-ip-city']), 48), postal: str(h['x-vercel-ip-postal-code'], 12), lat: geo(h['x-vercel-ip-latitude']), lon: geo(h['x-vercel-ip-longitude']), tz: str(h['x-vercel-ip-timezone'], 48) };
    r.ua = { device: deviceOf(ua, r.dev.touch, r.dev.vw), os: osOf(ua), browser: browserOf(ua) };
    r.at = Date.now();
    await put(`s/${new Date(start).toISOString().slice(0, 10)}/${r.sid}~${r.ctx}.json`, JSON.stringify(r), { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true });
  } catch { /* analytics must never break the page */ }
  res.status(204).end();
}
