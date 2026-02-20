const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ─── HELPER: sign a JWT for a user ────────────────────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── POST /api/auth/signup ────────────────────────────────────────────────
// Create a new account
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic presence check (mongoose validators handle the rest)
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are all required.' });
    }

    // Check for duplicate email before attempting to save
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Create user — password is hashed automatically via the pre-save hook in User.js
    const user = await User.create({ name, email, password });

    const token = signToken(user._id);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: user.toPublicJSON(),
    });

  } catch (err) {
    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(' ') });
    }
    next(err);
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────
// Log in with email + password
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Fetch user including password (select:false by default)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      // Deliberately vague message to prevent user enumeration
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = signToken(user._id);

    res.json({
      message: 'Logged in successfully.',
      token,
      user: user.toPublicJSON(),
    });

  } catch (err) {
    next(err);
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────
// Returns the currently authenticated user (used to restore session on page load)
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

// ─── PATCH /api/auth/me ───────────────────────────────────────────────────
// Update name or timezone
router.patch('/me', protect, async (req, res, next) => {
  try {
    const allowed = ['name', 'timezone'];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided to update.' });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new:         true,
      runValidators: true,
    });

    res.json({ message: 'Profile updated.', user: user.toPublicJSON() });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(' ') });
    }
    next(err);
  }
});

// ─── PATCH /api/auth/password ─────────────────────────────────────────────
// Change password (requires current password confirmation)
router.patch('/password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    user.password = newPassword; // pre-save hook re-hashes it
    await user.save();

    const token = signToken(user._id); // issue a fresh token
    res.json({ message: 'Password updated successfully.', token });

  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/auth/me ──────────────────────────────────────────────────
// Delete account and all associated dreams
router.delete('/me', protect, async (req, res, next) => {
  try {
    const Dream = require('../models/Dream');
    await Dream.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account and all dream records have been permanently deleted.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
