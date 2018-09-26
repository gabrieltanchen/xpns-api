const nconf = require('nconf');
const Sequelize = require('sequelize');

const Audit = require('./audit/');
const Category = require('./category');
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

    this.Audit = Audit(this.sequelize);
    this.Category = Category(this.sequelize);
    this.Hash = Hash(this.sequelize);
    this.Household = Household(this.sequelize);
    this.User = User(this.sequelize);
    this.UserLogin = UserLogin(this.sequelize);

    // Audit.ApiCall
    this.Audit.ApiCall.hasOne(this.Audit.Log, {
      foreignKey: 'audit_api_call_uuid',
    });
    this.Audit.ApiCall.belongsTo(this.User, {
      foreignKey: 'user_uuid',
    });

    // Audit.Change
    this.Audit.Change.belongsTo(this.Audit.Log, {
      foreignKey: 'audit_log_uuid',
    });

    // Audit.Log
    this.Audit.Log.belongsTo(this.Audit.ApiCall, {
      foreignKey: 'audit_api_call_uuid',
    });
    this.Audit.Log.hasMany(this.Audit.Change, {
      foreignKey: 'audit_log_uuid',
    });

    // Category
    this.Category.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });

    // Household
    this.Household.hasMany(this.Category, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.User, {
      foreignKey: 'household_uuid',
    });

    // User
    this.User.hasMany(this.Audit.ApiCall, {
      foreignKey: 'user_uuid',
    });
    this.User.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });
    this.User.hasOne(this.UserLogin, {
      foreignKey: 'user_uuid',
    });

    // UserLogin
    this.UserLogin.belongsTo(this.User, {
      foreignKey: 'user_uuid',
    });
  }
}

module.exports = Models;
