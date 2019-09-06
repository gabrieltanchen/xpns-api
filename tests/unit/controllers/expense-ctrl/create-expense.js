const chai = require('chai');
const sinon = require('sinon');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const { ExpenseError } = require('../../../../app/middleware/error-handler/');

const assert = chai.assert;

describe('Unit:Controllers - ExpenseCtrl.createExpense', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1CategoryUuid;
  let user1HouseholdUuid;
  let user1Uuid;
  let user1VendorUuid;
  let user2CategoryUuid;
  let user2HouseholdUuid;
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
    await models.User.create({
      email: sampleData.users.user2.email,
      first_name: sampleData.users.user2.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user2.lastName,
    });
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

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject with no category UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: null,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category is required');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no vendor UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: null,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Vendor is required');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: null,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: 'invalid date',
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: null,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: 'invalid amount',
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no reimbursed amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: null,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid reimbursed amount');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid reimbursed amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: 'invalid reimbursed amount',
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid reimbursed amount');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no description', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: null,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid description');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid description', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: 1234,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid description');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: null,
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: uuidv4(),
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof ExpenseError);
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
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the category does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: uuidv4(),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the category belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user2CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user1VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the vendor does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: uuidv4(),
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Vendor not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the vendor belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: user1CategoryUuid,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        vendorUuid: user2VendorUuid,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Vendor not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve creating an expense', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const expenseUuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: user1CategoryUuid,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
      vendorUuid: user1VendorUuid,
    });

    assert.isOk(expenseUuid);

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
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('category_uuid'), user1CategoryUuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.strictEqual(expense.get('reimbursed_cents'), sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(expense.get('vendor_uuid'), user1VendorUuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isOk(trackChangesParams.newList);
    const newExpense = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.Expense
        && newInstance.get('uuid') === expense.get('uuid');
    });
    assert.isOk(newExpense);
    assert.strictEqual(trackChangesParams.newList.length, 1);
    assert.isOk(trackChangesParams.transaction);
  });
});
