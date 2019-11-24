'use strict';
/* istanbul ignore next */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('expenses', 'household_member_uuid', {
      allowNull: false,
      references: {
        key: 'uuid',
        model: 'household_members',
      },
      type: Sequelize.UUID,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('expenses', 'household_member_uuid');
  },
};
