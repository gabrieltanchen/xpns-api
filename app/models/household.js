const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Household', {
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deleted_at: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    name: {
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
    tableName: 'households',
    timestamps: true,
  });
};
