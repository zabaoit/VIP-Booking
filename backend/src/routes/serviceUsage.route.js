import express from 'express';
import {
  destroy,
  index,
  show,
  store,
  update,
} from '../controllers/serviceUsage.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
const canManageOperations = [requireAuth, requireRoles('admin', 'staff')];

router.get('/', canManageOperations, index);
router.get('/:id', canManageOperations, show);
router.post('/', canManageOperations, store);
router.patch('/:id', canManageOperations, update);
router.delete('/:id', canManageOperations, destroy);

export default router;
