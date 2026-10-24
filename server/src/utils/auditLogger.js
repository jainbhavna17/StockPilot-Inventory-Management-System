import AuditLog from '../models/AuditLog.js';
import { nowStamp, uniqueId } from './helpers.js';

export const logAudit = async (req, action, details, userIdOverride) => {
  try {
    const id = await uniqueId(AuditLog, 'AUD', 1000, 9000);
    await AuditLog.create({
      id,
      action,
      userId: userIdOverride || req.user?.userId || 'anonymous',
      ip: req.ip || '127.0.0.1',
      timestamp: nowStamp(),
      details,
    });
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
};
