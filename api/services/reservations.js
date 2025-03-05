const Reservation = require('../models/reservation');
const Catway = require('../models/catway'); 
const mongoose = require('mongoose');

exports.getAllReservations = async (req, res) => {
    try {
        let filter = {};

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

      const { id } = req.params; // ID du catway
      const { clientName, boatName, checkIn, checkOut } = req.body;

      console.log("🔍 ID du catway reçu :", id);

      if (!id) {
        console.log("❌ Erreur : ID du catway manquant !");
        return res.status(400).json({ error: "ID du catway manquant dans l'URL" });
      }

      if (!clientName || !boatName || !checkIn || !checkOut) {
          return res.status(400).json({ error: "Tous les champs sont obligatoires" });
      }

      // Vérifier si l'ID est valide
      if (!mongoose.Types.ObjectId.isValid(id)) {
          console.log("❌ ID du catway invalide :", id);
          return res.status(400).json({ error: "ID du catway invalide" });
      }

      // Vérifier si le catway existe
      const catwayExists = await Catway.findById(id);
      if (!catwayExists) {
          console.log("❌ Catway non trouvé !");
          return res.status(404).json({ error: "Catway non trouvé" });
      }

      // Créer et enregistrer la nouvelle réservation
      const newReservation = new Reservation({
          catwayId: id,
          clientName,
          boatName,
          checkIn,
          checkOut
      });

      await newReservation.save();

      console.log("✅ Réservation créée :", newReservation);
      res.status(201).json({
          message: "Réservation ajoutée avec succès",
          reservation: newReservation
      });

  } catch (err) {
      console.error("❌ Erreur lors de l'ajout de la réservation :", err);
      res.status(500).json({ error: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
      const { idReservation } = req.params;

      console.log("🗑️ Suppression de la réservation ID :", idReservation);

      const deletedReservation = await Reservation.findByIdAndDelete(idReservation);
      if (!deletedReservation) {
          console.log("❌ Réservation non trouvée !");
          return res.status(404).json({ message: "Réservation non trouvée" });
      }

      res.json({ message: "✅ Réservation supprimée avec succès !" });
  } catch (err) {
      console.error("❌ Erreur lors de la suppression :", err);
      res.status(500).json({ error: err.message });
  }
};
