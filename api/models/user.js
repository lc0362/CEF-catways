const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// On importe le module bcrypt qui permet de hacher des expressions
const bcrypt = require('bcrypt');

const User = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Le nom est requis']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'L’email est requis'],
        unique: true, // index unique
        lowercase: true
    },
    password: {
        type: String,
        trim: true
    }
}, {
  // ajoute 2 champs au document : createdAt et updatedAt
  timestamps: true
});

// Hash le mot de passe quand il est modifié en asynchrone
User.pre('save', async function (next) {
  if (!this.isModified('password')) {
      return next();
  }

  try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
  } catch (error) {
      next(error);
  }
});

module.exports = mongoose.model('User', User);