const nconf = require('nconf');
const Sequelize = require('sequelize');

const Audit = require('./audit/');
const Category = require('./category');
const Expense = require('./expense');
const Hash = require('./hash');
const Household = require('./household');
const User = require('./user');
const UserLogin = require('./user-login');
const Vendor = require('./vendor');

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
    });

    this.Audit = Audit(this.sequelize);
    this.Category = Category(this.sequelize);
    this.Expense = Expense(this.sequelize);
    this.Hash = Hash(this.sequelize);
    this.Household = Household(this.sequelize);
    this.User = User(this.sequelize);
    this.UserLogin = UserLogin(this.sequelize);
    this.Vendor = Vendor(this.sequelize);

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
    this.Category.hasMany(this.Expense, {
      foreignKey: 'category_uuid',
    });
    this.Category.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });

    // Expense
    this.Expense.belongsTo(this.Category, {
      foreignKey: 'category_uuid',
    });
    this.Expense.belongsTo(this.Vendor, {
      foreignKey: 'vendor_uuid',
    });

    // Household
    this.Household.hasMany(this.Category, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.User, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.Vendor, {
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

    // Vendor
    this.Vendor.hasMany(this.Expense, {
      foreignKey: 'vendor_uuid',
    });
    this.Vendor.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });
  }
}

module.exports = Models;
