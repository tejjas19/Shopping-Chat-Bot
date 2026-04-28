import { Router } from 'express';
import { getHistory, sendMessage } from '../controllers/chatController.js';

const router = Router();

router.get('/history/:sessionId', getHistory);
router.post('/message', sendMessage);

export default router;
