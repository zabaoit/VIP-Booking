import express from 'express';
import {
  destroy,
  index,
  show,
  store,
  update,
} from '../controllers/roomType.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();
const canManageHotelData = [requireAuth, requireRoles('admin', 'staff')];

router.get('/', index);
router.get('/:id', show);
router.post('/', canManageHotelData, store);
router.patch('/:id', canManageHotelData, update);
router.delete('/:id', canManageHotelData, destroy);

export default router;
