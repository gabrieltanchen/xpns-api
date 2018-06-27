'use strict';
/* istanbul ignore next */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('audit_changes', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      audit_log_uuid: {
        allowNull: false,
        references: {
          key: 'uuid',
          model: 'audit_logs',
        },
        type: Sequelize.UUID,
      },
      table: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      key: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      attribute: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      old_value: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      new_value: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('audit_changes');
  },
};
