const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('UserLogin', {
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    h2: {
      allowNull: false,
      type: Sequelize.STRING(128),
    },
    s1: {
      allowNull: false,
      type: Sequelize.STRING(64),
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    user_uuid: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
    },
  }, {
    paranoid: true,
    tableName: 'user_logins',
    timestamps: true,
  });
};
