import express from 'express';
import {
  destroy,
  index,
  show,
  store,
  update,
} from '../controllers/booking.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', requireAuth, index);
router.get('/:id', requireAuth, show);
router.post('/', requireAuth, store);
router.patch('/:id', requireAuth, update);
router.delete('/:id', requireAuth, destroy);

export default router;
