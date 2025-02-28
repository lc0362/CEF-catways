const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Catway = new Schema({
    catwayNumber: {
        type: Number,
        trim: true,
        unique: true, // index unique,
        required: [true, "Le numéro de pont est requis"]
    },
    catwayType : {
        type: String,
        trim: true,
        required: [true, "Le type est requis"],
        enum: ["long", "short"]
    },
    catwayState: {
        type: String,
        trim: true,
        required: [true, "L'état est requis"],
        maxlength: [100, "La description ne peut pas dépasser 100 caractères"]
    }
}, {
  // ajoute 2 champs au document : createdAt et updatedAt
  timestamps: true
});

module.exports = mongoose.model('Catway', Catway);
