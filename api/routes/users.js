var express = require('express');
var router = express.Router();
const private = require('../middlewares/private'); 
const service = require('../services/users'); 

// Voir tous les utilisateurs 
router.get('/', service.getAllUsers);

// Modifier un utilisateur via son ID
router.patch('/update/:id', private.checkJWT, service.updateUser);

// Supprimer un utilisateur via son ID
router.delete('/delete/:id', private.checkJWT, service.deleteUser);

module.exports = router;
