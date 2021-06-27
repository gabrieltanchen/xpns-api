const nconf = require('nconf');
const Sequelize = require('sequelize');

const Audit = require('./audit');
const Budget = require('./budget');
const Category = require('./category');
const Deposit = require('./deposit');
const Expense = require('./expense');
const Fund = require('./fund');
const Hash = require('./hash');
const Household = require('./household');
const HouseholdMember = require('./household-member');
const Income = require('./income');
const Subcategory = require('./subcategory');
const User = require('./user');
const UserLogin = require('./user-login');
const Vendor = require('./vendor');

class Models {
  constructor(databaseUrl) {
    let logging = console.log; // eslint-disable-line no-console
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
    this.Budget = Budget(this.sequelize);
    this.Category = Category(this.sequelize);
    this.Deposit = Deposit(this.sequelize);
    this.Expense = Expense(this.sequelize);
    this.Fund = Fund(this.sequelize);
    this.Hash = Hash(this.sequelize);
    this.Household = Household(this.sequelize);
    this.HouseholdMember = HouseholdMember(this.sequelize);
    this.Income = Income(this.sequelize);
    this.Subcategory = Subcategory(this.sequelize);
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

    // Budget
    this.Budget.belongsTo(this.Subcategory, {
      foreignKey: 'subcategory_uuid',
    });

    // Category
    this.Category.hasMany(this.Subcategory, {
      foreignKey: 'category_uuid',
    });
    this.Category.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });

    // Deposit
    this.Deposit.belongsTo(this.Fund, {
      foreignKey: 'fund_uuid',
    });

    // Expense
    this.Expense.belongsTo(this.Fund, {
      foreignKey: 'fund_uuid',
    });
    this.Expense.belongsTo(this.HouseholdMember, {
      foreignKey: 'household_member_uuid',
    });
    this.Expense.belongsTo(this.Subcategory, {
      foreignKey: 'subcategory_uuid',
    });
    this.Expense.belongsTo(this.Vendor, {
      foreignKey: 'vendor_uuid',
    });

    // Fund
    this.Fund.hasMany(this.Deposit, {
      foreignKey: 'fund_uuid',
    });
    this.Fund.hasMany(this.Expense, {
      foreignKey: 'fund_uuid',
    });
    this.Fund.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });

    // Household
    this.Household.hasMany(this.Category, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.Fund, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.HouseholdMember, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.User, {
      foreignKey: 'household_uuid',
    });
    this.Household.hasMany(this.Vendor, {
      foreignKey: 'household_uuid',
    });

    // HouseholdMember
    this.HouseholdMember.hasMany(this.Expense, {
      foreignKey: 'household_member_uuid',
    });
    this.HouseholdMember.belongsTo(this.Household, {
      foreignKey: 'household_uuid',
    });
    this.HouseholdMember.hasMany(this.Income, {
      foreignKey: 'household_member_uuid',
    });

    // Income
    this.Income.belongsTo(this.HouseholdMember, {
      foreignKey: 'household_member_uuid',
    });

    // Subcategory
    this.Subcategory.hasMany(this.Budget, {
      foreignKey: 'subcategory_uuid',
    });
    this.Subcategory.belongsTo(this.Category, {
      foreignKey: 'category_uuid',
    });
    this.Subcategory.hasMany(this.Expense, {
      foreignKey: 'subcategory_uuid',
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
