import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register',
  body('email').isEmail().withMessage('Provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'User already registered' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashed });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
      res.status(201).json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// POST /api/auth/login
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
      res.json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

export default router;
