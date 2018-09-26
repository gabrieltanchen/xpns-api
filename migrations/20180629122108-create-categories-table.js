'use strict';
/* istanbul ignore next */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('categories', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      household_uuid: {
        allowNull: false,
        references: {
          key: 'uuid',
          model: 'households',
        },
        type: Sequelize.UUID,
      },
      parent_uuid: {
        allowNull: true,
        references: {
          key: 'uuid',
          model: 'categories',
        },
        type: Sequelize.UUID,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('categories');
  },
};
