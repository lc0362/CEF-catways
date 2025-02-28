const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams permet d'utiliser l'id du catway
const service = require('../services/reservations');

// Récupérer toutes les réservations d'un catway
router.get('/', service.getAllReservations);

// Récupérer une réservation spécifique d'un catway
router.get('/:idReservation', service.getReservationById);

// Ajouter une réservation pour un catway
router.post('/', service.addReservation);

// Supprimer une réservation d'un catway
router.delete('/:idReservation', service.deleteReservation);

module.exports = router;
