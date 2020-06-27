const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const { ExpenseError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - ExpenseCtrl.createExpense', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdMemberUuid;
  let user1HouseholdUuid;
  let user1SubcategoryUuid;
  let user1Uuid;
  let user1VendorUuid;
  let user2HouseholdMemberUuid;
  let user2HouseholdUuid;
  let user2SubcategoryUuid;
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

  beforeEach('create user 1 subcategory', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category2.name,
    });
    user1SubcategoryUuid = subcategory.get('uuid');
  });

  beforeEach('create user 1 vendor', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.vendors.vendor1.name,
    });
    user1VendorUuid = vendor.get('uuid');
  });

  beforeEach('create user 1 household member', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.users.user1.firstName,
    });
    user1HouseholdMemberUuid = householdMember.get('uuid');
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

  beforeEach('create user 2 subcategory', async function() {
    const category = await models.Category.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category3.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category4.name,
    });
    user2SubcategoryUuid = subcategory.get('uuid');
  });

  beforeEach('create user 2 vendor', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.vendors.vendor2.name,
    });
    user2VendorUuid = vendor.get('uuid');
  });

  beforeEach('create user 2 household member', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.users.user2.firstName,
    });
    user2HouseholdMemberUuid = householdMember.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject with no subcategory UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: null,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Vendor is required');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no household member UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: null,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member is required');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: null,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: 'invalid date',
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: null,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: 'invalid amount',
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: null,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: 'invalid reimbursed amount',
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: null,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: 1234,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: null,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: uuidv4(),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the subcategory does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: uuidv4(),
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the subcategory belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user2SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user2VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Vendor not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the household member does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: uuidv4(),
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the household member belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user2HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member not found');
      assert.isTrue(err instanceof ExpenseError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve creating an expense', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const expenseUuid = await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1SubcategoryUuid,
      vendorUuid: user1VendorUuid,
    });

    assert.isOk(expenseUuid);

    // Verify the Expense instance.
    const expense = await models.Expense.findOne({
      attributes: [
        'amount_cents',
        'date',
        'description',
        'household_member_uuid',
        'reimbursed_cents',
        'subcategory_uuid',
        'uuid',
        'vendor_uuid',
      ],
      where: {
        uuid: expenseUuid,
      },
    });
    assert.isOk(expense);
    assert.strictEqual(expense.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(expense.get('subcategory_uuid'), user1SubcategoryUuid);
    assert.strictEqual(expense.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(expense.get('description'), sampleData.expenses.expense1.description);
    assert.strictEqual(expense.get('household_member_uuid'), user1HouseholdMemberUuid);
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
