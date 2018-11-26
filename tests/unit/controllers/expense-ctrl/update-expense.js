const chai = require('chai');
const sinon = require('sinon');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;

describe('Unit:Controllers - ExpenseCtrl.updateExpense', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let expenseUuid;
  let user1Category1Uuid;
  let user1Category2Uuid;
  let user1HouseholdUuid;
  let user1Uuid;
  let user1Vendor1Uuid;
  let user1Vendor2Uuid;
  let user2Category1Uuid;
  let user2Category2Uuid;
  let user2HouseholdUuid;
  let user2Uuid;
  let user2Vendor1Uuid;
  let user2Vendor2Uuid;

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

  beforeEach('create user 1 category 1', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    user1Category1Uuid = category.get('uuid');
  });

  beforeEach('create user 1 category 2', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category2.name,
    });
    user1Category2Uuid = category.get('uuid');
  });

  beforeEach('create user 1 vendor 1', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.vendors.vendor1.name,
    });
    user1Vendor1Uuid = vendor.get('uuid');
  });

  beforeEach('create user 1 vendor 2', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.vendors.vendor2.name,
    });
    user1Vendor2Uuid = vendor.get('uuid');
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

  beforeEach('create user 2 category 1', async function() {
    const category = await models.Category.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category3.name,
    });
    user2Category1Uuid = category.get('uuid');
  });

  beforeEach('create user 2 category 2', async function() {
    const category = await models.Category.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category4.name,
    });
    user2Category2Uuid = category.get('uuid');
  });

  beforeEach('create user 2 vendor 1', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.vendors.vendor3.name,
    });
    user2Vendor1Uuid = vendor.get('uuid');
  });

  beforeEach('create user 2 vendor 2', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.vendors.vendor4.name,
    });
    user2Vendor2Uuid = vendor.get('uuid');
  });

  beforeEach('create expense', async function() {
    const expense = await models.Expense.create({
      amount_cents: sampleData.expenses.expense1.amount_cents,
      category_uuid: user1Category1Uuid,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      reimbursed_cents: sampleData.expenses.expense1.reimbursed_cents,
      vendor_uuid: user1Vendor1Uuid,
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
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid: null,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Expense is required.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no category UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: null,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category is required.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no vendor UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: null,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Vendor is required.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: null,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: 'invalid date',
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: null,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: 'invalid amount',
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no reimbursed amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: null,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid reimbursed amount.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid reimbursed amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: 'invalid reimbursed amount',
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid reimbursed amount.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no description', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: null,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid description.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid description', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: 1234,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid description.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: null,
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Unauthorized');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: uuidv4(),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
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
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
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
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid: uuidv4(),
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the expense belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user2Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user2Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the expense category belongs to a different household', async function() {
    try {
      await models.Expense.update({
        category_uuid: user2Category1Uuid,
      }, {
        where: {
          uuid: expenseUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the expense vendor belongs to a different household', async function() {
    try {
      await models.Expense.update({
        vendor_uuid: user2Vendor1Uuid,
      }, {
        where: {
          uuid: expenseUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category2Uuid,
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        vendorUuid: user1Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amountCents: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: user1Category1Uuid,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
      vendorUuid: user1Vendor1Uuid,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the amount', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amountCents: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: user1Category1Uuid,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
      vendorUuid: user1Vendor1Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'category_uuid',
        'date',
        'description',
        'reimbursed_cents',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense2.amount_cents);
    assert.strictEqual(expense.get('category_uuid'), user1Category1Uuid);
    assert.strictEqual(expense.Category.get('uuid'), user1Category1Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the date', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amountCents: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: user1Category1Uuid,
      date: sampleData.expenses.expense2.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
      vendorUuid: user1Vendor1Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'category_uuid',
        'date',
        'description',
        'reimbursed_cents',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('category_uuid'), user1Category1Uuid);
    assert.strictEqual(expense.Category.get('uuid'), user1Category1Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense2.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the description', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amountCents: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: user1Category1Uuid,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense2.description,
      expenseUuid,
      reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
      vendorUuid: user1Vendor1Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'category_uuid',
        'date',
        'description',
        'reimbursed_cents',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('category_uuid'), user1Category1Uuid);
    assert.strictEqual(expense.Category.get('uuid'), user1Category1Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense2.description);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the reimbursed amount', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amountCents: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: user1Category1Uuid,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
      vendorUuid: user1Vendor1Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'category_uuid',
        'date',
        'description',
        'reimbursed_cents',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('category_uuid'), user1Category1Uuid);
    assert.strictEqual(expense.Category.get('uuid'), user1Category1Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense2.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should reject updating the category when the it does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: uuidv4(),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1Vendor1Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject updating the category when the it belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user2Category2Uuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1Vendor1Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the category', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amountCents: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: user1Category2Uuid,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
      vendorUuid: user1Vendor1Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'category_uuid',
        'date',
        'description',
        'reimbursed_cents',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('category_uuid'), user1Category2Uuid);
    assert.strictEqual(expense.Category.get('uuid'), user1Category2Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor1Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should reject updating the vendor when it does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category1Uuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: uuidv4(),
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject updating the vendor when it belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1Category1Uuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        expenseUuid,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user2Vendor2Uuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amountCents: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: user1Category1Uuid,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      expenseUuid,
      reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
      vendorUuid: user1Vendor2Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'category_uuid',
        'date',
        'description',
        'reimbursed_cents',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('category_uuid'), user1Category1Uuid);
    assert.strictEqual(expense.Category.get('uuid'), user1Category1Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor2Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor2Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating all attributes', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.updateExpense({
      amountCents: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: user1Category2Uuid,
      date: sampleData.expenses.expense2.date,
      description: sampleData.expenses.expense2.description,
      expenseUuid,
      reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
      vendorUuid: user1Vendor2Uuid,
    });

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'category_uuid',
        'date',
        'description',
        'reimbursed_cents',
        'uuid',
        'vendor_uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
      }, {
        attributes: ['uuid'],
        model: models.Vendor,
        required: true,
      }],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense2.amount_cents);
    assert.strictEqual(expense.get('category_uuid'), user1Category2Uuid);
    assert.strictEqual(expense.Category.get('uuid'), user1Category2Uuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense2.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense2.description);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense2.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1Vendor2Uuid);
    assert.strictEqual(expense.Vendor.get('uuid'), user1Vendor2Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Expense
        && updateInstance.get('uuid') === expenseUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });
});