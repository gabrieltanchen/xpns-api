'use strict';
/* istanbul ignore next */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('expenses', {
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
      category_uuid: {
        allowNull: false,
        references: {
          key: 'uuid',
          model: 'categories',
        },
        type: Sequelize.UUID,
      },
      vendor_uuid: {
        allowNull: false,
        references: {
          key: 'uuid',
          model: 'vendors',
        },
        type: Sequelize.UUID,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      amount_cents: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      reimbursed_cents: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('expenses');
  },
};
