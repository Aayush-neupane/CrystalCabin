import { Router } from 'express';
import { adminLogin, getAppointments, patchAppointmentStatus } from '../controllers/adminController';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

router.post('/admin/login', adminLogin);
router.get('/appointments', requireAdmin, getAppointments);
router.patch('/appointments/:id/status', requireAdmin, patchAppointmentStatus);

export default router;
