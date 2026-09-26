import rateLimit from 'express-rate-limit';

// Public booking form: generous enough for real customers sharing an IP
// (shop wifi, family), tight enough to stop spam floods.
export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many booking attempts. Please try again later.' },
});

// Admin login: strict — brute force gets 5 guesses per quarter hour.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});
