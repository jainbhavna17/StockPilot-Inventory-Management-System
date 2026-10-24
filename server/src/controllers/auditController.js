import AuditLog from '../models/AuditLog.js';
import { logAudit } from '../utils/auditLogger.js';

const CLIENT_ACTIONS = ['CSV_EXPORT'];

// GET /api/audit
export const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 });
  res.json(logs);
};

// POST /api/audit  (client-side events such as CSV exports)
export const createAuditLog = async (req, res) => {
  const { action, details } = req.body;
  if (!CLIENT_ACTIONS.includes(action)) {
    return res.status(400).json({ message: 'Unsupported audit action' });
  }
  await logAudit(req, action, details || '');
  return res.status(201).json({ message: 'Logged' });
};
