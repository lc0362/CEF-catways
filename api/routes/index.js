var express = require('express');
var router = express.Router();
const path = require('path');

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

router.get('/documentation', (req, res) => {
  try {
      res.sendFile(path.join(__dirname, '../public/components/documentation.html'));
  } catch (error) {
      res.status(500).json({ error: "❌ Impossible de charger la page documentation" });
  }
});

module.exports = router;
