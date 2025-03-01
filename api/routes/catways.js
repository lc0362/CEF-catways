const express = require('express');
const router = express.Router();
const private = require('../middlewares/private'); 

const service = require('../services/catways');
const reservationsRoutes = require('./reservations'); 


router.get('/test', (req, res) => {
    res.json({ message: "Route /catways fonctionne !" });
  });

router.get('/', service.getAllCatways);

// La route pour lire les infos d'un catway
router.get('/:id', private.checkJWT, service.getById);

// La route pour ajouter un catway
router.post('/add', service.add);

// La route pour modifier un catway
router.patch('/:id', private.checkJWT, service.update);

// La route pour supprimer un catway
router.delete('/:id', private.checkJWT, service.delete);

// Ajout de la route /authenticate
router.post('/authenticate', service.authenticate);

// La route pour les réservations, en tant que sous ressource
router.use('/:id/reservations', reservationsRoutes);


module.exports = router;
