/* Turns raw page-load records into sessions, visitors and every metric on the dashboard. All definitions live here so a number means one thing everywhere. */
export type Props = Record<string, string | number>
export type Rec = {
  sid: string; vid: string; ctx: string; t0: number; t1: number; at: number; here: string
  ses: { s0: number; n: number; first: number; ret: 0 | 1 }
  src: { ref: string; rh: string; utm: Record<string, string>; clid: string; tag: string; land: string }
  ft: { rh: string; utm: Record<string, string>; t: number; tag: string }
  dev: { vw: number; vh: number; sw: number; sh: number; dpr: number; lang: string; tz: string; dark: 0 | 1; touch: 0 | 1; conn: string; mem: number; rm: 0 | 1; wd: 0 | 1 }
  eng: { act: number; wall: number; fg: number; hid: number; depth: number; exit: string; rev: number; px: number; docH: number }
  sec: Record<string, [number, number, number]>; blk: Record<string, number>; ms: Record<string, number>; wc: Record<string, number>; cnt: Record<string, number>
  ev: [string, number, string, Props?][]; perf: Record<string, number>
  geo: { country: string; region: string; city: string; postal: string; lat: number | null; lon: number | null; tz: string }
  ua: { device: string; os: string; browser: string }
}
export type Ev = { name: string; at: number; sec: string; p: Props }
export type ReaderType = 'Bounced' | 'Skimmer' | 'Reader' | 'Deep reader'
export type Session = {
  sid: string; vid: string; start: number; end: number; day: string; hour: number; dow: number; n: number; returning: boolean; firstSeen: number; loads: number
  channel: string; group: string; refHost: string; utm: Record<string, string>; tag: string; clid: string; landing: string; ftChannel: string
  country: string; region: string; regionName: string; city: string; postal: string; lat: number | null; lon: number | null; geoTz: string
  device: string; os: string; browser: string; vw: number; screen: string; lang: string; tz: string; conn: string; dark: boolean; mem: number; touch: boolean
  active: number; wall: number; fg: number; hides: number; depth: number; reversals: number; px: number
  sec: Record<string, { act: number; enters: number; first: number }>; blk: Record<string, number>; ms: Record<string, number>; wc: Record<string, number>; cnt: Record<string, number>
  exit: string; events: Ev[]; clicks: Ev[]; contacts: Ev[]; sources: Ev[]; rage: number; errors: Ev[]; perf: Record<string, number>
  bounce: boolean; qualified: boolean; completed: boolean; contacted: boolean; verified: boolean; type: ReaderType; score: number; secsRead: number; firstContact: number | null; live: boolean; automated: boolean
}

export const SECTIONS: { id: string; label: string }[] = [
  { id: 'top', label: 'Hero' }, { id: 'thesis', label: 'The thesis' }, { id: 'overview', label: 'Overview' }, { id: 'short', label: 'The short version' }, { id: 'wrong', label: 'Where I went wrong' },
  { id: 'how', label: 'Five steps' }, { id: 'today', label: "What's true" }, { id: 'finding', label: 'The finding' }, { id: 'workaround', label: 'What broke it' }, { id: 'who', label: 'Evidence' },
  { id: 'why', label: 'Why' }, { id: 'build', label: 'Outcomes' }, { id: 'prove', label: 'Investigations' }, { id: 'ship', label: "If it's a build" }, { id: 'commit', label: 'Commitments' },
  { id: 'appendix', label: 'Appendix' }, { id: 'hard', label: 'Q&A' }, { id: 'journey', label: 'Discovery log' }, { id: 'author', label: 'Author' }, { id: 'sources', label: 'Sources' },
]
export const secLabel = (id: string) => SECTIONS.find((s) => s.id === id)?.label || id || 'Unknown'
export const CONTACT_LABEL: Record<string, string> = { linkedin: 'LinkedIn', email: 'Email', call: 'Quick Connect call', portfolio: 'Portfolio' }
export const EVENT_LABEL: Record<string, string> = {
  section: 'Entered section', click: 'Clicked', contact: 'Contact action', expand: 'Expanded', collapse: 'Collapsed', copy: 'Copied text', select: 'Highlighted text', find: 'Used find on page', print: 'Printed or saved PDF', print_key: 'Pressed print', save_key: 'Pressed save',
  hash: 'Jumped by link', rotate: 'Rotated device', hover: 'Studied a chart', rage: 'Rage click', js_error: 'JavaScript error', asset_fail: 'Asset failed to load', video_open: 'Played video', video_close: 'Closed video', tab_hide: 'Left the tab', tab_show: 'Returned to the tab',
}

const US: Record<string, string> = { AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming' }
const INDIA: Record<string, string> = { AP: 'Andhra Pradesh', AR: 'Arunachal Pradesh', AS: 'Assam', BR: 'Bihar', CT: 'Chhattisgarh', CG: 'Chhattisgarh', CH: 'Chandigarh', DL: 'Delhi', GA: 'Goa', GJ: 'Gujarat', HR: 'Haryana', HP: 'Himachal Pradesh', JH: 'Jharkhand', JK: 'Jammu and Kashmir', KA: 'Karnataka', KL: 'Kerala', MH: 'Maharashtra', ML: 'Meghalaya', MN: 'Manipur', MP: 'Madhya Pradesh', MZ: 'Mizoram', NL: 'Nagaland', OD: 'Odisha', OR: 'Odisha', PB: 'Punjab', PY: 'Puducherry', RJ: 'Rajasthan', SK: 'Sikkim', TN: 'Tamil Nadu', TG: 'Telangana', TS: 'Telangana', TR: 'Tripura', UK: 'Uttarakhand', UT: 'Uttarakhand', UP: 'Uttar Pradesh', WB: 'West Bengal' }
const CA: Record<string, string> = { AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba', NB: 'New Brunswick', NL: 'Newfoundland', NS: 'Nova Scotia', ON: 'Ontario', PE: 'Prince Edward Island', QC: 'Quebec', SK: 'Saskatchewan' }
const REGIONS: Record<string, Record<string, string>> = { US, IN: INDIA, CA }
const names = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['en'], { type: 'region' }) : null
export const countryName = (c: string) => { try { return c ? names?.of(c) || c : 'Unknown' } catch { return c } }
export const flag = (c: string) => (/^[A-Z]{2}$/.test(c) ? String.fromCodePoint(...[...c].map((x) => 127397 + x.charCodeAt(0))) : '🌐')

export const fmtSecs = (s: number | null | undefined) => (s == null || !Number.isFinite(s) ? '–' : s < 60 ? `${Math.round(s)}s` : s < 3600 ? `${Math.floor(s / 60)}m ${String(Math.round(s % 60)).padStart(2, '0')}s` : `${Math.floor(s / 3600)}h ${Math.round((s % 3600) / 60)}m`)
export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0)
export const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0)
export const median = (a: number[]) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2 }
export const p75 = (a: number[]) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * 0.75))] }
export const dayKey = (ms: number) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }

export function channelOf(rh: string, utm: Record<string, string>, browser: string): [string, string] {
  const u = (utm.source || '').toLowerCase(), h = (rh || '').toLowerCase()
  const pick = (x: string): [string, string] | null => {
    if (/linkedin|lnkd/.test(x)) return ['LinkedIn', 'Social']
    if (/^t\.co$|twitter|x\.com/.test(x)) return ['X', 'Social']
    if (/instagram/.test(x)) return ['Instagram', 'Social']
    if (/facebook|fb\.com/.test(x)) return ['Facebook', 'Social']
    if (/reddit/.test(x)) return ['Reddit', 'Social']
    if (/news\.ycombinator/.test(x)) return ['Hacker News', 'Social']
    if (/whatsapp|wa\.me/.test(x)) return ['WhatsApp', 'Messaging']
    if (/slack/.test(x)) return ['Slack', 'Messaging']
    if (/teams\.microsoft|teams|discord|telegram|t\.me/.test(x)) return [x.replace(/^www\./, ''), 'Messaging']
    if (/mail\.google|gmail/.test(x)) return ['Gmail', 'Email']
    if (/outlook|office\.com|live\.com/.test(x)) return ['Outlook', 'Email']
    if (/^email|newsletter/.test(x)) return ['Email', 'Email']
    if (/google\.|^google$/.test(x)) return ['Google', 'Search']
    if (/bing|duckduckgo|yahoo|perplexity|chatgpt|claude\.ai/.test(x)) return [x.replace(/^www\./, ''), 'Search and AI']
    if (/greenhouse|lever\.co|ashbyhq|workday/.test(x)) return [x.replace(/^www\./, ''), 'Hiring tools']
    return null
  }
  if (u) return pick(u) || [utm.source, 'Campaign']
  const r = pick(h); if (r) return r
  for (const [re, n, g] of [[/LinkedIn/, 'LinkedIn', 'Social'], [/WhatsApp/, 'WhatsApp', 'Messaging'], [/Slack/, 'Slack', 'Messaging'], [/Instagram/, 'Instagram', 'Social']] as const) if (re.test(browser)) return [n, g]
  return h ? [h.replace(/^www\./, ''), 'Referral'] : ['Direct', 'Direct']
}

export function buildSessions(recs: Rec[], now: number): Session[] {
  const by = new Map<string, Rec[]>()
  for (const r of recs) { if (!r?.sid) continue; (by.get(r.sid) || by.set(r.sid, []).get(r.sid)!).push(r) }
  const out: Session[] = []
  for (const [sid, rs] of by) {
    rs.sort((a, b) => a.t0 - b.t0)
    const lead = rs[0], g = rs.find((r) => r.geo?.city) || lead
    const start = Math.min(...rs.map((r) => r.ses?.s0 || r.t0)), end = Math.max(...rs.map((r) => r.t1 || r.at || r.t0))
    const [channel, group] = channelOf(lead.src?.rh, lead.src?.utm || {}, lead.ua?.browser || '')
    const sec: Session['sec'] = {}, blk: Record<string, number> = {}, ms: Record<string, number> = {}, wc: Record<string, number> = {}, cnt: Record<string, number> = {}, perf: Record<string, number> = {}, events: Ev[] = []
    let active = 0, fg = 0, hides = 0, depth = 0, reversals = 0, px = 0
    for (const r of rs) {
      active += r.eng?.act || 0; fg += r.eng?.fg || 0; hides += r.eng?.hid || 0; reversals += r.eng?.rev || 0; px += r.eng?.px || 0; depth = Math.max(depth, r.eng?.depth || 0)
      for (const [k, v] of Object.entries(r.sec || {})) { const s = (sec[k] ||= { act: 0, enters: 0, first: Infinity }); s.act += v[0]; s.enters += v[1]; s.first = Math.min(s.first, (r.t0 - start) / 1000 + v[2]) }
      for (const [k, v] of Object.entries(r.blk || {})) blk[k] = (blk[k] || 0) + v
      for (const [k, v] of Object.entries(r.ms || {})) ms[k] = Math.min(ms[k] ?? Infinity, v + (r.t0 - start) / 1000)
      Object.assign(wc, r.wc || {})
      for (const [k, v] of Object.entries(r.cnt || {})) cnt[k] = (cnt[k] || 0) + v
      for (const [k, v] of Object.entries(r.perf || {})) if (perf[k] == null) perf[k] = v
      for (const [name, t, s, p] of r.ev || []) events.push({ name, at: r.t0 + t * 1000, sec: s, p: p || {} })
    }
    events.sort((a, b) => a.at - b.at)
    const clicks = events.filter((e) => e.name === 'click'), contacts = events.filter((e) => e.name === 'contact'), sources = clicks.filter((e) => e.p.k === 'source')
    const clickCount = cnt.click || clicks.length, seen = Object.keys(sec)
    const secsRead = seen.filter((k) => sec[k].act >= 5).length
    const bounce = active < 10 && clickCount === 0
    const qualified = active >= 120 && depth >= 50
    const completed = !!sec.author || !!sec.sources
    const contacted = contacts.length > 0, verified = sources.length > 0
    const interactions = clickCount + (cnt.expand || 0) + (cnt.copy || 0) + (cnt.select || 0)
    const type: ReaderType = bounce ? 'Bounced' : active >= 240 && secsRead >= 8 ? 'Deep reader' : active >= 60 && depth >= 40 ? 'Reader' : 'Skimmer'
    const score = Math.round(40 * Math.min(active / 300, 1) + 25 * (depth / 100) + 15 * Math.min(secsRead / 10, 1) + 10 * Math.min(interactions / 5, 1) + 10 * (contacted ? 1 : verified ? 0.5 : 0))
    const lastRec = [...rs].sort((a, b) => b.t1 - a.t1)[0], d = new Date(start), vw = lead.dev?.vw || 0
    out.push({
      sid, vid: lead.vid, start, end, day: dayKey(start), hour: d.getHours(), dow: (d.getDay() + 6) % 7, n: Math.max(...rs.map((r) => r.ses?.n || 1)), returning: rs.some((r) => r.ses?.ret) && Math.max(...rs.map((r) => r.ses?.n || 1)) > 1, firstSeen: Math.min(...rs.map((r) => r.ses?.first || start)), loads: rs.length,
      channel, group, refHost: lead.src?.rh || '', utm: lead.src?.utm || {}, tag: lead.src?.tag || '', clid: lead.src?.clid || '', landing: lead.src?.land || lead.here || '/', ftChannel: channelOf(lead.ft?.rh, lead.ft?.utm || {}, '')[0],
      country: g.geo?.country || '', region: g.geo?.region || '', regionName: REGIONS[g.geo?.country]?.[g.geo?.region] || g.geo?.region || '', city: g.geo?.city || '', postal: g.geo?.postal || '', lat: g.geo?.lat ?? null, lon: g.geo?.lon ?? null, geoTz: g.geo?.tz || '',
      device: lead.ua?.device || 'Desktop', os: lead.ua?.os || 'Other', browser: lead.ua?.browser || 'Other', vw, screen: vw < 640 ? 'Phone' : vw < 1100 ? 'Tablet or small laptop' : vw < 1600 ? 'Laptop' : 'Large desktop', lang: lead.dev?.lang || '', tz: lead.dev?.tz || '', conn: lead.dev?.conn || '', dark: !!lead.dev?.dark, mem: lead.dev?.mem || 0, touch: !!lead.dev?.touch,
      active, wall: Math.max(0, Math.round((end - start) / 1000)), fg, hides, depth, reversals, px, sec, blk, ms, wc, cnt, exit: lastRec.eng?.exit || '', events, clicks, contacts, sources, rage: cnt.rage || 0, errors: events.filter((e) => e.name === 'js_error' || e.name === 'asset_fail'), perf,
      bounce, qualified, completed, contacted, verified, type, score, secsRead, firstContact: contacts.length ? (contacts[0].at - start) / 1000 : null, live: now - end < 5 * 60_000, automated: rs.some((r) => r.dev?.wd),
    })
  }
  return out.sort((a, b) => b.start - a.start)
}

export function summary(l: Session[]) {
  const vids = new Set(l.map((s) => s.vid)), n = l.length
  return {
    sessions: n, visitors: vids.size, active: avg(l.map((s) => s.active)), medianActive: median(l.map((s) => s.active)), totalActive: l.reduce((a, s) => a + s.active, 0),
    bounce: pct(l.filter((s) => s.bounce).length, n), qualified: pct(l.filter((s) => s.qualified).length, n), qualifiedN: l.filter((s) => s.qualified).length, completed: pct(l.filter((s) => s.completed).length, n), depth: avg(l.map((s) => s.depth)),
    contacts: l.filter((s) => s.contacted).length, contact: pct(l.filter((s) => s.contacted).length, n), verified: pct(l.filter((s) => s.verified).length, n), returning: pct(new Set(l.filter((s) => s.returning).map((s) => s.vid)).size, vids.size),
    clicks: l.reduce((a, s) => a + (s.cnt.click || 0), 0), score: avg(l.map((s) => s.score)),
  }
}
export type DimRow = { key: string; sessions: number; visitors: number; active: number; depth: number; bounce: number; qualified: number; contact: number }
export function byDim(l: Session[], fn: (s: Session) => string | null | undefined): DimRow[] {
  const m = new Map<string, Session[]>()
  for (const s of l) { const k = fn(s); if (!k) continue; (m.get(k) || m.set(k, []).get(k)!).push(s) }
  return [...m].map(([key, a]) => ({ key, sessions: a.length, visitors: new Set(a.map((s) => s.vid)).size, active: Math.round(avg(a.map((s) => s.active))), depth: Math.round(avg(a.map((s) => s.depth))), bounce: pct(a.filter((s) => s.bounce).length, a.length), qualified: pct(a.filter((s) => s.qualified).length, a.length), contact: pct(a.filter((s) => s.contacted).length, a.length) })).sort((a, b) => b.sessions - a.sessions)
}
export function tally<T>(l: T[], fn: (x: T) => string | null | undefined | false) { const m = new Map<string, number>(); for (const x of l) { const k = fn(x); if (k) m.set(k, (m.get(k) || 0) + 1) } return [...m].sort((a, b) => b[1] - a[1]) }

export function sectionStats(l: Session[]) {
  return SECTIONS.map(({ id, label }) => {
    const v = l.filter((s) => s.sec[id]), dwell = v.map((s) => s.sec[id].act)
    const clicks = l.reduce((a, s) => a + s.clicks.filter((c) => c.p.at === id).length, 0)
    const wc = Math.max(0, ...v.map((s) => s.wc[id] || 0))
    return { id, label, viewers: v.length, reach: pct(v.length, l.length), avg: avg(dwell), median: median(dwell), read: pct(v.filter((s) => s.sec[id].act >= 5).length, v.length), revisit: pct(v.filter((s) => s.sec[id].enters > 1).length, v.length), exit: pct(v.filter((s) => s.exit === id).length, v.length), clicks, words: wc, through: wc ? Math.min(100, Math.round((median(dwell) / (wc / 3.97)) * 100)) : 0 }
  })
}
export function funnel(l: Session[]) {
  const steps: [string, (s: Session) => boolean][] = [
    ['Landed', () => true], ['Engaged', (s) => !s.bounce], ['Saw the answer', (s) => !!s.sec.short], ['Reached the finding', (s) => !!s.sec.workaround],
    ['Reached the plan', (s) => !!s.sec.prove], ['Reached the author', (s) => !!s.sec.author], ['Contacted', (s) => s.contacted],
  ]
  return steps.map(([label, f]) => ({ label, n: l.filter(f).length }))
}
export function cohorts(all: Session[], maxDay = 7) {
  const days = new Map<string, Set<string>>(), first = new Map<string, string>()
  for (const s of all) { (days.get(s.vid) || days.set(s.vid, new Set()).get(s.vid)!).add(s.day); const f = dayKey(s.firstSeen || s.start); if (!first.has(s.vid) || f < first.get(s.vid)!) first.set(s.vid, f) }
  const rows = new Map<string, { size: number; back: number[] }>()
  for (const [v, set] of days) {
    const f = first.get(v)!, r = rows.get(f) || { size: 0, back: Array(maxDay + 1).fill(0) as number[] }
    r.size++
    for (const d of set) { const k = Math.round((Date.parse(d) - Date.parse(f)) / 864e5); if (k >= 0 && k <= maxDay) r.back[k]++ }
    rows.set(f, r)
  }
  return [...rows].sort((a, b) => (a[0] < b[0] ? 1 : -1)).map(([day, r]) => ({ day, ...r }))
}
export const DEFINITIONS: [string, string][] = [
  ['Visitor', 'One browser, identified by a random id in localStorage. Clearing storage or switching device counts as a new visitor.'],
  ['Session', 'A visit. It ends after 30 minutes with no activity and is shared across tabs and reloads.'],
  ['Active time', 'Seconds the tab was visible with input in the last 60 seconds, or with the video open. Time away from the tab does not count.'],
  ['Time open', 'Clock time from the first load to the last signal of the session, including idle time.'],
  ['Bounce', 'Under 10 active seconds and no clicks.'],
  ['Qualified read', 'At least 2 minutes active and at least 50% of the page scrolled.'],
  ['Completed', 'Reached the Author or Sources section.'],
  ['Contact', 'Clicked or swiped LinkedIn, Email, Quick Connect or Portfolio. This is the North Star conversion.'],
  ['Verified sources', 'Clicked at least one external citation.'],
  ['Reader type', 'Bounced, as above. Deep reader: 4+ minutes and 8+ sections read. Reader: 1+ minute and 40%+ depth. Everyone else is a Skimmer.'],
  ['Reader score', '0–100: time 40, depth 25, sections read 15, interactions 10, contact or verification 10.'],
  ['Section reached', 'A section crossed the reading line, 40% down the viewport.'],
  ['Section read', '5+ active seconds in the section.'],
  ['Read-through', 'Median dwell divided by expected reading time at 238 words per minute, capped at 100%.'],
  ['Exit rate', 'Share of a section\'s viewers whose session ended there.'],
  ['Rage click', 'Three clicks within 800ms and 40px of each other.'],
  ['Web Vitals', 'Field values at the 75th percentile. Good: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. INP here is the slowest interaction seen.'],
  ['Location', 'From Vercel\'s edge network, derived from the connection. VPNs and corporate networks can shift it. The IP address is not stored.'],
  ['Excluded', 'Known bots, localhost, browsers using ?me, and browsers that have signed in here. Automated browsers are hidden by default.'],
]
