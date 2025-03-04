const express = require('express');
const router = express.Router();
const path = require('path');
const private = require('../middlewares/private'); 

const service = require('../services/catways');
const reservationsRoutes = require('./reservations'); 

// La route de consultation de tous les catways sur postman
router.get('/', private.checkJWT, service.getAllCatways);

// La route de consultation de tous les catways sur le server
router.get('/list', (req, res) => {
  try {
      res.sendFile(path.join(__dirname, '../public/components/catways.html'));
  } catch (error) {
      res.status(500).json({ error: "❌ Impossible de charger la page des catways" });
  }
});

// La route pour lire les infos d'un catway spécifique
router.get('/:id', private.checkJWT, async (req, res) => {
  try {
      const catwayId = req.params.id;
      console.log("📌 ID reçu par le serveur :", catwayId);

      if (!mongoose.Types.ObjectId.isValid(catwayId)) {
          console.log("❌ ID invalide reçu :", catwayId);
          return res.status(400).json({ error: "❌ ID invalide" });
      }

      const catway = await CatwayModel.findById(catwayId);
      console.log("📌 Résultat MongoDB :", catway);

      if (!catway) {
          console.log("❌ Catway non trouvé :", catwayId);
          return res.status(404).json({ error: "❌ Catway non trouvé" });
      }

      res.json(catway);
  } catch (error) {
      console.error("❌ Erreur serveur :", error);
      res.status(500).json({ error: "❌ Erreur serveur", details: error.message });
  }
});


// La route pour ajouter un catway
router.post('/add', private.checkJWT, service.add);

// La route pour modifier un catway
router.patch('/:id', private.checkJWT, service.update);

// La route pour supprimer un catway
router.delete('/:id', private.checkJWT, service.delete);

// La route pour les réservations, en tant que sous ressource
router.use('/:id/reservations', (req, res, next) => {
  console.log("📌 ID Catway reçu dans la route :", req.params.id); 
  next();
}, reservationsRoutes);

// La route pour le détail des catways en fonction de l'id
router.get('/details/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/components/catways-detail.html'));
});

module.exports = router;
