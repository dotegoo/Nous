const mongoose = require('mongoose');

const DreamSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true, // cautare rapida dupa utilizator
    },

    // Textul brut al visului introdus de utilizator
    dream: {
      type:      String,
      required:  [true, 'Dream content is required.'],
      trim:      true,
      minlength: [10,   'Please describe your dream in a little more detail.'],
      maxlength: [5000, 'Dream description is too long (max 5000 characters).'],
    },

    // Ce lentila interpretativa a fost folosita
    lens: {
      type:     String,
      required: true,
      enum:     {
        values:  ['jungian', 'freudian', 'spiritual', 'practical'],
        message: 'Lens must be one of: jungian, freudian, spiritual, practical.',
      },
    },

    // Textul complet al interpretarii returnat de AI
    interpretation: {
      type:     String,
      required: true,
      trim:     true,
    },

    // Array de siruri scurte cu simboluri identificate in vis
    symbols: {
      type:    [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message:   'A dream can have at most 10 identified symbols.',
      },
    },

    // Note optionale adaugate de utilizator sau reflectii dupa citirea interpretarii
    notes: {
      type:      String,
      trim:      true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters.'],
      default:   '',
    },

    // Steag stergere usoara — permite utilizatorilor sa "stearga" fara a pierde date permanente
    deleted: {
      type:    Boolean,
      default: false,
      index:   true,
    },
  },
  {
    timestamps: true, // createdAt = noaptea in care a fost inregistrat visul
  }
);

// ─── INDEX COMPOZIT ───────────────────────────────────────────────────────
// Interogari eficiente gen "toate visele pentru utilizatorul X sortate dupa data"
DreamSchema.index({ user: 1, createdAt: -1 });

// ─── HELPER PENTRU QUERY: exclude stergerile usoare implicit ─────────────
DreamSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeDeleted) {
    this.where({ deleted: false });
  }
  next();
});

// ─── VIRTUAL: sirul de data formatat ───────────────────────────────────────
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
