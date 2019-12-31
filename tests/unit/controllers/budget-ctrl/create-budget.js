const chai = require('chai');
const sinon = require('sinon');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');
const { BudgetError } = require('../../../../app/middleware/error-handler/');

const assert = chai.assert;

describe('Unit:Controllers - BudgetCtrl.createBudget', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

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

  it('should reject with no subcategory UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: null,
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category is required');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no year', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1SubcategoryUuid,
        year: null,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Year is required');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid year (type)', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1SubcategoryUuid,
        year: 'invalid year',
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Year is required');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid year (too small)', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1SubcategoryUuid,
        year: 1999,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid year');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid year (too large)', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1SubcategoryUuid,
        year: 2051,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid year');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no month', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: null,
        subcategoryUuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Month is required');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid month (type)', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: 'invalid month',
        subcategoryUuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Month is required');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid month (too small)', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: -1,
        subcategoryUuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid month');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid month (too large)', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: 12,
        subcategoryUuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid month');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no budget', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: null,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid budget');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid budget', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: 'invalid budgetCents',
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid budget');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: null,
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: uuidv4(),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof BudgetError);
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
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the subcategory does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: uuidv4(),
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category not found');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the subcategory belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget1.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category not found');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve creating a budget', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const budgetUuid = await controllers.BudgetCtrl.createBudget({
      auditApiCallUuid: apiCall.get('uuid'),
      budgetCents: sampleData.budgets.budget1.budget_cents,
      month: sampleData.budgets.budget1.month,
      subcategoryUuid: user1SubcategoryUuid,
      year: sampleData.budgets.budget1.year,
    });

    assert.isOk(budgetUuid);

    // Verify the Budget instance.
    const budget = await models.Budget.findOne({
      attributes: [
        'budget_cents',
        'month',
        'subcategory_uuid',
        'uuid',
        'year',
      ],
      where: {
        uuid: budgetUuid,
      },
    });
    assert.isOk(budget);
    assert.strictEqual(budget.get('budget_cents'), sampleData.budgets.budget1.budget_cents);
    assert.strictEqual(budget.get('month'), sampleData.budgets.budget1.month);
    assert.strictEqual(budget.get('subcategory_uuid'), user1SubcategoryUuid);
    assert.strictEqual(budget.get('year'), sampleData.budgets.budget1.year);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isOk(trackChangesParams.newList);
    const newExpense = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.Budget
        && newInstance.get('uuid') === budget.get('uuid');
    });
    assert.isOk(newExpense);
    assert.strictEqual(trackChangesParams.newList.length, 1);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should reject creating a budget with a duplicate month, year and subcategory', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      auditApiCallUuid: apiCall.get('uuid'),
      budgetCents: sampleData.budgets.budget1.budget_cents,
      month: sampleData.budgets.budget1.month,
      subcategoryUuid: user1SubcategoryUuid,
      year: sampleData.budgets.budget1.year,
    });
    try {
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget2.budget_cents,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Duplicate budget');
      assert.isTrue(err instanceof BudgetError);
    }
  });
});
