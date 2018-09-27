const express = require('express');

const categories = require('./categories/');
const households = require('./households/');
const users = require('./users/');

module.exports = (app) => {
  app.use('/categories', categories(express.Router(), app));
  app.use('/households', households(express.Router(), app));
  app.use('/users', users(express.Router(), app));
};
