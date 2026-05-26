import express from 'express';
import {
  destroy,
  index,
  show,
  store,
  update,
} from '../controllers/service.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/api/services', index);
router.get('/api/services/:id', show);
router.post('/api/services', requireAuth, requireRoles('admin', 'staff'), store);
router.patch('/api/services/:id', requireAuth, requireRoles('admin', 'staff'), update);
router.delete('/api/services/:id', requireAuth, requireRoles('admin', 'staff'), destroy);

export default router;
