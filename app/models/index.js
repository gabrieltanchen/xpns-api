const nconf = require('nconf');
const Sequelize = require('sequelize');

const Hash = require('./hash');
const Household = require('./household');
const User = require('./user');
const UserLogin = require('./user-login');

class Models {
  constructor(databaseUrl) {
    let logging = console.log;
    if (nconf.get('NODE_ENV') === 'test') {
      logging = null;
    }
    this.sequelize = new Sequelize(databaseUrl, {
      define: {
        createdAt: 'created_at',
        deletedAt: 'deleted_at',
        updatedAt: 'updated_at',
      },
      dialect: 'postgres',
      logging,
      pool: {
        idle: 10000,
        max: 5,
        min: 0,
      },
      operatorsAliases: false,
    });

    this.Hash = Hash(this.sequelize);
    this.Household = Household(this.sequelize);
    this.User = User(this.sequelize);
    this.UserLogin = UserLogin(this.sequelize);

    // Household
    this.Household.hasMany(this.User);

    // User
    this.User.belongsTo(this.Household);
    this.User.hasOne(this.UserLogin);

    // UserLogin
    this.UserLogin.belongsTo(this.User);
  }
}

module.exports = Models;
