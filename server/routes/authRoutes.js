import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin creates new user
router.post('/register', protect, adminOnly, async (req, res) => {
  const { name, email, password, role, position, team, office, country } = req.body; // Extract user details from request body

  const existingUser = await User.findOne({ email }); // Check if user already exists by email
  if (existingUser) return res.status(400).json({ message: 'User already exists' }); // Return error if user already exists

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt with a salt rounds of 10

  // Create a new user with the provided details
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

// User login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body
  console.log('Login request body:', req.body); // ✅ confirm input

  try {
    const user = await User.findOne({ email }); // Find user by email

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare provided password with hashed password in database
    console.log('Password match:', isMatch); // ✅ confirm bcrypt result

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id); // Generate JWT token for the user
    res.json({ token, user }); // Send token and user details in response
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
