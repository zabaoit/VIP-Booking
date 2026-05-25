import express from 'express';
import {
  destroy,
  index,
  show,
  store,
  update,
} from '../controllers/role.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
const adminOnly = [requireAuth, requireRoles('admin')];

router.get('/', adminOnly, index);
router.get('/:id', adminOnly, show);
router.post('/', adminOnly, store);
router.patch('/:id', adminOnly, update);
router.delete('/:id', adminOnly, destroy);

export default router;
