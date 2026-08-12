import { Router } from 'express';
import { createAppointment } from '../controllers/appointmentController';

const router = Router();

router.post('/appointments', createAppointment);

export default router;