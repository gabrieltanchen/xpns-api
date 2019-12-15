'use strict';
/* istanbul ignore next */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('expenses', 'subcategory_uuid', {
      allowNull: false,
      references: {
        key: 'uuid',
        model: 'subcategories',
      },
      type: Sequelize.UUID,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('expenses', 'subcategory_uuid');
  },
};
