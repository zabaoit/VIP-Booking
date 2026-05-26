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

router.get('/api/invoices', requireAuth, requireRoles('admin', 'staff'), index);
router.get('/api/invoices/:id', requireAuth, requireRoles('admin', 'staff'), show);
router.post('/api/invoices', requireAuth, requireRoles('admin', 'staff'), store);
router.patch('/api/invoices/:id', requireAuth, requireRoles('admin', 'staff'), update);
router.delete('/api/invoices/:id', requireAuth, requireRoles('admin', 'staff'), destroy);

export default router;
