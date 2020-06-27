const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Budget', {
    amount_cents: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deleted_at: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    month: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    subcategory_uuid: {
      allowNull: false,
      type: Sequelize.UUID,
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
    year: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  }, {
    paranoid: true,
    tableName: 'budgets',
    timestamps: true,
  });
};
