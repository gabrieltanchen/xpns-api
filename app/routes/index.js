const express = require('express');

const budgetReports = require('./budget-reports/');
const budgets = require('./budgets/');
const categories = require('./categories/');
const expenses = require('./expenses/');
const householdMembers = require('./household-members/');
const households = require('./households/');
const incomes = require('./incomes/');
const subcategories = require('./subcategories/');
const subcategoryAnnualReports = require('./subcategory-annual-reports/');
const users = require('./users/');
const vendors = require('./vendors/');

module.exports = (app) => {
  app.use('/budget-reports', budgetReports(express.Router(), app));
  app.use('/budgets', budgets(express.Router(), app));
  app.use('/categories', categories(express.Router(), app));
  app.use('/expenses', expenses(express.Router(), app));
  app.use('/household-members', householdMembers(express.Router(), app));
  app.use('/households', households(express.Router(), app));
  app.use('/incomes', incomes(express.Router(), app));
  app.use('/subcategories', subcategories(express.Router(), app));
  app.use('/subcategory-annual-reports', subcategoryAnnualReports(express.Router(), app));
  app.use('/users', users(express.Router(), app));
  app.use('/vendors', vendors(express.Router(), app));
};
