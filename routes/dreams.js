const express  = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Dream     = require('../models/Dream');
const { protect } = require('../middleware/auth');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const gemini = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// All dream routes require authentication
router.use(protect);

// ─── LENS SYSTEM PROMPTS ──────────────────────────────────────────────────
const LENS_PROMPTS = {
  jungian: `You are Nous, a Jungian dream analyst. Interpret through the lens of Carl Jung — archetypes (Shadow, Anima/Animus, Self, Persona, Hero), the collective unconscious, individuation, and symbolic amplification. Speak with poetic depth and wisdom.`,

  freudian: `You are Nous, a Freudian dream analyst. Interpret through the lens of Sigmund Freud — unconscious wishes, repression, id/ego/superego dynamics, symbolic displacement, condensation, and latent vs manifest content. Be psychoanalytically insightful but accessible.`,

  spiritual: `You are Nous, a spiritual dream interpreter drawing from world mythology, ancient symbolism, Hermeticism, shamanic traditions, and the soul's language. Interpret dreams as messages from deeper dimensions of existence — oracular, poetic, timeless.`,

  practical: `You are Nous, a practical psychological dream analyst. Interpret dreams as the mind processing waking-life emotions, relationships, stress, and unresolved experiences. Keep the interpretation grounded, relatable, and personally insightful.`,
};

const LENS_KEYS = Object.keys(LENS_PROMPTS);

// ─── GET /api/dreams ──────────────────────────────────────────────────────
// Fetch all dreams for the logged-in user (paginated)
router.get('/', async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    // Optional lens filter
    const filter = { user: req.user._id };
    if (req.query.lens && LENS_KEYS.includes(req.query.lens)) {
      filter.lens = req.query.lens;
    }

    const [dreams, total] = await Promise.all([
      Dream.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Dream.countDocuments(filter),
    ]);

    res.json({
      dreams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/dreams/calendar ─────────────────────────────────────────────
// Returns dreams grouped by date — used to populate the calendar view
// Query params: year, month (e.g. ?year=2025&month=11)
router.get('/calendar', async (req, res, next) => {
  try {
    const year  = parseInt(req.query.year)  || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    const start = new Date(year, month - 1, 1);           // 1st of the month
    const end   = new Date(year, month, 0, 23, 59, 59);   // last day of the month

    const dreams = await Dream.find({
      user:      req.user._id,
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: 1 })
      .select('createdAt lens symbols dream interpretation');

    // Group by YYYY-MM-DD date string
    const byDate = {};
    dreams.forEach((d) => {
      const key = d.createdAt.toISOString().slice(0, 10);
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(d);
    });

    res.json({ year, month, calendar: byDate });

  } catch (err) {
    next(err);
  }
});

// ─── GET /api/dreams/:id ──────────────────────────────────────────────────
// Fetch a single dream by ID
router.get('/:id', async (req, res, next) => {
  try {
    const dream = await Dream.findOne({ _id: req.params.id, user: req.user._id });
    if (!dream) return res.status(404).json({ error: 'Dream not found.' });
    res.json({ dream });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid dream ID.' });
    next(err);
  }
});

// ─── POST /api/dreams/interpret ───────────────────────────────────────────
// Send a dream to Anthropic, get interpretation, save and return the result
router.post('/interpret', async (req, res, next) => {
  try {
    const { dream, lens = 'jungian' } = req.body;

    if (!dream || typeof dream !== 'string') {
      return res.status(400).json({ error: 'Dream content is required.' });
    }
    if (dream.trim().length < 10) {
      return res.status(400).json({ error: 'Please describe your dream in a little more detail.' });
    }
    if (!LENS_KEYS.includes(lens)) {
      return res.status(400).json({ error: `Lens must be one of: ${LENS_KEYS.join(', ')}.` });
    }

    // Call Gemini
    const prompt =
      LENS_PROMPTS[lens] +
      '\n\nRespond ONLY with a valid JSON object (no markdown, no preamble):\n' +
      '{\n  "interpretation": "2-4 paragraphs separated by \\n\\n, addressing the dreamer as you",\n  "symbols": ["3-6 short symbol labels"]\n}' +
      `\n\nInterpret this dream: ${dream.trim()}`;

    const result = await gemini.generateContent(prompt);
    const raw    = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      return res.status(502).json({ error: 'The oracle returned an unreadable response. Please try again.' });
    }

    if (!parsed.interpretation || !Array.isArray(parsed.symbols)) {
      return res.status(502).json({ error: 'Unexpected response format from the oracle.' });
    }

    // Save to database
    const saved = await Dream.create({
      user:           req.user._id,
      dream:          dream.trim(),
      lens,
      interpretation: parsed.interpretation,
      symbols:        parsed.symbols.slice(0, 10),
    });

    res.status(201).json({
      message: 'Dream interpreted and saved.',
      dream:   saved,
    });

  } catch (err) {
    // Gemini API errors
    if (err?.status === 400) return res.status(400).json({ error: 'Invalid request to the oracle.' });
    if (err?.status === 429) return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
    next(err);
  }
});

// ─── PATCH /api/dreams/:id/notes ─────────────────────────────────────────
// Add or update personal notes on a saved dream
router.patch('/:id/notes', async (req, res, next) => {
  try {
    const { notes } = req.body;
    if (typeof notes !== 'string') {
      return res.status(400).json({ error: 'Notes must be a string.' });
    }

    const dream = await Dream.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { notes },
      { new: true, runValidators: true }
    );

    if (!dream) return res.status(404).json({ error: 'Dream not found.' });
    res.json({ message: 'Notes saved.', dream });

  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid dream ID.' });
    next(err);
  }
});

// ─── DELETE /api/dreams/:id ───────────────────────────────────────────────
// Soft-delete a dream (sets deleted: true, keeps it in DB)
router.delete('/:id', async (req, res, next) => {
  try {
    const dream = await Dream.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { deleted: true },
      { new: true }
    );

    if (!dream) return res.status(404).json({ error: 'Dream not found.' });
    res.json({ message: 'Dream removed from your journal.' });

  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid dream ID.' });
    next(err);
  }
});

module.exports = router;