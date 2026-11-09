import { SECTIONS, type Rec } from './metrics'
// Dev-only sample for checking layouts (/track.html?demo on the Vite server). It never ships to production data.
const P = [['US', 'CA', 'Irvine', 33.68, -117.83], ['US', 'CA', 'San Francisco', 37.77, -122.42], ['US', 'NY', 'New York', 40.71, -74.0], ['CA', 'ON', 'Ottawa', 45.42, -75.7], ['CA', 'ON', 'Toronto', 43.65, -79.38], ['IN', 'TG', 'Hyderabad', 17.39, 78.49], ['IN', 'KA', 'Bengaluru', 12.97, 77.59], ['GB', 'ENG', 'London', 51.51, -0.13], ['DE', 'BE', 'Berlin', 52.52, 13.4]] as const
const R = ['www.linkedin.com', 'www.linkedin.com', '', '', 'mail.google.com', 'www.google.com', 'teams.microsoft.com']
export function demoRecords(): Rec[] {
  let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647, pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)]
  return Array.from({ length: 220 }, (_, i) => {
    const t0 = Date.now() - r() * r() * 40 * 864e5, p = pick(P), reach = Math.min(SECTIONS.length, Math.floor(r() * r() * 26) + 1), mob = r() < 0.3, sec: Rec['sec'] = {}, ev: Rec['ev'] = [], wc: Rec['wc'] = {}
    let act = 0
    SECTIONS.slice(0, reach).forEach((s, k) => { const d = Math.floor(r() * 45) + 1; sec[s.id] = [d, r() < 0.2 ? 2 : 1, act]; ev.push(['section', act, s.id, { s: s.id }]); wc[s.id] = 120 + k * 17; act += d; if (r() < 0.5) ev.push(['click', act, s.id, { k: pick(['source', 'toggle', 'jump', 'control', 'text']), l: pick(['B2B catalogs with Markets', 'Open evidence', 'Direct', 'Jump to the plan', 'Paragraph']), x: Math.floor(r() * 1000), y: Math.floor(r() * 1000), at: s.id, h: 'help.shopify.com' }]) })
    const depth = Math.round((reach / SECTIONS.length) * 100), cnt: Rec['cnt'] = { click: ev.filter((e) => e[0] === 'click').length }
    if (reach > 14 && r() < 0.5) { const c = pick(['linkedin', 'email', 'call']); ev.push(['contact', act, 'author', { c, via: 'click', at: 'author' }]); cnt.contact = 1 }
    const vid = `vis${(i % 170).toString(36).padStart(3, '0')}`, ref = pick(R)
    return { sid: `ses${i.toString(36).padStart(4, '0')}`, vid, ctx: `ctx${i}`, t0, t1: t0 + act * 1200, at: t0, here: '/', ses: { s0: t0, n: i > 170 ? 2 : 1, first: t0, ret: i > 170 ? 1 : 0 }, src: { ref, rh: ref, utm: {}, clid: '', tag: '', land: '/' }, ft: { rh: ref, utm: {}, t: t0, tag: '' }, dev: { vw: mob ? 390 : 1440, vh: 800, sw: 1440, sh: 900, dpr: 2, lang: 'en-US', tz: 'America/Los_Angeles', dark: 0, touch: mob ? 1 : 0, conn: '4g', mem: 8, rm: 0, wd: 0 }, eng: { act, wall: Math.round(act * 1.3), fg: act, hid: 1, depth, exit: SECTIONS[reach - 1].id, rev: 3, px: 9000, docH: 18000 }, sec, blk: { 'Direct catalogs can\'t be scheduled. Market catalogs can.': 34, 'My answer: don\'t build yet.': 58 }, ms: { 25: 20, 50: 60 }, wc, cnt, ev, perf: { lcp: 900 + r() * 2000, inp: 40 + r() * 300, cls: r() * 150, ttfb: 90 + r() * 400, fcp: 500 + r() * 900 }, geo: { country: p[0], region: p[1], city: p[2], postal: '', lat: p[3], lon: p[4], tz: '' }, ua: { device: mob ? 'Mobile' : 'Desktop', os: mob ? 'iOS' : 'macOS', browser: pick(['Chrome', 'Safari', 'LinkedIn in-app']) } } as Rec
  })
}
