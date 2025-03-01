var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var catwaysRouter = require('./routes/catways');
const authRoutes = require('./routes/auth');

var app = express();

// Ici le * signifie que nous souhaitons accepter toutes les requêtes 
// entrantes de tous les domaines, externes ou non
app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
  }));

  app.use(logger('dev'));
  app.use(express.json()); 
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.use('/auth', authRoutes); 
  app.use('/', indexRouter);
  app.use('/catways', catwaysRouter);
  
  app.use(function(req, res, next) {
      res.status(404).json({ name: 'API', version: '1.0', status: 404, message: 'not_found' });
  });
  
  module.exports = app;
