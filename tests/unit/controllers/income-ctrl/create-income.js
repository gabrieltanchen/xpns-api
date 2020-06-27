const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const { IncomeError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - IncomeCtrl.createIncome', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdMemberUuid;
  let user1HouseholdUuid;
  let user1Uuid;
  let user2HouseholdMemberUuid;
  let user2HouseholdUuid;

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

  it('should reject with no household member UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        householdMemberUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member is required');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: null,
        description: sampleData.incomes.income1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: 'invalid date',
        description: sampleData.incomes.income1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: null,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: 'invalid amount',
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no description', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: null,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid description');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid description', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: 1234,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid description');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: null,
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: uuidv4(),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof IncomeError);
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
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the household member does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        householdMemberUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member not found');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the household member belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.incomes.income1.date,
        description: sampleData.incomes.income1.description,
        householdMemberUuid: user2HouseholdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member not found');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve creating an income', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const incomeUuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income1.date,
      description: sampleData.incomes.income1.description,
      householdMemberUuid: user1HouseholdMemberUuid,
    });

    assert.isOk(incomeUuid);

    // Verify the Income instance.
    const income = await models.Income.findOne({
      attributes: [
        'amount_cents',
        'description',
        'household_member_uuid',
        'uuid',
      ],
      where: {
        uuid: incomeUuid,
      },
    });
    assert.isOk(income);
    assert.strictEqual(income.get('amount_cents'), sampleData.incomes.income1.amount_cents);
    assert.strictEqual(income.get('description'), sampleData.incomes.income1.description);
    assert.strictEqual(income.get('household_member_uuid'), user1HouseholdMemberUuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isOk(trackChangesParams.newList);
    const newExpense = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.Income
        && newInstance.get('uuid') === income.get('uuid');
    });
    assert.isOk(newExpense);
    assert.strictEqual(trackChangesParams.newList.length, 1);
    assert.isOk(trackChangesParams.transaction);
  });
});
