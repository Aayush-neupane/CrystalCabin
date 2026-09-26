import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

// serverless-http doesn't always populate req.ip — fall back to the first
// X-Forwarded-For entry, then a constant, so the limiter never crashes.
function keyGenerator(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const firstForwarded = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded?.split(',')[0]?.trim();
  return req.ip || firstForwarded || 'unknown';
}

// Public booking form: generous enough for real customers sharing an IP
// (shop wifi, family), tight enough to stop spam floods.
export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator,
  message: { error: 'Too many booking attempts. Please try again later.' },
});

// Admin login: strict — brute force gets 5 guesses per quarter hour.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator,
  message: { error: 'Too many login attempts. Please try again later.' },
});
