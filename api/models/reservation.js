const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Catway = new Schema({
    catwayNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Catway",
        required: [true, "Le numéro de pont est requis"]
    },
    boatName: {
        type: String,
        trim: true,
        required: [true, "Le nom du bateau est requis"],
    },
    checkIn: {
        type: Date,
        trim: true,
        required: [true, "La date de début de réservation est requise"],
        validate: {
            validator: function(value) {
                return !isNaN(Date.parse(value));
            },
            message: "La date de début doit être au format ISO (YYYY-MM-DD ou YYYY-MM-DDTHH:MM:SSZ)"
        }
    },
    checkOut: {
        type: Date,
        trim: true,
        required: [true, "La date de fin de réservation est requise"],
        validate: {
            validator: function(value) {
                return !isNaN(Date.parse(value)) && value > this.checkIn;
            },
            message: "La date de fin doit être valide et après la date de début"
        }
    }
    
}, {
  // ajoute 2 champs au document : createdAt et updatedAt
  timestamps: true
});

module.exports = mongoose.model('Catway', Catway);
