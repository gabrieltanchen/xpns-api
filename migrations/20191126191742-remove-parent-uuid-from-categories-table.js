'use strict';
/* istanbul ignore next */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('categories', 'parent_uuid');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('categories', 'parent_uuid', {
      allowNull: true,
      references: {
        key: 'uuid',
        model: 'categories',
      },
      type: Sequelize.UUID,
    });
  },
};
