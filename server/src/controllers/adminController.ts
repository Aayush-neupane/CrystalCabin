import { Request, Response } from 'express';
import { z } from 'zod';
import {
  isAdminAuthConfigured,
  issueToken,
  verifyPassword,
} from '../services/adminAuthService';
import {
  isDatabaseConfigured,
  listAppointments,
  updateAppointmentStatus,
  AppointmentStatus,
} from '../services/supabaseService';

const loginSchema = z.object({
  password: z.string().min(1),
});

const statusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
});

const attempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAttempt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttempt: now });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export function adminLogin(req: Request, res: Response): void {
  if (!isAdminAuthConfigured()) {
    res.status(503).json({
      success: false,
      message: 'Admin access is not configured. Set ADMIN_PASSWORD and ADMIN_TOKEN_SECRET on the server.',
    });
    return;
  }

  const clientKey = req.ip || 'unknown';
  if (isRateLimited(clientKey)) {
    res.status(429).json({ success: false, message: 'Too many attempts. Try again later.' });
    return;
  }

  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Password is required' });
    return;
  }

  if (!verifyPassword(parsed.data.password)) {
    res.status(401).json({ success: false, message: 'Invalid password' });
    return;
  }

  attempts.delete(clientKey);
  res.json({
    success: true,
    message: 'Logged in',
    token: issueToken(),
    expiresInHours: 12,
  });
}

export async function getAppointments(_req: Request, res: Response): Promise<void> {
  if (!isDatabaseConfigured()) {
    res.status(503).json({ success: false, message: 'Database is not configured' });
    return;
  }

  try {
    const appointments = await listAppointments();
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('List appointments error:', error);
    res.status(500).json({ success: false, message: 'Failed to load appointments' });
  }
}

export async function patchAppointmentStatus(req: Request, res: Response): Promise<void> {
  if (!isDatabaseConfigured()) {
    res.status(503).json({ success: false, message: 'Database is not configured' });
    return;
  }

  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: 'Invalid status value' });
    return;
  }

  try {
    const appointment = await updateAppointmentStatus(
      req.params.id,
      parsed.data.status as AppointmentStatus
    );
    if (!appointment) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }
    res.json({ success: true, appointment });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ success: false, message: 'Failed to update appointment' });
  }
}
