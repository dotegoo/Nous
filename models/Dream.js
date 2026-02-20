const mongoose = require('mongoose');

const DreamSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true, // fast lookup by user
    },

    // The raw dream text entered by the user
    dream: {
      type:      String,
      required:  [true, 'Dream content is required.'],
      trim:      true,
      minlength: [10,   'Please describe your dream in a little more detail.'],
      maxlength: [5000, 'Dream description is too long (max 5000 characters).'],
    },

    // Which interpretive lens was used
    lens: {
      type:     String,
      required: true,
      enum:     {
        values:  ['jungian', 'freudian', 'spiritual', 'practical'],
        message: 'Lens must be one of: jungian, freudian, spiritual, practical.',
      },
    },

    // The full interpretation text returned by the AI
    interpretation: {
      type:     String,
      required: true,
      trim:     true,
    },

    // Array of short symbol strings identified in the dream
    symbols: {
      type:    [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message:   'A dream can have at most 10 identified symbols.',
      },
    },

    // Optional user-added notes or reflections after reading the interpretation
    notes: {
      type:      String,
      trim:      true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters.'],
      default:   '',
    },

    // Soft-delete flag — lets users "delete" without losing data permanently
    deleted: {
      type:    Boolean,
      default: false,
      index:   true,
    },
  },
  {
    timestamps: true, // createdAt = the night of the dream record
  }
);

// ─── COMPOUND INDEX ───────────────────────────────────────────────────────
// Efficient queries like "all dreams for user X sorted by date"
DreamSchema.index({ user: 1, createdAt: -1 });

// ─── QUERY HELPER: exclude soft-deleted by default ────────────────────────
DreamSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ deleted: false });
  }
  next();
});

// ─── VIRTUAL: formatted date string ───────────────────────────────────────
DreamSchema.virtual('dateStr').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    month: 'long',
    day:   'numeric',
    year:  'numeric',
  });
});

DreamSchema.set('toJSON',   { virtuals: true });
DreamSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Dream', DreamSchema);
