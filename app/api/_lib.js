import crypto from 'node:crypto';

// Shared helpers. STATS_KEY signs sessions; STATS_PASSWORD unlocks /track. Both live only in Vercel env vars.
const secret = () => process.env.STATS_KEY || '';
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();
const sign = (s) => crypto.createHmac('sha256', secret()).update(s).digest('base64url');
const eq = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
const COOKIE = 'pn_admin';

export const ready = () => ({ blob: !!process.env.BLOB_READ_WRITE_TOKEN, password: !!process.env.STATS_PASSWORD && !!process.env.STATS_KEY });
export const passwordOk = (given) => !!process.env.STATS_PASSWORD && crypto.timingSafeEqual(sha(given || ''), sha(process.env.STATS_PASSWORD));
export const makeSession = (hours = 12) => { const exp = Date.now() + hours * 36e5; return `${exp}.${sign('s' + exp)}`; };
export const sessionCookie = (val, maxAge) => `${COOKIE}=${val}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
export function isAuthed(req) {
  if (!secret()) return false;
  const m = (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  return !!exp && !!sig && +exp > Date.now() && eq(sig, sign('s' + exp));
}
// keyed hash, only for counting failed logins and throttling. The address itself is never stored.
export const clientHash = (req) => crypto.createHmac('sha256', secret() || 'x').update(String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()).digest('hex').slice(0, 16);

// Touch ID (WebAuthn): stateless challenges, random + time + signature, valid for 2 minutes.
export const sha256 = (b) => crypto.createHash('sha256').update(b).digest();
export function makeChallenge() {
  const body = `${crypto.randomBytes(16).toString('base64url')}.${Date.now().toString(36)}`;
  return `${body}.${sign('c' + body)}`;
}
export function checkChallenge(ch) {
  const p = String(ch).split('.');
  if (p.length !== 3 || !secret()) return false;
  const body = `${p[0]}.${p[1]}`;
  if (!eq(sign('c' + body), p[2])) return false;
  const age = Date.now() - parseInt(p[1], 36);
  return age >= 0 && age < 120000;
}
