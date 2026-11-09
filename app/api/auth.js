import crypto from 'node:crypto';
import { put, list } from '@vercel/blob';
import { checkChallenge, clientHash, isAuthed, makeChallenge, makeSession, passwordOk, ready, sessionCookie, sha256 } from './_lib.js';

// Login for /track. Failed attempts are counted per hashed client: 8 in 10 minutes locks that client out.
const WINDOW = 10 * 60 * 1000, MAX_FAILS = 8;
const tooMany = async (h) => (await list({ prefix: `fails/${h}~`, limit: 100 })).blobs.filter((b) => Date.now() - parseInt(b.pathname.split('~')[1], 36) < WINDOW).length >= MAX_FAILS;
const fail = (h) => put(`fails/${h}~${Date.now().toString(36)}~${Math.random().toString(36).slice(2, 6)}.json`, '{}', { access: 'private', contentType: 'application/json', addRandomSuffix: false }).catch(() => {});

async function creds() {
  const r = await list({ prefix: 'auth/', limit: 100 });
  return r.blobs.map((b) => { const [id, spki] = b.pathname.slice(5).replace(/\.json$/, '').split('~'); return { id, spki }; });
}
const signIn = (res) => { res.setHeader('Set-Cookie', sessionCookie(makeSession(), 12 * 3600)); return res.status(200).json({ ok: true }); };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') return res.status(200).json({ authed: isAuthed(req), setup: ready(), passkeys: (await creds().catch(() => [])).length });
  if (req.method !== 'POST') return res.status(405).end();
  let b = {};
  try { b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}); } catch { /* empty */ }
  if (b.action === 'logout') { res.setHeader('Set-Cookie', sessionCookie('', 0)); return res.status(200).json({ ok: true }); }
  const host = String(req.headers.host || ''), rpId = host.split(':')[0], origin = `https://${host}`;
  if (b.action === 'auth-options') return res.status(200).json({ challenge: makeChallenge(), rpId, ids: (await creds().catch(() => [])).map((c) => c.id) });
  if (b.action === 'auth-verify') {
    const h = clientHash(req);
    try {
      if (await tooMany(h)) return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });
      const authData = Buffer.from(b.authenticatorData, 'base64url'), cdj = Buffer.from(b.clientDataJSON, 'base64url'), sig = Buffer.from(b.signature, 'base64url');
      const cd = JSON.parse(cdj.toString());
      const cred = (await creds()).find((c) => c.id === b.id);
      const good = cred && cd.type === 'webauthn.get' && cd.origin === origin && checkChallenge(Buffer.from(cd.challenge, 'base64url').toString()) && authData.subarray(0, 32).equals(sha256(rpId)) && (authData[32] & 1) && (authData[32] & 4);
      if (good) {
        const key = crypto.createPublicKey({ key: Buffer.from(cred.spki, 'base64url'), format: 'der', type: 'spki' });
        const data = Buffer.concat([authData, sha256(cdj)]);
        const valid = key.asymmetricKeyType === 'ec' ? crypto.verify('sha256', data, { key, dsaEncoding: 'der' }, sig) : crypto.verify('sha256', data, key, sig);
        if (valid) return signIn(res);
      }
    } catch { /* falls through to a failed attempt */ }
    await fail(h);
    await new Promise((r) => setTimeout(r, 700));
    return res.status(401).json({ error: 'Touch ID did not match.' });
  }
  if (b.action === 'reg-options' || b.action === 'reg-verify') {
    if (!isAuthed(req)) return res.status(401).json({ error: 'Unlock with the password first.' });
    if (b.action === 'reg-options') return res.status(200).json({ challenge: makeChallenge(), rpId });
    try {
      const cd = JSON.parse(Buffer.from(b.clientDataJSON, 'base64url').toString());
      if (cd.type !== 'webauthn.create' || cd.origin !== origin || !checkChallenge(Buffer.from(cd.challenge, 'base64url').toString())) throw new Error('bad');
      if (!/^[A-Za-z0-9_-]{16,128}$/.test(b.id) || !/^[A-Za-z0-9_-]{60,700}$/.test(b.publicKey)) throw new Error('bad');
      crypto.createPublicKey({ key: Buffer.from(b.publicKey, 'base64url'), format: 'der', type: 'spki' });
      if ((await creds()).length >= 5) return res.status(400).json({ error: 'Touch ID limit reached.' });
      await put(`auth/${b.id}~${b.publicKey}.json`, '{}', { access: 'private', contentType: 'application/json', addRandomSuffix: false });
      return res.status(200).json({ ok: true });
    } catch { return res.status(400).json({ error: 'Could not turn on Touch ID.' }); }
  }
  if (b.action !== 'login') return res.status(400).json({ error: 'Unknown action' });
  if (!ready().password) return res.status(503).json({ error: 'The dashboard password is not configured yet.' });
  const h = clientHash(req);
  if (await tooMany(h).catch(() => false)) return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });
  if (typeof b.password === 'string' && b.password.length <= 200 && passwordOk(b.password)) {
    return signIn(res);
  }
  await fail(h);
  await new Promise((r) => setTimeout(r, 700));
  return res.status(401).json({ error: 'That password is not right.' });
}
