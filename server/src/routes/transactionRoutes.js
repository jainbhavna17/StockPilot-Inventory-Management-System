import { Router } from 'express';
import { getTransactions } from '../controllers/transactionController.js';
import { protect, requirePerm } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, requirePerm('READ'), getTransactions);

export default router;
