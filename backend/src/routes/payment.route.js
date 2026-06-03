import express from 'express';
import {
  destroy,
  index,
  show,
  store,
  update,
} from '../controllers/payment.controller.js';
import { createGateway } from '../controllers/payment.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/api/payments/gateway',
  requireAuth,
  requireRoles('admin', 'customer'),
  createGateway
);
router.get('/api/payments', requireAuth, requireRoles('admin'), index);
router.get('/api/payments/:id', requireAuth, requireRoles('admin'), show);
router.post('/api/payments', requireAuth, requireRoles('admin', 'customer'), store);
router.patch('/api/payments/:id', requireAuth, requireRoles('admin'), update);
router.delete('/api/payments/:id', requireAuth, requireRoles('admin'), destroy);

export default router;
