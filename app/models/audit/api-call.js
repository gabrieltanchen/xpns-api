const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AuditApiCall', {
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    http_method: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    ip_address: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    route: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    user_agent: {
      allowNull: true,
      type: Sequelize.TEXT,
    },
    user_uuid: {
      allowNull: true,
      type: Sequelize.UUID,
    },
    uuid: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID,
    },
  }, {
    paranoid: false,
    tableName: 'audit_api_calls',
    timestamps: true,
  });
};
