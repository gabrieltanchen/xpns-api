const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Hash', {
    h1: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING(128),
    },
    s2: {
      allowNull: false,
      type: Sequelize.STRING(64),
    },
  }, {
    paranoid: true,
    tableName: 'hashes',
    timestamps: false,
  });
};
