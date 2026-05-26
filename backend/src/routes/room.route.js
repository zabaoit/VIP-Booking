import express from 'express';
import {
  destroy,
  index,
  show,
  store,
  update,
} from '../controllers/room.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/api/rooms', index);
router.get('/api/rooms/:id', show);
router.post('/api/rooms', requireAuth, requireRoles('admin', 'staff'), store);
router.patch('/api/rooms/:id', requireAuth, requireRoles('admin', 'staff'), update);
router.delete('/api/rooms/:id', requireAuth, requireRoles('admin', 'staff'), destroy);

export default router;
