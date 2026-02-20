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
      select:    false, // niciodata returnata in interogari implicit
    },

    // Campuri de profil optionale — pot fi extinse mai tarziu
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
    timestamps: true, // adauga createdAt + updatedAt automat
  }
);

// ─── HASH LA PAROLA INAINTE DE SALVARE ───────────────────────────────────
UserSchema.pre('save', async function (next) {
  // Cripteaza doar daca campul parola a fost modificat
  if (!this.isModified('password')) return next();

  const salt   = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── METODA INSTANTA: compara parolele ───────────────────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── METODA INSTANTA: profil public sigur ─────────────────────────────────
// Returneaza datele utilizatorului fara campuri sensibile
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
