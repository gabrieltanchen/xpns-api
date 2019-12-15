const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Expense', {
    amount_cents: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    date: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    deleted_at: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    description: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    household_member_uuid: {
      allowNull: false,
      type: Sequelize.UUID,
    },
    reimbursed_cents: {
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
    vendor_uuid: {
      allowNull: false,
      type: Sequelize.UUID,
    },
  }, {
    paranoid: true,
    tableName: 'expenses',
    timestamps: true,
  });
};
