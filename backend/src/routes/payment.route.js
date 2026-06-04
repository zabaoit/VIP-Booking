import express from 'express';
import {
  destroy,
  confirmLocal,
  createVietQr,
  index,
  show,
  store,
  update,
  verifyVietQr,
} from '../controllers/payment.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/api/payments', requireAuth, requireRoles('admin'), index);
router.get('/api/payments/:id', requireAuth, requireRoles('admin'), show);
router.post('/api/payments', requireAuth, requireRoles('admin'), store);
router.post('/api/payments/vietqr/create', requireAuth, createVietQr);
router.post('/api/payments/:id/confirm-local', requireAuth, requireRoles('admin'), confirmLocal);
router.post('/api/payments/:id/verify-vietqr', requireAuth, verifyVietQr);
router.patch('/api/payments/:id', requireAuth, requireRoles('admin'), update);
router.delete('/api/payments/:id', requireAuth, requireRoles('admin'), destroy);

export default router;
