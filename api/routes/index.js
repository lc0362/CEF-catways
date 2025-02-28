var express = require('express');
var router = express.Router();

const catwaysRoute = require('./catways');

router.get('/', async (req, res) => {
  res.status(200).json({
    name: process.env.APP_NAME,
    version: '1.0',
    status: 200,
    message: 'Bienvenue sur l\'API !'
  });
});

router.use('/catways', catwaysRoute);


module.exports = router;
