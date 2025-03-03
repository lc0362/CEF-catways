const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    catwayId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Catway", 
        required: [true, "L'identifiant du catway est requis"] 
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
        maxlength: [100, "Le nom du bateau ne peut pas dépasser 100 caractères"]
    },
    checkIn: { 
        type: Date, 
        required: [true, "La date de début de réservation est requise"]
    },
    checkOut: { 
        type: Date, 
        required: [true, "La date de fin de réservation est requise"]
    }
}, { timestamps: true });

// Vérification que checkOut est après checkIn
ReservationSchema.pre("save", function (next) {
    if (this.checkOut <= this.checkIn) {
        return next(new Error("La date de fin doit être après la date de début"));
    }
    next();
});

module.exports = mongoose.model("Reservation", ReservationSchema);
