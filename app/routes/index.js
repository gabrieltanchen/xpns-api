const express = require('express');
const users = require('./users/');

module.exports = (app) => {
  app.use('/users', users(express.Router(), app));
};
