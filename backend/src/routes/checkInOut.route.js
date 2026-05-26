import express from 'express';
import {
  destroy,
  index,
  show,
  store,
  update,
} from '../controllers/checkInOut.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/api/check-in-out', requireAuth, requireRoles('admin', 'staff'), index);
router.get('/api/check-in-out/:id', requireAuth, requireRoles('admin', 'staff'), show);
router.post('/api/check-in-out', requireAuth, requireRoles('admin', 'staff'), store);
router.patch('/api/check-in-out/:id', requireAuth, requireRoles('admin', 'staff'), update);
router.delete('/api/check-in-out/:id', requireAuth, requireRoles('admin', 'staff'), destroy);

export default router;
