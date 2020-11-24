const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { BudgetError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - BudgetCtrl.updateBudget', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1BudgetUuid;
  let user1HouseholdUuid;
  let user1Subcategory1Uuid;
  let user1Subcategory2Uuid;
  let user1Uuid;
  let user2HouseholdUuid;
  let user2SubcategoryUuid;
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

  beforeEach('create user 1 subcategory 1', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category2.name,
    });
    user1Subcategory1Uuid = subcategory.get('uuid');
  });

  beforeEach('create user 1 subcategory 2', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category3.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category4.name,
    });
    user1Subcategory2Uuid = subcategory.get('uuid');
  });

  beforeEach('create user 1 budget', async function() {
    const budget = await models.Budget.create({
      amount_cents: sampleData.budgets.budget1.amount_cents,
      month: sampleData.budgets.budget1.month,
      subcategory_uuid: user1Subcategory1Uuid,
      year: sampleData.budgets.budget1.year,
    });
    user1BudgetUuid = budget.get('uuid');
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

  beforeEach('create user 2 subcategory', async function() {
    const category = await models.Category.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category5.name,
    });
    const subcategory = await models.Subcategory.create({
      category_uuid: category.get('uuid'),
      name: sampleData.categories.category6.name,
    });
    user2SubcategoryUuid = subcategory.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no budget UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: null,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Budget is required');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no subcategory UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: null,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 'invalid year',
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 1999,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2051,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: null,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: 'invalid month',
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: -1,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: 12,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid month');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.updateBudget({
        amount: null,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid budget');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.updateBudget({
        amount: 'invalid amount',
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid budget');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: null,
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: uuidv4(),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
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
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the budget does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: uuidv4(),
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the budget belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the budget subcategory belongs to a different household', async function() {
    try {
      await models.Budget.update({
        subcategory_uuid: user2SubcategoryUuid,
      }, {
        where: {
          uuid: user1BudgetUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.updateBudget({
      amount: sampleData.budgets.budget1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      budgetUuid: user1BudgetUuid,
      month: sampleData.budgets.budget1.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: sampleData.budgets.budget1.year,
    });
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the amount', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.updateBudget({
      amount: sampleData.budgets.budget2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      budgetUuid: user1BudgetUuid,
      month: sampleData.budgets.budget1.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: sampleData.budgets.budget1.year,
    });

    // Verify the Budget insnace.
    const budget = await models.Budget.findOne({
      attributes: [
        'amount_cents',
        'month',
        'subcategory_uuid',
        'uuid',
        'year',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }],
      where: {
        uuid: user1BudgetUuid,
      },
    });
    assert.isOk(budget);
    assert.strictEqual(budget.get('amount_cents'), sampleData.budgets.budget2.amount_cents);
    assert.strictEqual(budget.get('month'), sampleData.budgets.budget1.month);
    assert.strictEqual(budget.get('subcategory_uuid'), user1Subcategory1Uuid);
    assert.strictEqual(budget.Subcategory.get('uuid'), user1Subcategory1Uuid);
    assert.strictEqual(budget.get('year'), sampleData.budgets.budget1.year);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Budget
        && updateInstance.get('uuid') === user1BudgetUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the month', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.updateBudget({
      amount: sampleData.budgets.budget1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      budgetUuid: user1BudgetUuid,
      month: sampleData.budgets.budget2.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: sampleData.budgets.budget1.year,
    });

    // Verify the Budget insnace.
    const budget = await models.Budget.findOne({
      attributes: [
        'amount_cents',
        'month',
        'subcategory_uuid',
        'uuid',
        'year',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }],
      where: {
        uuid: user1BudgetUuid,
      },
    });
    assert.isOk(budget);
    assert.strictEqual(budget.get('amount_cents'), sampleData.budgets.budget1.amount_cents);
    assert.strictEqual(budget.get('month'), sampleData.budgets.budget2.month);
    assert.strictEqual(budget.get('subcategory_uuid'), user1Subcategory1Uuid);
    assert.strictEqual(budget.Subcategory.get('uuid'), user1Subcategory1Uuid);
    assert.strictEqual(budget.get('year'), sampleData.budgets.budget1.year);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Budget
        && updateInstance.get('uuid') === user1BudgetUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the year', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.updateBudget({
      amount: sampleData.budgets.budget1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      budgetUuid: user1BudgetUuid,
      month: sampleData.budgets.budget1.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: sampleData.budgets.budget2.year,
    });

    // Verify the Budget insnace.
    const budget = await models.Budget.findOne({
      attributes: [
        'amount_cents',
        'month',
        'subcategory_uuid',
        'uuid',
        'year',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }],
      where: {
        uuid: user1BudgetUuid,
      },
    });
    assert.isOk(budget);
    assert.strictEqual(budget.get('amount_cents'), sampleData.budgets.budget1.amount_cents);
    assert.strictEqual(budget.get('month'), sampleData.budgets.budget1.month);
    assert.strictEqual(budget.get('subcategory_uuid'), user1Subcategory1Uuid);
    assert.strictEqual(budget.Subcategory.get('uuid'), user1Subcategory1Uuid);
    assert.strictEqual(budget.get('year'), sampleData.budgets.budget2.year);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Budget
        && updateInstance.get('uuid') === user1BudgetUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should reject updating the subcategory when it does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: uuidv4(),
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category not found');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject updating the subcategory when it belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget1.month,
        subcategoryUuid: user2SubcategoryUuid,
        year: sampleData.budgets.budget1.year,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category not found');
      assert.isTrue(err instanceof BudgetError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the subcategory', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.updateBudget({
      amount: sampleData.budgets.budget1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      budgetUuid: user1BudgetUuid,
      month: sampleData.budgets.budget1.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: sampleData.budgets.budget1.year,
    });

    // Verify the Budget insnace.
    const budget = await models.Budget.findOne({
      attributes: [
        'amount_cents',
        'month',
        'subcategory_uuid',
        'uuid',
        'year',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }],
      where: {
        uuid: user1BudgetUuid,
      },
    });
    assert.isOk(budget);
    assert.strictEqual(budget.get('amount_cents'), sampleData.budgets.budget1.amount_cents);
    assert.strictEqual(budget.get('month'), sampleData.budgets.budget1.month);
    assert.strictEqual(budget.get('subcategory_uuid'), user1Subcategory2Uuid);
    assert.strictEqual(budget.Subcategory.get('uuid'), user1Subcategory2Uuid);
    assert.strictEqual(budget.get('year'), sampleData.budgets.budget1.year);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Budget
        && updateInstance.get('uuid') === user1BudgetUuid;
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
    await controllers.BudgetCtrl.updateBudget({
      amount: sampleData.budgets.budget2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      budgetUuid: user1BudgetUuid,
      month: sampleData.budgets.budget2.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: sampleData.budgets.budget2.year,
    });

    // Verify the Budget insnace.
    const budget = await models.Budget.findOne({
      attributes: [
        'amount_cents',
        'month',
        'subcategory_uuid',
        'uuid',
        'year',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Subcategory,
        required: true,
      }],
      where: {
        uuid: user1BudgetUuid,
      },
    });
    assert.isOk(budget);
    assert.strictEqual(budget.get('amount_cents'), sampleData.budgets.budget2.amount_cents);
    assert.strictEqual(budget.get('month'), sampleData.budgets.budget2.month);
    assert.strictEqual(budget.get('subcategory_uuid'), user1Subcategory2Uuid);
    assert.strictEqual(budget.Subcategory.get('uuid'), user1Subcategory2Uuid);
    assert.strictEqual(budget.get('year'), sampleData.budgets.budget2.year);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateExpense = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Budget
        && updateInstance.get('uuid') === user1BudgetUuid;
    });
    assert.isOk(updateExpense);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should reject updating a budget with a duplicate month, year and subcategory', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget2.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: sampleData.budgets.budget2.year,
    });
    try {
      await controllers.BudgetCtrl.updateBudget({
        amount: sampleData.budgets.budget2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        budgetUuid: user1BudgetUuid,
        month: sampleData.budgets.budget2.month,
        subcategoryUuid: user1Subcategory2Uuid,
        year: sampleData.budgets.budget2.year,
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
