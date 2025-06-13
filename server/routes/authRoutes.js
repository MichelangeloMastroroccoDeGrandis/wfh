import express from 'express';
import { loginUser } from '../controllers/authController.js'; // ✅ correct import
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// ✅ login route now calls the real controller
router.post('/login', loginUser);

// Admin creates user
router.post('/register', protect, adminOnly, async (req, res) => {
  const { name, email, password, role, position, team, office, country } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    position,
    team,
    office,
    country,
  });

  res.status(201).json({ message: 'User created successfully', user });
});

// Token refresh route
router.post('/refresh', (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.json({ token: accessToken });
  });
});

export default router;
