import express from 'express';
import {
    sendMessage,
    getMessagesForConversation,
} from '../controllers/messageController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/:requestId/:otherUserId', getMessagesForConversation);

export { router as messageRoutes };