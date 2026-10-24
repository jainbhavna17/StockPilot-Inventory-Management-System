import { Router } from 'express';
import { getAuditLogs, createAuditLog } from '../controllers/auditController.js';
import { protect, requirePerm } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', requirePerm('READ'), getAuditLogs);
router.post('/', requirePerm('READ'), createAuditLog);

export default router;
