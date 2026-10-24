import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verifies the Bearer JWT and attaches the user to req.user
export const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized: missing token' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userId: decoded.sub });
    if (!user) return res.status(401).json({ message: 'Not authorized: user no longer exists' });
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized: invalid or expired token' });
  }
};

// Role-based permission guard (CREATE / READ / UPDATE / DELETE / AUDIT_WRITE)
export const requirePerm = (perm, message) => (req, res, next) => {
  if (!req.user || !req.user.perms.includes(perm)) {
    return res.status(403).json({
      message: message || 'Access Restriction: Your assigned role lacks permission for this action.',
    });
  }
  return next();
};
