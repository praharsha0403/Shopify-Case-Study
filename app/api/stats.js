import { get, list } from '@vercel/blob';
import { isAuthed } from './_lib.js';

// Private data feed for /track. The browser asks only for files changed since its last load, which keeps storage
// operations low, and pages through results so no response nears Vercel's 4.5 MB function limit.
const cache = new Map();
const MAX_BYTES = 3.2e6;
async function listAll(prefix) {
  const out = []; let cursor;
  do { const r = await list({ prefix, cursor, limit: 1000 }); out.push(...r.blobs); cursor = r.hasMore ? r.cursor : undefined; } while (cursor && out.length < 50000);
  return out;
}
async function read(b) {
  const stamp = +new Date(b.uploadedAt), hit = cache.get(b.pathname);
  if (hit && hit.stamp === stamp) return hit.rec;
  try {
    const r = await get(b.pathname, { access: 'private', useCache: false });
    if (!r?.stream) return null;
    const rec = JSON.parse(await new Response(r.stream).text());
    if (cache.size > 6000) cache.clear();
    cache.set(b.pathname, { stamp, rec });
    return rec;
  } catch { return null; }
}
async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!isAuthed(req)) return res.status(401).json({ error: 'locked' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(200).json({ now: Date.now(), records: [], next: null, noStore: true });
  const since = Number(req.query?.since) || 0, offset = Math.max(0, parseInt(req.query?.offset, 10) || 0);
  const all = (await listAll('s/')).filter((b) => +new Date(b.uploadedAt) > since - 15000).sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
  const page = all.slice(offset, offset + 150);
  const got = (await pool(page, 24, read)).filter(Boolean);
  const records = []; let bytes = 0, used = 0;
  for (const r of got) { const n = JSON.stringify(r).length; if (bytes + n > MAX_BYTES && records.length) break; records.push(r); bytes += n; used++; }
  const consumed = used === got.length ? page.length : used;
  res.status(200).json({ now: Date.now(), records, total: all.length, next: offset + consumed < all.length ? offset + consumed : null });
}
