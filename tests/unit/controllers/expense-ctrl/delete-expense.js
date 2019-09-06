const chai = require('chai');
const sinon = require('sinon');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');
const { ExpenseError } = require('../../../../app/middleware/error-handler/');

const assert = chai.assert;

describe('Unit:Controllers - ExpenseCtrl.deleteExpense', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let expenseUuid;
  let user1CategoryUuid;
  let user1HouseholdUuid;
  let user1Uuid;
  let user1VendorUuid;
  let user2CategoryUuid;
  let user2HouseholdUuid;
  let user2Uuid;
  let user2VendorUuid;

  before('get app', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
  });

  before('create sinon spies', function() {
    trackChangesSpy = sinon.spy(controllers.AuditCtrl, 'trackChanges');
  });

  after('restore sinon spies', function() {
    trackChangesSpy.restore();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  beforeEach('create user 1', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    user1HouseholdUuid = household.get('uuid');
    const user = await models.User.create({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });
    user1Uuid = user.get('uuid');
  });

  beforeEach('create user 1 category', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    user1CategoryUuid = category.get('uuid');
  });

  beforeEach('create user 1 vendor', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.vendors.vendor1.name,
    });
    user1VendorUuid = vendor.get('uuid');
  });

  beforeEach('create user 2', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user2.lastName,
    });
    user2HouseholdUuid = household.get('uuid');
    const user = await models.User.create({
      email: sampleData.users.user2.email,
      first_name: sampleData.users.user2.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user2.lastName,
    });
    user2Uuid = user.get('uuid');
  });

  beforeEach('create user 2 category', async function() {
    const category = await models.Category.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category2.name,
    });
    user2CategoryUuid = category.get('uuid');
  });

  beforeEach('create user 2 vendor', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.vendors.vendor2.name,
    });
    user2VendorUuid = vendor.get('uuid');
  });

  beforeEach('create expense', async function() {
    const expense = await models.Expense.create({
      amount_cents: sampleData.expenses.expense1.amount_cents,
      category_uuid: user1CategoryUuid,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      reimbursed_cents: sampleData.expenses.expense1.reimbursed_cents,
      vendor_uuid: user1VendorUuid,
    });
    expenseUuid = expense.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject with no expense UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: null,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Expense is required.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: null,
        expenseUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Unauthorized');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: uuidv4(),
        expenseUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Unauthorized');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the user does not exist', async function() {
    try {
      await models.User.destroy({
        where: {
          uuid: user1Uuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Unauthorized');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the expense does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid: uuidv4(),
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the expense belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the expense category belongs to a different household', async function() {
    try {
      await models.Expense.update({
        category_uuid: user2CategoryUuid,
      }, {
        where: {
          uuid: expenseUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the expense vendor belongs to a different household', async function() {
    try {
      await models.Expense.update({
        vendor_uuid: user2VendorUuid,
      }, {
        where: {
          uuid: expenseUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: apiCall.get('uuid'),
        expenseUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve when the expense belongs to the user\'s household', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.deleteExpense({
      auditApiCallUuid: apiCall.get('uuid'),
      expenseUuid,
    });

    // Verify that the Expense instance is deleted.
    const expense = await models.Expense.findOne({
      attributes: ['uuid'],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isNull(expense);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isOk(trackChangesParams.deleteList);
    const deleteCategory = _.find(trackChangesParams.deleteList, (deleteInstance) => {
      return deleteInstance instanceof models.Expense
        && deleteInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(deleteCategory);
    assert.strictEqual(trackChangesParams.deleteList.length, 1);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });
});
