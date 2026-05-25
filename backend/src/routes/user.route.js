import express from 'express';
import {
  destroy,
  index,
  show,
  store,
  update,
} from '../controllers/user.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
const canManageUsers = [requireAuth, requireRoles('admin', 'staff')];

router.get('/', canManageUsers, index);
router.get('/:id', requireAuth, show);
router.post('/', canManageUsers, store);
router.patch('/:id', requireAuth, update);
router.delete('/:id', canManageUsers, destroy);

export default router;
