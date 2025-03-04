const express = require('express');
const path = require('path');
const service = require('../services/reservations');
const router = express.Router({ mergeParams: true });
const private = require('../middlewares/private');

router.use((req, res, next) => {
    console.log("📌 ID Catway reçu dans la route :", req.params.id);
    next();
});

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


// Supprimer une réservation d'un catway
router.delete('/:idReservation', private.checkJWT, service.deleteReservation);

// La route pour le détail des réservations en fonction de l'id
router.get('/details/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/components/reservations-detail.html'));
});

module.exports = router;
