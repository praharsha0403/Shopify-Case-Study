import { useEffect, useMemo, useRef, useState } from 'react'
import { geoNaturalEarth1, geoPath, type GeoPermissibleObjects } from 'd3-geo'
import { feature } from 'topojson-client'
import { countryName } from './metrics'
import { fmt, rampAt } from './ui'

type F = { properties: { name: string } } & GeoPermissibleObjects
const ALIAS: Record<string, string> = { US: 'United States of America', CZ: 'Czechia', BA: 'Bosnia and Herz.', DO: 'Dominican Rep.', KR: 'South Korea', KP: 'North Korea', CD: 'Dem. Rep. Congo', CG: 'Congo', SS: 'S. Sudan', CF: 'Central African Rep.', AE: 'United Arab Emirates', MM: 'Myanmar', CI: "Côte d'Ivoire" }
export function WorldMap({ countries, cities, focus, onPick }: { countries: [string, number][]; cities: { city: string; lat: number; lon: number; n: number }[]; focus: string; onPick: (c: string) => void }) {
  const [geo, setGeo] = useState<F[] | null>(null), [w, setW] = useState(720), ref = useRef<HTMLDivElement>(null)
  useEffect(() => { import('world-atlas/countries-110m.json').then((m) => { const t = m.default as unknown as Parameters<typeof feature>[0] & { objects: { countries: Parameters<typeof feature>[1] } }; setGeo((feature(t, t.objects.countries) as unknown as { features: F[] }).features.filter((f) => f.properties.name !== 'Antarctica')) }) }, [])
  useEffect(() => { const o = new ResizeObserver(([e]) => setW(e.contentRect.width)); if (ref.current) o.observe(ref.current); return () => o.disconnect() }, [])
  const h = Math.max(240, Math.round(w * 0.5))
  const byName = useMemo(() => { const m = new Map<string, [string, number]>(); for (const [c, n] of countries) m.set(ALIAS[c] || countryName(c), [c, n]); return m }, [countries])
  const max = Math.max(1, ...countries.map((c) => c[1]))
  const { path, project } = useMemo(() => {
    const p = geoNaturalEarth1(), target = focus && geo?.find((f) => f.properties.name === (ALIAS[focus] || countryName(focus)))
    p.fitExtent([[8, 8], [w - 8, h - 8]], (target || { type: 'FeatureCollection', features: geo || [] }) as GeoPermissibleObjects)
    return { path: geoPath(p), project: p }
  }, [geo, focus, w, h])
  const cmax = Math.max(1, ...cities.map((c) => c.n))
  return <div ref={ref} className="adm-map">{geo ? <svg width={w} height={h} role="img" aria-label="Map of sessions by country and city">
    {geo.map((f) => { const hit = byName.get(f.properties.name), d = path(f); return d ? <path key={f.properties.name} d={d} className="adm-land" style={hit ? { fill: rampAt(hit[1] / max) } : undefined} data-hit={!!hit || undefined} data-tip={`${f.properties.name}: ${hit ? fmt(hit[1]) : 0} sessions`} onClick={hit ? () => onPick(hit[0]) : undefined} /> : null })}
    {cities.map((c) => { const xy = project([c.lon, c.lat]); return xy ? <circle key={c.city + c.lat} cx={xy[0]} cy={xy[1]} r={3 + Math.sqrt(c.n / cmax) * 11} className="adm-city" data-tip={`${c.city}: ${fmt(c.n)} sessions`} /> : null })}
  </svg> : <div style={{ height: h }} />}</div>
}
