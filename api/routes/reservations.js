const express = require('express');
const path = require('path');
const service = require('../services/reservations');
const router = express.Router();
const private = require('../middlewares/private');

// Récupérer toutes les réservations d'un catway
router.get('/', private.checkJWT, service.getAllReservations);

// La route de consultation de toutes les réservations sur le server
router.get('/list', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public/components/reservations.html'));
    } catch (error) {
        res.status(500).json({ error: "❌ Impossible de charger la page des réservations" });
    }
});

// Récupérer une réservation spécifique d'un catway
router.get('/:idReservation', private.checkJWT, service.getReservationById);

// Ajouter une réservation pour un catway
router.post('/', private.checkJWT, service.addReservation);

// Modifier une réservation d'un catway
router.patch('/:idReservation', private.checkJWT, service.updateReservation);

// Supprimer une réservation d'un catway
router.delete('/:idReservation', private.checkJWT, service.deleteReservation);

module.exports = router;
