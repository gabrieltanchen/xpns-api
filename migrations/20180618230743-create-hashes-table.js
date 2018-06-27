'use strict';
/* istanbul ignore next */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('hashes', {
      h1: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(128),
      },
      s2: {
        allowNull: false,
        type: Sequelize.STRING(64),
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('hashes');
  },
};
