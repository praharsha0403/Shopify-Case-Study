import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

export const fmt = (n: number) => n.toLocaleString('en-US')
const RAMP = ['#e8f2ff', '#bcdaff', '#85bbff', '#4797ff', '#0073ff', '#0059c7']
export const rampAt = (t: number) => RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.floor(t * RAMP.length)))]

/* one tooltip for the whole dashboard: any element with data-tip gets it */
export function GlobalTip() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = ref.current, t = (e.target as Element)?.closest?.('[data-tip]'); if (!el) return
      if (!t) { el.style.opacity = '0'; return }
      el.textContent = t.getAttribute('data-tip'); el.style.opacity = '1'
      const w = el.offsetWidth, x = Math.min(innerWidth - w - 8, e.clientX + 14)
      el.style.transform = `translate(${Math.max(8, x)}px,${e.clientY > 70 ? e.clientY - el.offsetHeight - 12 : e.clientY + 18}px)`
    }
    addEventListener('pointermove', move, { passive: true }); return () => removeEventListener('pointermove', move)
  }, [])
  return <div ref={ref} className="adm-tip" role="status" />
}
export function Panel({ title, sub, right, children, span }: { title: string; sub?: string; right?: ReactNode; children: ReactNode; span?: 1 | 2 }) {
  return <section className="adm-panel" data-span={span}><header className="adm-ph"><div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>{right}</header>{children}</section>
}
export function Kpi({ label, value, delta, hint, invert }: { label: string; value: string; delta?: number | null; hint: string; invert?: boolean }) {
  const up = (delta ?? 0) >= 0, good = invert ? !up : up
  return <div className="adm-kpi" data-tip={hint}><span className="adm-kpi-l">{label}</span><strong>{value}</strong>{delta != null ? <span className="adm-delta" data-good={good}>{up ? '↑' : '↓'} {Math.abs(delta)}% <em>vs prior</em></span> : <span className="adm-delta adm-delta--none">No prior data</span>}</div>
}
export function Seg<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: [T, string][]; label: string }) {
  return <div className="adm-seg" role="radiogroup" aria-label={label}>{options.map(([v, l]) => <button key={v} type="button" role="radio" aria-checked={value === v} data-on={value === v || undefined} onClick={() => onChange(v)}>{l}</button>)}</div>
}
export const Empty = ({ children = 'No data in this view yet.' }: { children?: ReactNode }) => <div className="adm-empty">{children}</div>

export function BarList({ rows, total, unit = 'sessions', onPick, limit = 10 }: { rows: [string, number][]; total?: number; unit?: string; onPick?: (k: string) => void; limit?: number }) {
  const [all, setAll] = useState(false)
  if (!rows.length) return <Empty />
  const max = Math.max(...rows.map((r) => r[1])), sum = total ?? rows.reduce((a, r) => a + r[1], 0), show = all ? rows : rows.slice(0, limit)
  return <div className="adm-bars">{show.map(([k, n]) => { const row = <><span className="adm-bar-t">{k}</span><span className="adm-bar-v">{fmt(n)}</span><span className="adm-bar-track"><i style={{ width: `${(n / max) * 100}%` }} /></span></>, tip = `${k}: ${fmt(n)} ${unit}, ${sum ? Math.round((n / sum) * 100) : 0}%`
    return onPick ? <button key={k} type="button" className="adm-bar" data-tip={tip} onClick={() => onPick(k)}>{row}</button> : <div key={k} className="adm-bar" data-tip={tip}>{row}</div> })}
    {rows.length > limit && <button type="button" className="adm-more" onClick={() => setAll(!all)}>{all ? 'Show fewer' : `Show all ${rows.length}`}</button>}</div>
}

export function Line({ data, format = fmt, height = 220 }: { data: { x: string; y: number }[]; format?: (n: number) => string; height?: number }) {
  const [w, setW] = useState(700), [h0, setH] = useState<number | null>(null), ref = useRef<HTMLDivElement>(null)
  useEffect(() => { const o = new ResizeObserver(([e]) => setW(e.contentRect.width)); if (ref.current) o.observe(ref.current); return () => o.disconnect() }, [])
  if (!data.length) return <Empty />
  const L = 44, B = 26, T = 12, max = Math.max(1, ...data.map((d) => d.y)), H = height - B - T, W = Math.max(1, w - L - 8)
  const X = (i: number) => L + (data.length < 2 ? W / 2 : (i / (data.length - 1)) * W), Y = (v: number) => T + H - (v / max) * H
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${X(i)},${Y(d.y)}`).join(''), area = `${line}L${X(data.length - 1)},${T + H}L${X(0)},${T + H}Z`, step = Math.ceil(data.length / Math.max(2, Math.floor(w / 90)))
  const a = h0 == null ? null : data[h0]
  return <div className="adm-chart" ref={ref} onPointerLeave={() => setH(null)} onPointerMove={(e) => { const x = e.clientX - e.currentTarget.getBoundingClientRect().left; setH(Math.max(0, Math.min(data.length - 1, Math.round(((x - L) / W) * (data.length - 1))))) }}>
    <svg width={w} height={height} role="img" aria-label={`Line chart with ${data.length} points, peak ${format(max)}`}>
      {[0, .5, 1].map((t) => <g key={t}><line x1={L} x2={w - 8} y1={Y(max * t)} y2={Y(max * t)} className="adm-grid" /><text x={L - 8} y={Y(max * t) + 4} textAnchor="end" className="adm-axis">{format(max * t)}</text></g>)}
      <path d={area} className="adm-area" /><path d={line} className="adm-line" />
      {data.map((d, i) => i % step === 0 && <text key={i} x={X(i)} y={height - 7} textAnchor="middle" className="adm-axis">{d.x}</text>)}
      {a && <g><line x1={X(h0!)} x2={X(h0!)} y1={T} y2={T + H} className="adm-cross" /><circle cx={X(h0!)} cy={Y(a.y)} r={5} className="adm-dot" /></g>}
    </svg>
    {a && <div className="adm-float" style={{ left: Math.min(w - 130, X(h0!) + 10), top: 4 }}><b>{format(a.y)}</b> {a.x}</div>}
  </div>
}
export function Funnel({ steps }: { steps: { label: string; n: number }[] }) {
  const top = steps[0]?.n || 1
  return <ol className="adm-fun">{steps.map((s, i) => { const prev = i ? steps[i - 1].n : s.n, drop = prev ? Math.round(((prev - s.n) / prev) * 100) : 0
    return <li key={s.label} data-tip={`${s.label}: ${fmt(s.n)} sessions, ${Math.round((s.n / top) * 100)}% of landed`}><span className="adm-fun-l">{s.label}</span><span className="adm-fun-track"><i style={{ width: `${Math.max(1, (s.n / top) * 100)}%` }} /></span><span className="adm-fun-n">{fmt(s.n)}</span><span className="adm-fun-p">{i ? `−${drop}%` : ''}</span></li> })}</ol>
}
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export function HourGrid({ cells }: { cells: number[][] }) {
  const max = Math.max(1, ...cells.flat())
  return <div className="adm-heat">{cells.map((r, d) => <div key={d} className="adm-heat-r"><span>{DOW[d]}</span>{r.map((n, h) => <i key={h} data-tip={`${DOW[d]} ${String(h).padStart(2, '0')}:00, ${n} sessions`} style={{ background: n ? rampAt(n / max) : undefined }} />)}</div>)}<div className="adm-heat-x"><span />{[0, 6, 12, 18].map((h) => <em key={h}>{String(h).padStart(2, '0')}</em>)}</div></div>
}
export type Col<T> = { key: string; label: string; get: (r: T) => string | number; show?: (r: T) => ReactNode; right?: boolean }
export function Table<T>({ cols, rows, onRow, limit = 12, sort: s0 }: { cols: Col<T>[]; rows: T[]; onRow?: (r: T) => void; limit?: number; sort?: string }) {
  const [sort, setSort] = useState(s0 || ''), [dir, setDir] = useState(-1), [page, setPage] = useState(0)
  const sorted = useMemo(() => { const c = cols.find((x) => x.key === sort); return c ? [...rows].sort((a, b) => { const x = c.get(a), y = c.get(b); return (x < y ? -1 : x > y ? 1 : 0) * dir }) : rows }, [rows, sort, dir, cols])
  if (!rows.length) return <Empty />
  const pages = Math.ceil(sorted.length / limit), p = Math.min(page, pages - 1)
  return <div className="adm-table-w"><table className="adm-table"><thead><tr>{cols.map((c) => <th key={c.key} data-right={c.right} aria-sort={sort === c.key ? (dir < 0 ? 'descending' : 'ascending') : undefined}><button type="button" onClick={() => { if (sort === c.key) setDir(-dir); else { setSort(c.key); setDir(-1) } }}>{c.label}{sort === c.key ? (dir < 0 ? ' ↓' : ' ↑') : ''}</button></th>)}</tr></thead>
    <tbody>{sorted.slice(p * limit, (p + 1) * limit).map((r, i) => <tr key={i} data-click={!!onRow || undefined} onClick={onRow && (() => onRow(r))}>{cols.map((c) => <td key={c.key} data-right={c.right}>{c.show ? c.show(r) : c.get(r)}</td>)}</tr>)}</tbody></table>
    {pages > 1 && <div className="adm-pg"><button type="button" disabled={!p} onClick={() => setPage(p - 1)}>Previous</button><span>{p + 1} of {pages}</span><button type="button" disabled={p >= pages - 1} onClick={() => setPage(p + 1)}>Next</button></div>}</div>
}
export const Meter = ({ v }: { v: number }) => <span className="adm-meter"><i style={{ width: `${Math.min(100, v)}%` }} /><b>{v}%</b></span>
