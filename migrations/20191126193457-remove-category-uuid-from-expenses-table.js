'use strict';
/* istanbul ignore next */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('expenses', 'category_uuid');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('expenses', 'category_uuid', {
      allowNull: true,
      references: {
        key: 'uuid',
        model: 'categories',
      },
      type: Sequelize.UUID,
    });
  },
};
