const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deleted_at: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    first_name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    household_uuid: {
      allowNull: false,
      type: Sequelize.UUID,
    },
    last_name: {
      allowNull: false,
      type: Sequelize.STRING,
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
    paranoid: true,
    tableName: 'users',
    timestamps: true,
  });
};
