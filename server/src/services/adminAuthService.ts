import crypto from 'crypto';

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

function getSecret(): string | null {
  return process.env.ADMIN_TOKEN_SECRET || null;
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && getSecret());
}

function safeEqual(a: string, b: string): boolean {
  const bufA = crypto.createHash('sha256').update(a).digest();
  const bufB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(password, expected);
}

function sign(data: string): string {
  return crypto
    .createHmac('sha256', getSecret() as string)
    .update(data)
    .digest('base64url');
}

export function issueToken(): string {
  const payload: TokenPayload = {
    sub: 'admin',
    iat: Date.now(),
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function verifyToken(token: string): boolean {
  const secret = getSecret();
  if (!secret) return false;

  const dotIndex = token.lastIndexOf('.');
  if (dotIndex <= 0) return false;

  const body = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  const expectedSignature = sign(body);
  const sigA = Buffer.from(signature);
  const sigB = Buffer.from(expectedSignature);
  if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as TokenPayload;
    return typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}
