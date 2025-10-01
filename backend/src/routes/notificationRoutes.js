import express from 'express';
import {
    getNotifications,
    markAsRead,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/read', markAsRead); // Mark all as read
router.put('/:id/read', markAsRead); // Mark one as read

export { router as notificationRoutes };