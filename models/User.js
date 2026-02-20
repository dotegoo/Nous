const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required.'],
      trim:      true,
      minlength: [2,  'Name must be at least 2 characters.'],
      maxlength: [50, 'Name cannot exceed 50 characters.'],
    },

    email: {
      type:      String,
      required:  [true, 'Email is required.'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'],
    },

    password: {
      type:      String,
      required:  [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters.'],
      select:    false, // never returned in queries by default
    },

    // Optional profile fields — can be expanded later
    timezone: {
      type:    String,
      default: 'UTC',
    },

    createdAt: {
      type:    Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// ─── HASH PASSWORD BEFORE SAVING ──────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  // Only hash if the password field was modified
  if (!this.isModified('password')) return next();

  const salt   = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── INSTANCE METHOD: compare passwords ───────────────────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── INSTANCE METHOD: safe public profile ─────────────────────────────────
// Returns user data without sensitive fields
UserSchema.methods.toPublicJSON = function () {
  return {
    id:        this._id,
    name:      this.name,
    email:     this.email,
    timezone:  this.timezone,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', UserSchema);
