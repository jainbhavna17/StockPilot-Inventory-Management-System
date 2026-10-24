import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logAudit } from '../utils/auditLogger.js';

const signToken = (user) =>
  jwt.sign({ sub: user.userId, name: user.name, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    await logAudit(req, 'AUTHENTICATION_FAILED', `Failed login attempt for ${email}`, 'anonymous');
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  await logAudit(
    req,
    'AUTHENTICATION_SUCCESS',
    `User ${user.name} logged in as ${user.role}`,
    user.userId
  );

  return res.json({ token: signToken(user), user });
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  await logAudit(req, 'SESSION_TERMINATED', `Session ended for ${req.user.name}`);
  res.json({ message: 'Session terminated' });
};
