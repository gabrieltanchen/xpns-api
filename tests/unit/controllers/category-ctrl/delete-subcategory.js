const chai = require('chai');
const sinon = require('sinon');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');
const { CategoryError } = require('../../../../app/middleware/error-handler/');

const assert = chai.assert;

describe('Unit:Controllers - CategoryCtrl.deleteSubcategory', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1CategoryUuid;
  let user1HouseholdUuid;
  let user1SubcategoryUuid;
  let user1Uuid;
  let user2Uuid;

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

  beforeEach('create user 1 subcategory', async function() {
    const subcategory = await models.Subcategory.create({
      category_uuid: user1CategoryUuid,
      name: sampleData.categories.category2.name,
    });
    user1SubcategoryUuid = subcategory.get('uuid');
  });

  beforeEach('create user 2', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user2.lastName,
    });
    const user = await models.User.create({
      email: sampleData.users.user2.email,
      first_name: sampleData.users.user2.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user2.lastName,
    });
    user2Uuid = user.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject wih no subcategory UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.CategoryCtrl.deleteSubcategory({
        auditApiCallUuid: apiCall.get('uuid'),
        subcategoryUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Subcategory is required');
      assert.isTrue(err instanceof CategoryError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.CategoryCtrl.deleteSubcategory({
        auditApiCallUuid: null,
        subcategoryUuid: user1SubcategoryUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof CategoryError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.CategoryCtrl.deleteSubcategory({
        auditApiCallUuid: uuidv4(),
        subcategoryUuid: user1SubcategoryUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof CategoryError);
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
      await controllers.CategoryCtrl.deleteSubcategory({
        auditApiCallUuid: apiCall.get('uuid'),
        subcategoryUuid: user1SubcategoryUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof CategoryError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the subcategory does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.CategoryCtrl.deleteSubcategory({
        auditApiCallUuid: apiCall.get('uuid'),
        subcategoryUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof CategoryError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the subcategory belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.CategoryCtrl.deleteSubcategory({
        auditApiCallUuid: apiCall.get('uuid'),
        subcategoryUuid: user1SubcategoryUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof CategoryError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve when the subcategory belongs to the user\'s household', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.CategoryCtrl.deleteSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      subcategoryUuid: user1SubcategoryUuid,
    });

    // Verify that the Subcategory instance is deleted.
    const subcategory = await models.Subcategory.findOne({
      attributes: ['uuid'],
      where: {
        uuid: user1SubcategoryUuid,
      },
    });
    assert.isNull(subcategory);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isOk(trackChangesParams.deleteList);
    const deleteCategory = _.find(trackChangesParams.deleteList, (deleteInstance) => {
      return deleteInstance instanceof models.Subcategory
        && deleteInstance.get('uuid') === user1SubcategoryUuid;
    });
    assert.isOk(deleteCategory);
    assert.strictEqual(trackChangesParams.deleteList.length, 1);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  describe('when the subcategory has an expense', function() {
    let householdMemberUuid;
    let expenseUuid;
    let vendorUuid;

    beforeEach('create household member', async function() {
      const householdMember = await models.HouseholdMember.create({
        household_uuid: user1HouseholdUuid,
        name: sampleData.users.user1.firstName,
      });
      householdMemberUuid = householdMember.get('uuid');
    });

    beforeEach('create vendor', async function() {
      const vendor = await models.Vendor.create({
        household_uuid: user1HouseholdUuid,
        name: sampleData.vendors.vendor1.name,
      });
      vendorUuid = vendor.get('uuid');
    });

    beforeEach('create expense', async function() {
      const expense = await models.Expense.create({
        amount_cents: sampleData.expenses.expense1.amount_cents,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        household_member_uuid: householdMemberUuid,
        reimbursed_cents: sampleData.expenses.expense1.reimbursed_cents,
        subcategory_uuid: user1SubcategoryUuid,
        vendor_uuid: vendorUuid,
      });
      expenseUuid = expense.get('uuid');
    });

    it('should reject when deleting the subcategory', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.CategoryCtrl.deleteSubcategory({
          auditApiCallUuid: apiCall.get('uuid'),
          subcategoryUuid: user1SubcategoryUuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Cannot delete with expenses');
        assert.isTrue(err instanceof CategoryError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should resolve if the expense is deleted', async function() {
      await models.Expense.destroy({
        where: {
          uuid: expenseUuid,
        },
      });

      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.CategoryCtrl.deleteSubcategory({
        auditApiCallUuid: apiCall.get('uuid'),
        subcategoryUuid: user1SubcategoryUuid,
      });

      // Verify that the Subcategory instance is deleted.
      const subcategory = await models.Subcategory.findOne({
        attributes: ['uuid'],
        where: {
          uuid: user1SubcategoryUuid,
        },
      });
      assert.isNull(subcategory);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isNotOk(trackChangesParams.changeList);
      assert.isOk(trackChangesParams.deleteList);
      const deleteCategory = _.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Subcategory
          && deleteInstance.get('uuid') === user1SubcategoryUuid;
      });
      assert.isOk(deleteCategory);
      assert.strictEqual(trackChangesParams.deleteList.length, 1);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });

  describe('when the subcategory has a budget', async function() {
    let budgetUuid;

    beforeEach('create budget', async function() {
      const budget = await models.Budget.create({
        budget_cents: sampleData.budgets.budget1.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategory_uuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
      budgetUuid = budget.get('uuid');
    });

    it('should reject when deleting the subcategory', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.CategoryCtrl.deleteSubcategory({
          auditApiCallUuid: apiCall.get('uuid'),
          subcategoryUuid: user1SubcategoryUuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Cannot delete with budgets');
        assert.isTrue(err instanceof CategoryError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should resolve if the budget is deleted', async function() {
      await models.Budget.destroy({
        where: {
          uuid: budgetUuid,
        },
      });

      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.CategoryCtrl.deleteSubcategory({
        auditApiCallUuid: apiCall.get('uuid'),
        subcategoryUuid: user1SubcategoryUuid,
      });

      // Verify that the Subcategory instance is deleted.
      const subcategory = await models.Subcategory.findOne({
        attributes: ['uuid'],
        where: {
          uuid: user1SubcategoryUuid,
        },
      });
      assert.isNull(subcategory);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isNotOk(trackChangesParams.changeList);
      assert.isOk(trackChangesParams.deleteList);
      const deleteCategory = _.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Subcategory
          && deleteInstance.get('uuid') === user1SubcategoryUuid;
      });
      assert.isOk(deleteCategory);
      assert.strictEqual(trackChangesParams.deleteList.length, 1);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });
});
