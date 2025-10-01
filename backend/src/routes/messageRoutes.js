import express from 'express';
import {
    sendMessage,
    getMessagesForConversation,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/:requestId/:otherUserId', getMessagesForConversation);

export { router as messageRoutes };
