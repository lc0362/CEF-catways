const Reservation = require('../models/reservation');
const Catway = require('../models/catway'); 
const mongoose = require('mongoose');

exports.getAllReservations = async (req, res) => {
    try {
        let filter = {};

        // Vérifier si un checkIn est fourni en paramètre de requête
        if (req.query.checkIn) {
            const checkInDate = new Date(req.query.checkIn);
            filter.checkIn = { $gte: checkInDate, $lt: new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000) };
        }

        const reservations = await Reservation.find(filter).populate('catwayId');
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation).populate('catwayId');
        if (!reservation) return res.status(404).json({ message: "Réservation non trouvée" });
        res.json(reservation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addReservation = async (req, res) => {
  try {
      console.log("📝 Corps de la requête reçu :", req.body);

      const { clientName, boatName, checkIn, checkOut } = req.body;
      const catwayId = req.params.id;

      console.log("🔍 ID reçu dans addReservation :", catwayId);

      if (!catwayId) {
        console.log("❌ Problème : ID du catway manquant !");
        return res.status(400).json({ error: "ID du catway manquant dans l'URL" });
      }

      if (!clientName || !boatName || !checkIn || !checkOut) {
          return res.status(400).json({ error: "Tous les champs sont obligatoires" });
      }

      // Vérifie si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(catwayId)) {
          console.log("❌ ID invalide :", catwayId);
          return res.status(400).json({ error: "ID du catway invalide" });
      }

      const objectId = new mongoose.Types.ObjectId(catwayId);
      console.log("🆔 ID converti en ObjectId :", objectId);

      // Vérifie si le catway existe bien
      const catwayExists = await Catway.findById(objectId);
      console.log("📌 Catway trouvé :", catwayExists);

      if (!catwayExists) {
          return res.status(404).json({ error: "Catway non trouvé" });
      }

      const newReservation = new Reservation({
          catwayId: objectId,
          clientName,
          boatName,
          checkIn,
          checkOut
      });

      await newReservation.save();
      res.status(201).json({ message: "Réservation ajoutée avec succès", reservation: newReservation });

  } catch (err) {
      console.error("❌ Erreur lors de l'ajout de la réservation :", err);
      res.status(500).json({ error: err.message });
  }
};



exports.deleteReservation = async (req, res) => {
  try {
      const deletedReservation = await Reservation.findByIdAndDelete(req.params.idReservation);
      if (!deletedReservation) return res.status(404).json({ message: "Réservation non trouvée" });
      res.json({ message: "Réservation supprimée" });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};