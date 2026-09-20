import express from 'express';
import cors from 'cors';
import appointmentRoutes from './routes/appointmentRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-machine dev frontends on any port (5173, 5180, etc.)
    // plus the configured FRONTEND_URL. Non-browser tools (no origin) allowed.
    if (!origin) return callback(null, true);
    const configured = process.env.FRONTEND_URL;
    try {
      const url = new URL(origin);
      const isLocalhost =
        url.hostname === 'localhost' || url.hostname === '127.0.0.1';
      if (isLocalhost || (configured && origin === configured)) {
        return callback(null, true);
      }
    } catch {
      // fall through to deny
    }
    return callback(null, false);
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api', appointmentRoutes);
app.use('/api', adminRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;