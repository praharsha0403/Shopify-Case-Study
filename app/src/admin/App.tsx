import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { RiBookOpenLine, RiCursorLine, RiDashboardLine, RiDownload2Line, RiFileListLine, RiFlagLine, RiGlobalLine, RiLinksLine, RiListCheck2, RiLockLine, RiPulseLine, RiRefreshLine, RiRepeatLine, RiCloseLine } from '@remixicon/react'
import { Bands } from '@/ui/fp'
import { CONTACT_LABEL, DEFINITIONS, EVENT_LABEL, SECTIONS, avg, buildSessions, byDim, cohorts, countryName, dayKey, flag, fmtSecs, funnel, p75, pct, secLabel, sectionStats, summary, tally, type DimRow, type Ev, type Rec, type Session } from './metrics'
import { BarList, Empty, Funnel, GlobalTip, HourGrid, Kpi, Line, Meter, Panel, Seg, Table, fmt, type Col } from './ui'
import { WorldMap } from './WorldMap'

type Tab = 'overview' | 'acq' | 'geo' | 'read' | 'act' | 'conv' | 'ret' | 'perf' | 'sess' | 'defs'
const TABS: [Tab, string, string, typeof RiDashboardLine][] = [
  ['overview', 'Overview', 'The whole picture', RiDashboardLine], ['acq', 'Acquisition', 'How people arrive', RiLinksLine], ['geo', 'Audience', 'Where they are and what they use', RiGlobalLine],
  ['read', 'Reading', 'What gets read, section by section', RiBookOpenLine], ['act', 'Actions', 'Every click and interaction', RiCursorLine], ['conv', 'Conversion', 'Who reaches out, and what led there', RiFlagLine],
  ['ret', 'Retention', 'Who comes back', RiRepeatLine], ['perf', 'Quality', 'Speed and errors in the field', RiPulseLine], ['sess', 'Sessions', 'Every visit, event by event', RiFileListLine], ['defs', 'Definitions', 'How each number is calculated', RiListCheck2],
]
type Range = '1' | '7' | '30' | '90' | 'all'
type Filters = { country: string; region: string; city: string; channel: string; device: string; type: string }
const NOF: Filters = { country: '', region: '', city: '', channel: '', device: '', type: '' }
const when = (ms: number) => new Date(ms).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
const ago = (ms: number, now: number) => { const s = Math.max(0, (now - ms) / 1000); return s < 60 ? 'just now' : s < 3600 ? `${Math.floor(s / 60)}m ago` : s < 86400 ? `${Math.floor(s / 3600)}h ago` : `${Math.floor(s / 86400)}d ago` }
const delta = (a: number, b: number) => (b ? Math.round(((a - b) / b) * 100) : null)
const post = (action: string, extra = {}) => fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...extra }) })
const safe = (k: string, v?: string | null) => { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v) } catch { /* */ } return null }
const place = (s: Session) => [s.city, s.regionName, countryName(s.country)].filter(Boolean).join(', ')
const Wall = () => <div className="adm-wall" aria-hidden><Bands /></div>
const Dp = ({ size = 40 }: { size?: number }) => <img className="adm-dp" src="/ref/praharsha.webp" alt="Praharsha Nelaturi" width={size} height={size} />

function Lock({ onOk, setupMsg }: { onOk: () => void; setupMsg: string }) {
  const [pw, setPw] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr('')
    try { const r = await post('login', { password: pw }); if (r.ok) { safe('pn-me', '1'); onOk() } else setErr((await r.json()).error || 'Could not sign in.') } catch { setErr('Could not reach the server.') } finally { setBusy(false) }
  }
  return <div className="adm-lock"><Wall /><form className="adm-lock-c" onSubmit={submit}><Dp size={76} /><h1>Case study analytics</h1><p>Praharsha Nelaturi · Private</p>
    <label htmlFor="pw">Password</label><input id="pw" type="password" autoComplete="current-password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} aria-invalid={!!err} />
    {err && <div className="adm-err" role="alert">{err}</div>}{setupMsg && <div className="adm-err" role="status">{setupMsg}</div>}
    <button type="submit" className="btn btn-dark" disabled={busy || !pw}>{busy ? 'Unlocking…' : 'Unlock'}</button></form></div>
}

const dimCols = (first: string, show?: (r: DimRow) => ReactNode): Col<DimRow>[] => [
  { key: 'key', label: first, get: (r) => r.key, show: show || ((r) => <b>{r.key}</b>) }, { key: 'sessions', label: 'Sessions', right: true, get: (r) => r.sessions, show: (r) => fmt(r.sessions) }, { key: 'visitors', label: 'Visitors', right: true, get: (r) => r.visitors, show: (r) => fmt(r.visitors) },
  { key: 'active', label: 'Avg active', right: true, get: (r) => r.active, show: (r) => fmtSecs(r.active) }, { key: 'depth', label: 'Depth', right: true, get: (r) => r.depth, show: (r) => `${r.depth}%` }, { key: 'bounce', label: 'Bounce', right: true, get: (r) => r.bounce, show: (r) => `${r.bounce}%` },
  { key: 'qualified', label: 'Qualified', right: true, get: (r) => r.qualified, show: (r) => `${r.qualified}%` }, { key: 'contact', label: 'Contact', right: true, get: (r) => r.contact, show: (r) => `${r.contact}%` },
]
function download(name: string, text: string, type: string) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href) }
function csv(l: Session[]) {
  const head = ['start', 'visitor', 'session', 'visit_number', 'channel', 'referrer', 'campaign', 'landing', 'country', 'region', 'city', 'device', 'os', 'browser', 'active_s', 'open_s', 'depth', 'sections_read', 'clicks', 'type', 'score', 'qualified', 'contacted', 'verified', 'exit']
  const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [head.join(','), ...l.map((s) => [new Date(s.start).toISOString(), s.vid, s.sid, s.n, s.channel, s.refHost, s.utm.campaign || s.tag, s.landing, s.country, s.regionName, s.city, s.device, s.os, s.browser, s.active, s.wall, s.depth, s.secsRead, s.cnt.click || 0, s.type, s.score, s.qualified, s.contacted, s.verified, s.exit].map(q).join(','))].join('\n')
}

export default function App() {
  const [recs, setRecs] = useState<Map<string, Rec>>(new Map()), [now, setNow] = useState(Date.now()), [state, setState] = useState<'loading' | 'locked' | 'ok' | 'error'>('loading'), [setupMsg, setSetupMsg] = useState(''), [noStore, setNoStore] = useState(false)
  const [range, setRange] = useState<Range>('30'), [tab, setTab] = useState<Tab>('overview'), [f, setF] = useState<Filters>(NOF), [open, setOpen] = useState<Session | null>(null), [spin, setSpin] = useState(false), [excluded, setExcluded] = useState(!!safe('pn-me')), [showBots, setShowBots] = useState(false)
  const since = useRef(0), demo = import.meta.env.DEV && new URLSearchParams(location.search).has('demo')

  const load = useCallback(async () => {
    setSpin(true)
    try {
      if (import.meta.env.DEV && demo) { const { demoRecords } = await import('./demo'); setRecs(new Map(demoRecords().map((r) => [`${r.sid}~${r.ctx}`, r]))); setState('ok'); return }
      const incoming: Rec[] = []; let offset: number | null = 0, stamp = Date.now()
      while (offset != null) {
        const r: Response = await fetch(`/api/stats?since=${since.current}&offset=${offset}`, { cache: 'no-store' })
        if (r.status === 401) { setState('locked'); return }
        if (!r.ok) throw new Error('bad')
        const j = await r.json() as { now: number; records: Rec[]; next: number | null; noStore?: boolean }
        incoming.push(...j.records); stamp = j.now; offset = j.next; setNoStore(!!j.noStore)
      }
      since.current = stamp; setNow(stamp)
      if (incoming.length) setRecs((m) => { const n = new Map(m); for (const r of incoming) n.set(`${r.sid}~${r.ctx}`, r); return n })
      setState('ok')
    } catch { setState((s) => (s === 'ok' ? 'ok' : 'error')) } finally { setTimeout(() => setSpin(false), 300) }
  }, [demo])
  useEffect(() => { if (demo) { load(); return } fetch('/api/auth').then((r) => r.json()).then((j) => { if (!j.setup?.password) setSetupMsg('Setup is not finished on the server.'); if (j.authed) load(); else setState('locked') }).catch(() => setState('error')) }, [load, demo])
  useEffect(() => { const t = setInterval(() => { if (!document.hidden && state === 'ok') load() }, 120000); return () => clearInterval(t) }, [load, state])

  const all = useMemo(() => buildSessions([...recs.values()], now).filter((s) => showBots || !s.automated), [recs, now, showBots])
  const span = range === 'all' ? Infinity : +range * 864e5
  const pass = useCallback((s: Session) => (!f.country || s.country === f.country) && (!f.region || s.region === f.region) && (!f.city || s.city === f.city) && (!f.channel || s.channel === f.channel) && (!f.device || s.device === f.device) && (!f.type || s.type === f.type), [f])
  const cur = useMemo(() => all.filter((s) => s.start > now - span && pass(s)), [all, now, span, pass])
  const prev = useMemo(() => (span === Infinity ? [] : all.filter((s) => s.start <= now - span && s.start > now - 2 * span && pass(s))), [all, now, span, pass])
  const sm = useMemo(() => summary(cur), [cur]), pm = useMemo(() => summary(prev), [prev]), live = all.filter((s) => s.live)
  const logout = () => post('logout').finally(() => { setRecs(new Map()); since.current = 0; setState('locked') })

  if (state === 'locked') return <Lock setupMsg={setupMsg} onOk={() => { setExcluded(true); setState('loading'); load() }} />
  if (state !== 'ok') return <div className="adm-load"><Wall /><span>{state === 'error' ? 'Could not load analytics. Refresh to try again.' : 'Loading…'}</span></div>
  const meta = TABS.find((t) => t[0] === tab)!
  const chips = (Object.entries(f) as [keyof Filters, string][]).filter(([, v]) => v)
  const set = (k: keyof Filters, v: string) => { setF((o) => ({ ...o, [k]: o[k] === v ? '' : v })); if (tab !== 'sess') scrollTo({ top: 0, behavior: 'smooth' }) }
  const p = { cur, all, sm, pm, now, set, f, open: setOpen }
  return <div className="adm"><Wall /><GlobalTip />
    <aside className="adm-side">
      <div className="adm-me"><Dp /><div><b>Praharsha Nelaturi</b><span>Shopify case study</span></div></div>
      <nav aria-label="Dashboard sections">{TABS.map(([k, l, , Ic]) => <button key={k} type="button" aria-current={tab === k ? 'page' : undefined} onClick={() => { setTab(k); scrollTo({ top: 0 }) }}><Ic size={17} />{l}</button>)}</nav>
      <div className="adm-side-b">
        <div className="adm-live" data-tip="Sessions with a signal in the last 5 minutes"><i data-on={live.length > 0 || undefined} />{live.length} reading now</div>
        <button type="button" className="adm-mini" data-tip="When excluded, your own visits from this browser are not recorded" onClick={() => { if (excluded) { safe('pn-me', null); setExcluded(false) } else { safe('pn-me', '1'); setExcluded(true) } }}>This browser: {excluded ? 'excluded' : 'tracked'}</button>
        <button type="button" className="adm-mini" onClick={() => setShowBots(!showBots)}>Automated visits: {showBots ? 'shown' : 'hidden'}</button>
        {!demo && <button type="button" className="adm-mini" onClick={logout}><RiLockLine size={14} /> Lock</button>}
      </div>
    </aside>
    <div className="adm-main">
      <header className="adm-top">
        <div className="adm-top-t"><h1>{meta[1]}</h1><p>{meta[2]}</p></div>
        <div className="adm-top-r">
          <Seg label="Date range" value={range} onChange={setRange} options={[['1', '24h'], ['7', '7d'], ['30', '30d'], ['90', '90d'], ['all', 'All']]} />
          <button type="button" className="adm-icon" aria-label="Refresh" data-spin={spin || undefined} onClick={load}><RiRefreshLine size={16} /></button>
          <button type="button" className="adm-icon" aria-label="Download sessions as CSV" data-tip="Download this view as CSV" onClick={() => download(`case-study-sessions-${dayKey(now)}.csv`, csv(cur), 'text/csv')}><RiDownload2Line size={16} /></button>
        </div>
        <nav className="adm-mtabs" aria-label="Dashboard sections, mobile">{TABS.map(([k, l]) => <button key={k} type="button" data-on={tab === k || undefined} onClick={() => setTab(k)}>{l}</button>)}</nav>
      </header>
      <div className="adm-body">
        {noStore && <div className="adm-warn">Storage is not connected, so nothing is being recorded yet.</div>}
        {chips.length > 0 && <div className="adm-chips">{chips.map(([k, v]) => <button key={k} type="button" onClick={() => set(k, v)}>{k === 'country' ? countryName(v) : v}<RiCloseLine size={13} /></button>)}<button type="button" className="adm-clear" onClick={() => setF(NOF)}>Clear all</button></div>}
        {all.length === 0 && <div className="adm-warn adm-warn--blue">No visits recorded yet. Tracking is live; the first visitor will appear here within about 10 seconds of arriving.</div>}
        {tab === 'overview' && <Overview {...p} />}{tab === 'acq' && <Acq {...p} />}{tab === 'geo' && <Geo {...p} />}{tab === 'read' && <Read {...p} />}{tab === 'act' && <Actions {...p} />}{tab === 'conv' && <Conv {...p} />}{tab === 'ret' && <Ret {...p} />}{tab === 'perf' && <Perf {...p} />}{tab === 'sess' && <Sess {...p} />}{tab === 'defs' && <Defs />}
      </div>
    </div>
    {open && <Drawer s={open} onClose={() => setOpen(null)} />}
  </div>
}
type P = { cur: Session[]; all: Session[]; sm: ReturnType<typeof summary>; pm: ReturnType<typeof summary>; now: number; set: (k: keyof Filters, v: string) => void; f: Filters; open: (s: Session) => void }

function Overview({ cur, sm, pm, now, set, open, all }: P) {
  const [metric, setMetric] = useState<'sessions' | 'visitors' | 'active' | 'contacts'>('sessions')
  const trend = useMemo(() => {
    const m = new Map<string, Session[]>(); for (const s of cur) (m.get(s.day) || m.set(s.day, []).get(s.day)!).push(s)
    const days = [...m.keys()].sort(); if (!days.length) return []
    const out: { x: string; y: number }[] = []
    for (let t = Date.parse(days[0] + 'T12:00'); t <= Date.parse(days[days.length - 1] + 'T12:00'); t += 864e5) { const k = dayKey(t), a = m.get(k) || []; out.push({ x: new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), y: metric === 'sessions' ? a.length : metric === 'visitors' ? new Set(a.map((s) => s.vid)).size : metric === 'contacts' ? a.filter((s) => s.contacted).length : avg(a.map((s) => s.active)) }) }
    return out
  }, [cur, metric])
  return <>
    <div className="adm-kpis">
      <Kpi label="Contacts" value={fmt(sm.contacts)} delta={delta(sm.contacts, pm.contacts)} hint="North Star: sessions that used LinkedIn, Email, Quick Connect or Portfolio" />
      <Kpi label="Visitors" value={fmt(sm.visitors)} delta={delta(sm.visitors, pm.visitors)} hint="Unique browsers" />
      <Kpi label="Sessions" value={fmt(sm.sessions)} delta={delta(sm.sessions, pm.sessions)} hint="Visits, 30 minute inactivity window" />
      <Kpi label="Qualified reads" value={`${sm.qualified}%`} delta={delta(sm.qualified, pm.qualified)} hint="2+ active minutes and 50%+ depth" />
      <Kpi label="Median active time" value={fmtSecs(sm.medianActive)} delta={delta(sm.medianActive, pm.medianActive)} hint="Visible tab with recent input" />
      <Kpi label="Completed" value={`${sm.completed}%`} delta={delta(sm.completed, pm.completed)} hint="Reached Author or Sources" />
      <Kpi label="Verified sources" value={`${sm.verified}%`} delta={delta(sm.verified, pm.verified)} hint="Clicked at least one citation" />
      <Kpi label="Bounce" value={`${sm.bounce}%`} delta={delta(sm.bounce, pm.bounce)} invert hint="Under 10 active seconds and no clicks" />
    </div>
    <div className="adm-grid">
      <Panel span={2} title="Trend" sub="Daily, in your timezone" right={<Seg label="Trend metric" value={metric} onChange={setMetric} options={[['sessions', 'Sessions'], ['visitors', 'Visitors'], ['active', 'Avg active'], ['contacts', 'Contacts']]} />}><Line data={trend} format={metric === 'active' ? fmtSecs : (n) => fmt(Math.round(n * 10) / 10)} /></Panel>
      <Panel title="Reading funnel" sub="Sessions at each stage"><Funnel steps={funnel(cur)} /></Panel>
      <Panel title="Reader mix" sub="Select a type to filter"><BarList rows={tally(cur, (s) => s.type)} onPick={(k) => set('type', k)} /></Panel>
      <Panel title="Top channels"><BarList rows={tally(cur, (s) => s.channel)} onPick={(k) => set('channel', k)} limit={6} /></Panel>
      <Panel title="Top cities"><BarList rows={tally(cur, (s) => s.city && `${s.city}, ${s.country}`)} limit={6} /></Panel>
      <Panel span={2} title="Latest visits" sub="Select one to see every event"><SessionTable l={all.slice(0, 40)} now={now} open={open} limit={6} /></Panel>
    </div></>
}
function SessionTable({ l, now, open, limit = 15 }: { l: Session[]; now: number; open: (s: Session) => void; limit?: number }) {
  const cols: Col<Session>[] = [
    { key: 'start', label: 'When', get: (s) => s.start, show: (s) => <span data-tip={when(s.start)}>{s.live && <i className="adm-pulse" />}{ago(s.start, now)}</span> }, { key: 'place', label: 'Location', get: place, show: (s) => <span>{flag(s.country)} {s.city || countryName(s.country)}</span> }, { key: 'channel', label: 'Source', get: (s) => s.channel },
    { key: 'device', label: 'Device', get: (s) => s.device, show: (s) => `${s.device} · ${s.browser}` }, { key: 'active', label: 'Active', right: true, get: (s) => s.active, show: (s) => fmtSecs(s.active) }, { key: 'depth', label: 'Depth', right: true, get: (s) => s.depth, show: (s) => `${s.depth}%` }, { key: 'clicks', label: 'Clicks', right: true, get: (s) => s.cnt.click || 0 },
    { key: 'score', label: 'Score', right: true, get: (s) => s.score }, { key: 'type', label: 'Outcome', get: (s) => (s.contacted ? 'Contacted' : s.type), show: (s) => <span className="adm-badge" data-c={s.contacted || undefined}>{s.contacted ? 'Contacted' : s.type}</span> },
  ]
  return <Table cols={cols} rows={l} onRow={open} limit={limit} />
}
function Acq({ cur, set }: P) {
  const tags = byDim(cur, (s) => s.utm.campaign || s.tag), land = tally(cur, (s) => s.landing), ref = byDim(cur, (s) => s.refHost)
  return <div className="adm-grid"><Panel span={2} title="Channels" sub="Campaign tag first, then referrer, then in-app browser. Select a row to filter."><Table cols={dimCols('Channel')} rows={byDim(cur, (s) => s.channel)} onRow={(r) => set('channel', r.key)} /></Panel>
    <Panel title="Channel groups"><BarList rows={tally(cur, (s) => s.group)} /></Panel><Panel title="First touch" sub="The channel that first brought each session's visitor"><BarList rows={tally(cur, (s) => s.ftChannel)} /></Panel>
    <Panel span={2} title="Referring sites"><Table cols={dimCols('Site')} rows={ref} /></Panel>
    <Panel span={2} title="Campaigns and tagged links" sub="Add ?ref=name or utm_campaign to any link you send. For example, ?ref=shopify-recruiter."><Table cols={dimCols('Tag')} rows={tags} /></Panel>
    <Panel title="Landing point"><BarList rows={land} /></Panel><Panel title="Medium"><BarList rows={tally(cur, (s) => s.utm.medium)} /></Panel></div>
}
function Geo({ cur, set, f }: P) {
  const [lvl, setLvl] = useState<'country' | 'region' | 'city'>('country')
  const cityPts = useMemo(() => { const m = new Map<string, { city: string; lat: number; lon: number; n: number }>(); for (const s of cur) if (s.city && s.lat != null && s.lon != null) { const e = m.get(s.city + s.country) || { city: s.city, lat: s.lat, lon: s.lon, n: 0 }; e.n++; m.set(s.city + s.country, e) } return [...m.values()] }, [cur])
  const rows = byDim(cur, (s) => (lvl === 'country' ? s.country : lvl === 'region' ? s.region && `${s.regionName}|${s.country}|${s.region}` : s.city && `${s.city}|${s.regionName}|${s.country}`))
  const label = (r: DimRow) => { if (lvl === 'country') return <b>{flag(r.key)} {countryName(r.key)}</b>; const [a, b, c] = r.key.split('|'); return <span><b>{a}</b> <em className="adm-dim">{lvl === 'region' ? countryName(b) : [b, countryName(c)].filter(Boolean).join(', ')}</em></span> }
  const pick = (r: DimRow) => { if (lvl === 'country') { set('country', r.key); setLvl('region') } else if (lvl === 'region') { set('region', r.key.split('|')[2]); setLvl('city') } else set('city', r.key.split('|')[0]) }
  const hours = useMemo(() => { const g = Array.from({ length: 7 }, () => Array(24).fill(0) as number[]); for (const s of cur) g[s.dow][s.hour]++; return g }, [cur])
  return <div className="adm-grid"><Panel span={2} title="World" sub={f.country ? `Zoomed to ${countryName(f.country)}` : 'Countries shaded by sessions, cities sized by sessions. Select a country to zoom.'}><WorldMap countries={tally(cur, (s) => s.country)} cities={cityPts} focus={f.country} onPick={(c) => { set('country', c); setLvl('region') }} /></Panel>
    <Panel span={2} title="Location detail" sub="Select a row to drill from country to state to city" right={<Seg label="Location level" value={lvl} onChange={setLvl} options={[['country', 'Countries'], ['region', 'States'], ['city', 'Cities']]} />}><Table cols={dimCols(lvl === 'country' ? 'Country' : lvl === 'region' ? 'State or region' : 'City', label)} rows={rows} onRow={pick} /></Panel>
    <Panel span={2} title="When they read" sub="Hour of day in your timezone"><HourGrid cells={hours} /></Panel>
    <Panel title="Device"><BarList rows={tally(cur, (s) => s.device)} onPick={(k) => set('device', k)} /></Panel><Panel title="Screen"><BarList rows={tally(cur, (s) => s.screen)} /></Panel><Panel title="Browser"><BarList rows={tally(cur, (s) => s.browser)} /></Panel><Panel title="Operating system"><BarList rows={tally(cur, (s) => s.os)} /></Panel><Panel title="Language"><BarList rows={tally(cur, (s) => s.lang)} /></Panel><Panel title="Visitor timezone"><BarList rows={tally(cur, (s) => s.tz)} /></Panel><Panel title="Connection"><BarList rows={tally(cur, (s) => s.conn)} /></Panel><Panel title="Colour preference"><BarList rows={tally(cur, (s) => (s.dark ? 'Dark' : 'Light'))} /></Panel></div>
}
function Read({ cur }: P) {
  const st = useMemo(() => sectionStats(cur), [cur])
  const blocks = useMemo(() => { const m = new Map<string, number>(); for (const s of cur) for (const [k, v] of Object.entries(s.blk)) m.set(k, (m.get(k) || 0) + v); return [...m].sort((a, b) => b[1] - a[1]) as [string, number][] }, [cur])
  const milestones = [25, 50, 75, 90, 100].map((m) => ({ m, n: cur.filter((s) => s.ms[m] != null), }))
  const cols: Col<(typeof st)[0]>[] = [{ key: 'label', label: 'Section', get: (r) => r.label, show: (r) => <b>{r.label}</b> }, { key: 'reach', label: 'Reach', get: (r) => r.reach, show: (r) => <Meter v={r.reach} /> }, { key: 'avg', label: 'Avg dwell', right: true, get: (r) => r.avg, show: (r) => fmtSecs(r.avg) }, { key: 'through', label: 'Read-through', right: true, get: (r) => r.through, show: (r) => `${r.through}%` }, { key: 'read', label: 'Read', right: true, get: (r) => r.read, show: (r) => `${r.read}%` }, { key: 'revisit', label: 'Revisited', right: true, get: (r) => r.revisit, show: (r) => `${r.revisit}%` }, { key: 'exit', label: 'Exit', right: true, get: (r) => r.exit, show: (r) => `${r.exit}%` }, { key: 'clicks', label: 'Clicks', right: true, get: (r) => r.clicks }]
  return <div className="adm-grid"><Panel span={2} title="Retention through the page" sub="Share of sessions reaching each section, in page order"><Line data={st.map((s) => ({ x: s.label, y: s.reach }))} format={(n) => `${Math.round(n)}%`} /></Panel>
    <Panel span={2} title="Section performance" sub="Every section of the case study"><Table cols={cols} rows={st} limit={20} /></Panel>
    <Panel title="Scroll milestones" sub="Sessions and median seconds to get there">{<div className="adm-ms">{milestones.map(({ m, n }) => <div key={m} data-tip={`${n.length} sessions reached ${m}%`}><b>{m}%</b><span>{pct(n.length, cur.length)}%</span><em>{fmtSecs(avg(n.map((s) => s.ms[m])))}</em></div>)}</div>}</Panel>
    <Panel title="Reading style"><BarList rows={[['Scrolled back to re-read', cur.filter((s) => s.reversals >= 4).length], ['Went to another tab and returned', cur.filter((s) => s.hides > 0 && s.cnt.tab_show).length], ['Used keyboard to scroll', cur.filter((s) => s.cnt.key_scroll).length], ['Highlighted text', cur.filter((s) => s.cnt.select).length], ['Copied text', cur.filter((s) => s.cnt.copy).length]].filter((x) => x[1]) as [string, number][]} total={cur.length} /></Panel>
    <Panel span={2} title="Most-read headings" sub="Total active seconds with this heading at the reading line"><BarList rows={blocks} unit="seconds" limit={12} /></Panel></div>
}
const KIND: Record<string, string> = { nav: 'Top navigation', jump: 'In-page links', source: 'Sources and citations', contact: 'Contact', toggle: 'Expand and toggle', control: 'Buttons and controls', text: 'Clicks on non-interactive content' }
function ClickStrips({ clicks }: { clicks: Ev[] }) {
  return <div className="adm-strips">{SECTIONS.map((s) => { const c = clicks.filter((e) => e.p.at === s.id && e.p.y != null); return <div key={s.id} className="adm-strip"><span>{s.label}<em>{c.length}</em></span><div>{c.slice(0, 200).map((e, i) => <i key={i} data-k={e.p.k} data-tip={`${KIND[String(e.p.k)] || e.p.k}: ${e.p.l}`} style={{ left: `${+e.p.x / 10}%`, top: `${Math.min(100, +e.p.y / 10)}%` }} />)}</div></div> })}</div>
}
function Actions({ cur, sm }: P) {
  const ev = useMemo(() => cur.flatMap((s) => s.events), [cur]), clicks = ev.filter((e) => e.name === 'click')
  const count = (n: string) => tally(ev.filter((e) => e.name === n), (e) => String(e.p.l || e.p.t || e.p.id || '')) as [string, number][]
  const rage = cur.reduce((a, s) => a + s.rage, 0), find = cur.filter((s) => s.cnt.find).length, print = cur.filter((s) => s.cnt.print).length, videos = ev.filter((e) => e.name === 'video_close').map((e) => +e.p.s)
  return <><div className="adm-kpis"><Kpi label="Total clicks" value={fmt(sm.clicks)} hint="Every click on the page" /><Kpi label="Clicks per session" value={(sm.sessions ? sm.clicks / sm.sessions : 0).toFixed(1)} hint="Total clicks divided by sessions" /><Kpi label="Rage clicks" value={fmt(rage)} hint="3 clicks within 800ms and 40px" /><Kpi label="Find or print" value={`${find} · ${print}`} hint="Sessions using find on page, and sessions printing" /></div>
    <div className="adm-grid"><Panel span={2} title="Click map" sub="Where clicks land inside each section. Blue is interactive, grey is non-interactive content."><ClickStrips clicks={clicks} /></Panel>
      <Panel title="Click types"><BarList rows={tally(clicks, (e) => KIND[String(e.p.k)] || String(e.p.k))} unit="clicks" /></Panel><Panel title="Top clicked elements"><BarList rows={tally(clicks.filter((e) => e.p.k !== 'text'), (e) => String(e.p.l))} unit="clicks" limit={12} /></Panel>
      <Panel title="Sources opened" sub="Which citations people check"><BarList rows={tally(clicks.filter((e) => e.p.k === 'source'), (e) => String(e.p.l))} unit="clicks" limit={12} /></Panel><Panel title="Source domains"><BarList rows={tally(clicks.filter((e) => e.p.h), (e) => String(e.p.h))} unit="clicks" /></Panel>
      <Panel title="Navigation used"><BarList rows={tally(clicks.filter((e) => e.p.k === 'nav' || e.p.k === 'jump'), (e) => String(e.p.l))} unit="clicks" limit={10} /></Panel><Panel title="Expanded content"><BarList rows={count('expand')} unit="opens" /></Panel>
      <Panel title="Charts studied" sub="Pointer held over a chart for 1.2s+"><BarList rows={count('hover')} unit="hovers" /></Panel><Panel title="Video" sub={videos.length ? `Average ${fmtSecs(avg(videos))} open` : undefined}><BarList rows={count('video_open')} unit="plays" /></Panel>
      <Panel title="Copied text"><BarList rows={count('copy')} unit="copies" /></Panel><Panel title="Highlighted text"><BarList rows={count('select')} unit="highlights" /></Panel>
      <Panel title="Rage clicks by element"><BarList rows={count('rage')} unit="events" /></Panel><Panel title="All event types"><BarList rows={tally(ev, (e) => EVENT_LABEL[e.name] || e.name)} unit="events" limit={12} /></Panel></div></>
}
function Conv({ cur, sm }: P) {
  const contacts = cur.filter((s) => s.contacted), ev = contacts.flatMap((s) => s.contacts), times = contacts.map((s) => s.firstContact!).filter((x) => x != null)
  return <><div className="adm-kpis"><Kpi label="Sessions that contacted" value={fmt(sm.contacts)} hint="LinkedIn, Email, Quick Connect or Portfolio" /><Kpi label="Contact rate" value={`${sm.contact}%`} hint="Share of sessions" /><Kpi label="Avg time to contact" value={fmtSecs(avg(times))} hint="From arrival to first contact" /><Kpi label="Avg reader score" value={Math.round(avg(contacts.map((s) => s.score))).toString()} hint="Among sessions that contacted" /></div>
    <div className="adm-grid"><Panel span={2} title="Reading funnel"><Funnel steps={funnel(cur)} /></Panel><Panel title="Contact method"><BarList rows={tally(ev, (e) => CONTACT_LABEL[String(e.p.c)] || String(e.p.c))} unit="actions" /></Panel><Panel title="Section that prompted it"><BarList rows={tally(ev, (e) => secLabel(String(e.p.at)))} unit="actions" /></Panel>
      <Panel title="Channels that convert"><BarList rows={tally(contacts, (s) => s.channel)} total={contacts.length} /></Panel><Panel title="Cities that convert"><BarList rows={tally(contacts, (s) => s.city && `${s.city}, ${s.country}`)} total={contacts.length} /></Panel>
      <Panel span={2} title="Contact rate by reader type"><Table cols={dimCols('Reader type')} rows={byDim(cur, (s) => s.type)} /></Panel></div></>
}
function Ret({ all, cur }: P) {
  const rows = cohorts(all, 7).slice(0, 14), freq = tally([...tally(cur, (s) => s.vid)], ([, n]) => (n >= 5 ? '5+ visits' : `${n} visit${n > 1 ? 's' : ''}`))
  return <div className="adm-grid"><Panel title="New and returning"><BarList rows={tally(cur, (s) => (s.returning ? 'Returning' : 'New'))} /></Panel><Panel title="Visits per visitor"><BarList rows={freq.sort()} unit="visitors" /></Panel>
    <Panel span={2} title="Cohorts" sub="Visitors by first day, and the share who came back N days later">{rows.length ? <div className="adm-table-w"><table className="adm-table adm-coh"><thead><tr><th>First seen</th><th data-right>Size</th>{Array.from({ length: 8 }, (_, i) => <th key={i} data-right>D{i}</th>)}</tr></thead><tbody>{rows.map((r) => <tr key={r.day}><td>{r.day}</td><td data-right>{r.size}</td>{r.back.map((b, i) => { const v = pct(b, r.size); return <td key={i} data-right data-tip={`${b} of ${r.size} visitors`} style={{ background: `rgba(0,115,255,${v / 130})`, color: v > 62 ? '#fff' : undefined }}>{v ? `${Math.round(v)}%` : '–'}</td> })}</tr>)}</tbody></table></div> : <Empty />}</Panel>
    <Panel span={2} title="Repeat readers" sub="Likely shared or re-read, ordered by visits"><Table cols={dimCols('Visitor')} rows={byDim(cur.filter((s) => s.n > 1), (s) => `${s.vid} · ${s.city || s.country}`)} /></Panel></div>
}
function Perf({ cur }: P) {
  const v = (k: string) => cur.map((s) => s.perf[k]).filter((x) => x != null)
  const by = byDim(cur, (s) => `${s.device} · ${s.browser}`), errors = cur.flatMap((s) => s.errors)
  return <><div className="adm-kpis"><Kpi label="LCP p75" value={`${(p75(v('lcp')) / 1000).toFixed(2)}s`} hint="Good at 2.5s or less" /><Kpi label="INP p75" value={`${Math.round(p75(v('inp')))}ms`} hint="Good at 200ms or less" /><Kpi label="CLS p75" value={(p75(v('cls')) / 1000).toFixed(3)} hint="Good at 0.1 or less" /><Kpi label="TTFB p75" value={`${Math.round(p75(v('ttfb')))}ms`} hint="Time to first byte" /></div>
    <div className="adm-grid"><Panel span={2} title="By device and browser"><Table cols={dimCols('Device')} rows={by} /></Panel><Panel title="Errors"><BarList rows={tally(errors, (e) => String(e.p.m || e.p.l))} unit="errors" /></Panel><Panel title="Sessions with an error"><BarList rows={[['Clean', cur.filter((s) => !s.errors.length).length], ['With error', cur.filter((s) => s.errors.length).length]]} /></Panel></div></>
}
function Sess({ cur, now, open }: P) { return <Panel title={`${fmt(cur.length)} sessions`} sub="Select any visit for its full timeline"><SessionTable l={cur} now={now} open={open} limit={25} /></Panel> }
function Defs() { return <Panel title="Metric definitions" sub="Each number has one definition across the dashboard"><dl className="adm-defs">{DEFINITIONS.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl></Panel> }
function evText(e: Ev) { const l = EVENT_LABEL[e.name] || e.name; if (e.name === 'section') return `Entered ${secLabel(String(e.p.s))}`; if (e.name === 'contact') return `Contact: ${CONTACT_LABEL[String(e.p.c)] || e.p.c} (${e.p.via})`; if (e.name === 'click') return `Clicked “${e.p.l}”${e.p.h ? ` → ${e.p.h}` : e.p.to ? ` → #${e.p.to}` : ''}`; const d = e.p.l || e.p.t || e.p.to || e.p.m; return d ? `${l}: ${d}` : l }
function Drawer({ s, onClose }: { s: Session; onClose: () => void }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [onClose])
  const facts: [string, string][] = [['Location', place(s) || 'Unknown'], ['Postal', s.postal || '–'], ['Source', s.channel + (s.refHost ? ` (${s.refHost})` : '')], ['First touch', s.ftChannel], ['Campaign', s.utm.campaign || s.tag || '–'], ['Device', `${s.device}, ${s.os}, ${s.browser}`], ['Viewport', `${s.vw}px`], ['Language', s.lang], ['Timezone', s.tz], ['Visit number', String(s.n)], ['Page loads', String(s.loads)], ['Active', fmtSecs(s.active)], ['Open', fmtSecs(s.wall)], ['Depth', `${s.depth}%`], ['Sections read', String(s.secsRead)], ['Reader score', String(s.score)], ['Left the tab', `${s.hides}×`], ['Last section', secLabel(s.exit)]]
  const dwell = SECTIONS.filter((x) => s.sec[x.id]).map((x) => [x.label, s.sec[x.id].act] as [string, number])
  return <div className="adm-dr-bg" onClick={onClose}><aside className="adm-dr" role="dialog" aria-modal="true" aria-label="Session detail" onClick={(e) => e.stopPropagation()}>
    <header><div><h2>{flag(s.country)} {s.city || 'Unknown location'}</h2><p>{when(s.start)} · {s.contacted ? 'Contacted' : s.type}</p></div><button type="button" className="adm-icon" aria-label="Close" onClick={onClose}><RiCloseLine size={17} /></button></header>
    <dl className="adm-facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    <h3>Time per section</h3><BarList rows={dwell} unit="seconds" limit={20} />
    <h3>Timeline</h3><ol className="adm-tl">{s.events.filter((e) => e.name !== 'tab_show').map((e, i) => <li key={i} data-n={e.name}><time>{fmtSecs((e.at - s.start) / 1000)}</time><span>{evText(e)}</span></li>)}</ol>
  </aside></div>
}
