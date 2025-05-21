import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/dashboard
router.get('/', protect, (req, res) => {
    if (!req.user) {
    return res.status(401).json({ message: 'No user data found' });
  }
  
  res.json({
    message: `Welcome ${req.user.name}!`,
    role: req.user.role,
    email: req.user.email,
  });
});

export default router;
