'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('expenses', 'fund_uuid', {
      allowNull: true,
      references: {
        key: 'uuid',
        model: 'funds',
      },
      type: Sequelize.UUID,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('expenses', 'fund_uuid');
  },
};
