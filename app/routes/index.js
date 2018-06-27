const express = require('express');
const households = require('./households/');
const users = require('./users/');

module.exports = (app) => {
  app.use('/households', households(express.Router(), app));
  app.use('/users', users(express.Router(), app));
};
