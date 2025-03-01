const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    catwayNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Catway",
        required: [true, "Le numéro de pont est requis"]
    },
    clientName: {
        type: String,
        trim: true,
        required: [true, "Le nom du client est requis"]
    },
    boatName: {
        type: String,
        trim: true,
        required: [true, "Le nom du bateau est requis"],
        maxlength: [50, "Le nom du bateau ne peut pas dépasser 100 caractères"]
    },
    checkIn: {
        type: Date,
        required: [true, "La date de début de réservation est requise"],
        validate: {
            validator: function(value) {
                return !isNaN(Date.parse(value));
            },
            message: "La date de début doit être valide"
        }
    },
    checkOut: {
        type: Date,
        required: [true, "La date de fin de réservation est requise"],
        validate: {
            validator: function(value) {
                return !isNaN(Date.parse(value)) && value > this.checkIn;
            },
            message: "La date de fin doit être après la date de début"
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);
