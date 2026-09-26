import { Router } from 'express';
import { createAppointment } from '../controllers/appointmentController';
import { bookingLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/appointments', bookingLimiter, createAppointment);

export default router;