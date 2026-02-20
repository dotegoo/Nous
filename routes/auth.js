const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ─── HELPER: semneaza un JWT pentru un utilizator ─────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── POST /api/auth/signup ────────────────────────────────────────────────
// Creeaza un cont nou
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Verificare simpla de prezenta (validatorii mongoose se ocupa de restul)
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are all required.' });
    }

    // Verifica email duplicat inainte de a incerca salvarea
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Creeaza utilizator — parola este criptata automat prin hook-ul pre-save din User.js
    const user = await User.create({ name, email, password });

    const token = signToken(user._id);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: user.toPublicJSON(),
    });

  } catch (err) {
    // Erori de validare mongoose
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(' ') });
    }
    next(err);
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────
// Autentificare cu email si parola
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Preia utilizator incluzand parola (select:false implicit)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      // Mesaj deliberat vag pentru a preveni enumerarea utilizatorilor
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
// Returneaza utilizatorul autentificat curent (folosit pentru a restabili sesiunea la incarcare)
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

// ─── PATCH /api/auth/me ───────────────────────────────────────────────────
// Actualizeaza numele sau fusul orar
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
// Schimba parola (necesita confirmarea parolei curente)
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
// Sterge contul si toate visele asociate
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
