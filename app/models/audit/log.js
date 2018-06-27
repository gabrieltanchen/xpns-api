const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AuditLog', {
    audit_api_call_uuid: {
      allowNull: true,
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
    uuid: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID,
    },
  }, {
    paranoid: false,
    tableName: 'audit_logs',
    timestamps: true,
  });
};
