'use strict';
/* istanbul ignore next */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('budgets', 'budget_cents', 'amount_cents');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('budgets', 'amount_cents', 'budget_cents');
  },
};
