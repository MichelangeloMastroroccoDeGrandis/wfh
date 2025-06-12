import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().select('-password'); // Fetch all users excluding passwords
  res.json(users);
});

// Delete a user
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id); // Find user by ID
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.remove(); // Remove user from database
  res.json({ message: 'User deleted' });
});

// Update user password
router.put('/users/:id/password', protect, adminOnly, async (req, res) => {
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
