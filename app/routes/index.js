const express = require('express');

const categories = require('./categories/');
const expenses = require('./expenses/');
const householdMembers = require('./household-members/');
const households = require('./households/');
const users = require('./users/');
const vendors = require('./vendors/');

module.exports = (app) => {
  app.use('/categories', categories(express.Router(), app));
  app.use('/expenses', expenses(express.Router(), app));
  app.use('/household-members', householdMembers(express.Router(), app));
  app.use('/households', households(express.Router(), app));
  app.use('/users', users(express.Router(), app));
  app.use('/vendors', vendors(express.Router(), app));
};
