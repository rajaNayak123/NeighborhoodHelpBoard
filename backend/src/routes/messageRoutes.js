import express from 'express';
import { getMessagesForConversation } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// We only need the GET route to fetch message history
router.get('/:requestId/:otherUserId', getMessagesForConversation);

export { router as messageRoutes };
