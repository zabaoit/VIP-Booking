import express from 'express';
import {
  destroy,
  index,
  show,
  store,
  update,
} from '../controllers/invoice.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
const canManageFinance = [requireAuth, requireRoles('admin', 'staff')];

router.get('/', canManageFinance, index);
router.get('/:id', canManageFinance, show);
router.post('/', canManageFinance, store);
router.patch('/:id', canManageFinance, update);
router.delete('/:id', canManageFinance, destroy);

export default router;
