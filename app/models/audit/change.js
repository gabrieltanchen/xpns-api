const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AuditChange', {
    attribute: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    audit_log_uuid: {
      allowNull: false,
      type: Sequelize.UUID,
    },
    key: {
      allowNull: false,
      type: Sequelize.UUID,
    },
    new_value: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    old_value: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    table: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    uuid: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID,
    },
  }, {
    paranoid: false,
    tableName: 'audit_changes',
    timestamps: false,
  });
};
