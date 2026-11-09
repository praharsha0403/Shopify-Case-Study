import { put, list } from '@vercel/blob';
import { clientHash, isAuthed, makeSession, passwordOk, ready, sessionCookie } from './_lib.js';

// Login for /track. Failed attempts are counted per hashed client: 8 in 10 minutes locks that client out.
const WINDOW = 10 * 60 * 1000, MAX_FAILS = 8;
const tooMany = async (h) => (await list({ prefix: `fails/${h}~`, limit: 100 })).blobs.filter((b) => Date.now() - parseInt(b.pathname.split('~')[1], 36) < WINDOW).length >= MAX_FAILS;
const fail = (h) => put(`fails/${h}~${Date.now().toString(36)}~${Math.random().toString(36).slice(2, 6)}.json`, '{}', { access: 'private', contentType: 'application/json', addRandomSuffix: false }).catch(() => {});

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') return res.status(200).json({ authed: isAuthed(req), setup: ready() });
  if (req.method !== 'POST') return res.status(405).end();
  let b = {};
  try { b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}); } catch { /* empty */ }
  if (b.action === 'logout') { res.setHeader('Set-Cookie', sessionCookie('', 0)); return res.status(200).json({ ok: true }); }
  if (b.action !== 'login') return res.status(400).json({ error: 'Unknown action' });
  if (!ready().password) return res.status(503).json({ error: 'The dashboard password is not configured yet.' });
  const h = clientHash(req);
  if (await tooMany(h).catch(() => false)) return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });
  if (typeof b.password === 'string' && b.password.length <= 200 && passwordOk(b.password)) {
    res.setHeader('Set-Cookie', sessionCookie(makeSession(), 12 * 3600));
    return res.status(200).json({ ok: true });
  }
  await fail(h);
  await new Promise((r) => setTimeout(r, 700));
  return res.status(401).json({ error: 'That password is not right.' });
}
