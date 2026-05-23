import express from 'express';
import { createRoom, getAllRooms, deleteRoom } from '../controllers/roomController.js';
import { authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔒 API THÊM PHÒNG NEW: Chỉ duy nhất 'admin' mới được vào
router.post('/create', authorize(['admin']), createRoom);

// 🔒 API XÓA PHÒNG: Chỉ 'admin' mới được xóa
router.delete('/delete/:id', authorize(['admin']), deleteRoom);

// 🔓 API XEM DANH SÁCH PHÒNG: 'admin', 'staff', hay 'user' (khách bình thường) đều xem được
router.get('/list', authorize(['admin','user']), getAllRooms);

export default router;