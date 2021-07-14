const chai = require('chai');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { AuditError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - AuditCtrl._trackInstanceDestroy', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  before('get app', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject without an audit log', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    try {
      await models.sequelize.transaction({
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
      }, async(transaction) => {
        await controllers.AuditCtrl._trackInstanceDestroy(null, household, transaction);
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit log is required');
      assert.isTrue(err instanceof AuditError);
    }
  });

  it('should reject without an instance', async function() {
    try {
      const auditLog = await models.Audit.Log.create();
      await models.sequelize.transaction({
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
      }, async(transaction) => {
        await controllers.AuditCtrl._trackInstanceDestroy(auditLog, null, transaction);
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Sequelize instance is required');
      assert.isTrue(err instanceof AuditError);
    }
  });

  it('should reject without a Sequelize transaction', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    try {
      const auditLog = await models.Audit.Log.create();
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, household, null);
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Sequelize transaction is required');
      assert.isTrue(err instanceof AuditError);
    }
  });

  it('should track deleting a Category', async function() {
    const auditLog = await models.Audit.Log.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    const category = await models.Category.create({
      household_uuid: household.get('uuid'),
      name: sampleData.categories.category1.name,
    });

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, category, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    const trackDeletedAt = _.find(auditChanges, (auditChange) => {
      return auditChange.get('table') === 'categories'
        && auditChange.get('attribute') === 'deleted_at'
        && auditChange.get('key') === category.get('uuid');
    });
    assert.isOk(trackDeletedAt);
    assert.isNull(trackDeletedAt.get('old_value'));
    assert.isOk(trackDeletedAt.get('new_value'));
    assert.strictEqual(auditChanges.length, 1);

    // Verify that the Category is deleted.
    assert.isNull(await models.Category.findOne({
      where: {
        uuid: category.get('uuid'),
      },
    }));
    assert.isOk(await models.Category.findOne({
      paranoid: false,
      where: {
        uuid: category.get('uuid'),
      },
    }));
  });

  it('should track deleting a Deposit', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    const fund = await models.Fund.create({
      amount_cents: 0,
      household_uuid: household.get('uuid'),
      name: sampleData.categories.category1.name,
    });
    const auditLog = await models.Audit.Log.create();
    const deposit = await models.Deposit.create({
      amount_cents: sampleData.expenses.expense1.amount_cents,
      date: sampleData.expenses.expense1.date,
      fund_uuid: fund.get('uuid'),
    });

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, deposit, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    const trackDeletedAt = _.find(auditChanges, (auditChange) => {
      return auditChange.get('table') === 'deposits'
        && auditChange.get('attribute') === 'deleted_at'
        && auditChange.get('key') === deposit.get('uuid');
    });
    assert.isOk(trackDeletedAt);
    assert.isNull(trackDeletedAt.get('old_value'));
    assert.isOk(trackDeletedAt.get('new_value'));
    assert.strictEqual(auditChanges.length, 1);

    // Verify that the Deposit is deleted.
    assert.isNull(await models.Deposit.findOne({
      where: {
        uuid: deposit.get('uuid'),
      },
    }));
    assert.isOk(await models.Deposit.findOne({
      paranoid: false,
      where: {
        uuid: deposit.get('uuid'),
      },
    }));
  });

  it('should track deleting an Expense', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    const category = await models.Category.create({
      household_uuid: household.get('uuid'),
      name: sampleData.categories.category1.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category2.name,
    });
    const vendor = await models.Vendor.create({
      household_uuid: household.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });
    const householdMember = await models.HouseholdMember.create({
      household_uuid: household.get('uuid'),
      name: sampleData.users.user1.firstName,
    });
    const auditLog = await models.Audit.Log.create();
    const expense = await models.Expense.create({
      amount_cents: sampleData.expenses.expense1.amount_cents,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      household_member_uuid: householdMember.get('uuid'),
      reimbursed_cents: sampleData.expenses.expense1.reimbursed_cents,
      subcategory_uuid: subcategory.get('uuid'),
      vendor_uuid: vendor.get('uuid'),
    });

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, expense, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    const trackDeletedAt = _.find(auditChanges, (auditChange) => {
      return auditChange.get('table') === 'expenses'
        && auditChange.get('attribute') === 'deleted_at'
        && auditChange.get('key') === expense.get('uuid');
    });
    assert.isOk(trackDeletedAt);
    assert.isNull(trackDeletedAt.get('old_value'));
    assert.isOk(trackDeletedAt.get('new_value'));
    assert.strictEqual(auditChanges.length, 1);

    // Verify that the Expense is deleted.
    assert.isNull(await models.Expense.findOne({
      where: {
        uuid: expense.get('uuid'),
      },
    }));
    assert.isOk(await models.Expense.findOne({
      paranoid: false,
      where: {
        uuid: expense.get('uuid'),
      },
    }));
  });

  it('should track deleting a Fund', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    const auditLog = await models.Audit.Log.create();
    const fund = await models.Fund.create({
      household_uuid: household.get('uuid'),
      name: sampleData.categories.category1.name,
    });

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, fund, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    const trackDeletedAt = _.find(auditChanges, (auditChange) => {
      return auditChange.get('table') === 'funds'
        && auditChange.get('attribute') === 'deleted_at'
        && auditChange.get('key') === fund.get('uuid');
    });
    assert.isOk(trackDeletedAt);
    assert.isNull(trackDeletedAt.get('old_value'));
    assert.isOk(trackDeletedAt.get('new_value'));
    assert.strictEqual(auditChanges.length, 1);

    // Verify that the Fund is deleted.
    assert.isNull(await models.Fund.findOne({
      where: {
        uuid: fund.get('uuid'),
      },
    }));
    assert.isOk(await models.Fund.findOne({
      paranoid: false,
      where: {
        uuid: fund.get('uuid'),
      },
    }));
  });

  it('should track deleting a Household', async function() {
    const auditLog = await models.Audit.Log.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, household, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    const trackDeletedAt = _.find(auditChanges, (auditChange) => {
      return auditChange.get('table') === 'households'
        && auditChange.get('attribute') === 'deleted_at'
        && auditChange.get('key') === household.get('uuid');
    });
    assert.isOk(trackDeletedAt);
    assert.isNull(trackDeletedAt.get('old_value'));
    assert.isOk(trackDeletedAt.get('new_value'));
    assert.strictEqual(auditChanges.length, 1);

    // Verify that the Household is deleted.
    assert.isNull(await models.Household.findOne({
      where: {
        uuid: household.get('uuid'),
      },
    }));
    assert.isOk(await models.Household.findOne({
      paranoid: false,
      where: {
        uuid: household.get('uuid'),
      },
    }));
  });

  it('should track deleting a HouseholdMember', async function() {
    const auditLog = await models.Audit.Log.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    const householdMember = await models.HouseholdMember.create({
      household_uuid: household.get('uuid'),
      name: sampleData.users.user1.firstName,
    });

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, householdMember, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    const trackDeletedAt = _.find(auditChanges, (auditChange) => {
      return auditChange.get('table') === 'household_members'
        && auditChange.get('attribute') === 'deleted_at'
        && auditChange.get('key') === householdMember.get('uuid');
    });
    assert.isOk(trackDeletedAt);
    assert.isNull(trackDeletedAt.get('old_value'));
    assert.isOk(trackDeletedAt.get('new_value'));
    assert.strictEqual(auditChanges.length, 1);

    // Verify that the Vendor is deleted.
    assert.isNull(await models.HouseholdMember.findOne({
      where: {
        uuid: householdMember.get('uuid'),
      },
    }));
    assert.isOk(await models.HouseholdMember.findOne({
      paranoid: false,
      where: {
        uuid: householdMember.get('uuid'),
      },
    }));
  });

  it('should track deleting a Subcategory', async function() {
    const auditLog = await models.Audit.Log.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    const category = await models.Category.create({
      household_uuid: household.get('uuid'),
      name: sampleData.categories.category1.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category2.name,
    });

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, subcategory, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    const trackDeletedAt = _.find(auditChanges, (auditChange) => {
      return auditChange.get('table') === 'subcategories'
        && auditChange.get('attribute') === 'deleted_at'
        && auditChange.get('key') === subcategory.get('uuid');
    });
    assert.isOk(trackDeletedAt);
    assert.isNull(trackDeletedAt.get('old_value'));
    assert.isOk(trackDeletedAt.get('new_value'));
    assert.strictEqual(auditChanges.length, 1);

    // Verify that the Subcategory is deleted.
    assert.isNull(await models.Subcategory.findOne({
      where: {
        uuid: subcategory.get('uuid'),
      },
    }));
    assert.isOk(await models.Subcategory.findOne({
      paranoid: false,
      where: {
        uuid: subcategory.get('uuid'),
      },
    }));
  });

  it('should track deleting a User', async function() {
    const auditLog = await models.Audit.Log.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    const user = await models.User.create({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, user, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    const trackDeletedAt = _.find(auditChanges, (auditChange) => {
      return auditChange.get('table') === 'users'
        && auditChange.get('attribute') === 'deleted_at'
        && auditChange.get('key') === user.get('uuid');
    });
    assert.isOk(trackDeletedAt);
    assert.isNull(trackDeletedAt.get('old_value'));
    assert.isOk(trackDeletedAt.get('new_value'));
    assert.strictEqual(auditChanges.length, 1);

    // Verify that the User is deleted.
    assert.isNull(await models.User.findOne({
      where: {
        uuid: user.get('uuid'),
      },
    }));
    assert.isOk(await models.User.findOne({
      paranoid: false,
      where: {
        uuid: user.get('uuid'),
      },
    }));
  });

  it('should not delete a UserLogin', async function() {
    const auditLog = await models.Audit.Log.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    const user = await models.User.create({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });
    const userLogin = await models.UserLogin.create({
      h2: crypto.randomBytes(96).toString('base64'),
      s1: crypto.randomBytes(48).toString('base64'),
      user_uuid: user.get('uuid'),
    });

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, userLogin, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    assert.strictEqual(auditChanges.length, 0);

    // Verify that the UserLogin is not deleted.
    assert.isOk(await models.UserLogin.findOne({
      where: {
        user_uuid: user.get('uuid'),
      },
    }));
  });

  it('should track deleting a Vendor', async function() {
    const auditLog = await models.Audit.Log.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    const vendor = await models.Vendor.create({
      household_uuid: household.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, vendor, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    const trackDeletedAt = _.find(auditChanges, (auditChange) => {
      return auditChange.get('table') === 'vendors'
        && auditChange.get('attribute') === 'deleted_at'
        && auditChange.get('key') === vendor.get('uuid');
    });
    assert.isOk(trackDeletedAt);
    assert.isNull(trackDeletedAt.get('old_value'));
    assert.isOk(trackDeletedAt.get('new_value'));
    assert.strictEqual(auditChanges.length, 1);

    // Verify that the Vendor is deleted.
    assert.isNull(await models.Vendor.findOne({
      where: {
        uuid: vendor.get('uuid'),
      },
    }));
    assert.isOk(await models.Vendor.findOne({
      paranoid: false,
      where: {
        uuid: vendor.get('uuid'),
      },
    }));
  });
});
