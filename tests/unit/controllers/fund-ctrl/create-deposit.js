const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { FundError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - FundCtrl.createDeposit', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1FundUuid;
  let user1HouseholdUuid;
  let user1Uuid;
  let user2FundUuid;
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

  beforeEach('create user 1 fund', async function() {
    const fund = await models.Fund.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    user1FundUuid = fund.get('uuid');
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

  beforeEach('create user 2 fund', async function() {
    const fund = await models.Fund.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category2.name,
    });
    user2FundUuid = fund.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no fund UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.createDeposit({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        fundUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Fund is required');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.createDeposit({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: null,
        fundUuid: user1FundUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid date', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.createDeposit({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: 'invalid date',
        fundUuid: user1FundUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid date');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.createDeposit({
        amount: null,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        fundUuid: user1FundUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with an invalid amount', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.createDeposit({
        amount: 'invalid amount',
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        fundUuid: user1FundUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Invalid amount');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.FundCtrl.createDeposit({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: null,
        date: sampleData.expenses.expense1.date,
        fundUuid: user1FundUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.FundCtrl.createDeposit({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: uuidv4(),
        date: sampleData.expenses.expense1.date,
        fundUuid: user1FundUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof FundError);
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
      await controllers.FundCtrl.createDeposit({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        fundUuid: user1FundUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the fund does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.createDeposit({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        fundUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Fund not found');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the fund belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.createDeposit({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        fundUuid: user2FundUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Fund not found');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve creating a deposit', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const depositUuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      fundUuid: user1FundUuid,
    });

    assert.isOk(depositUuid);

    // Verify the Deposit instance.
    const deposit = await models.Deposit.findOne({
      attributes: [
        'amount_cents',
        'date',
        'fund_uuid',
        'uuid',
      ],
      where: {
        uuid: depositUuid,
      },
    });
    assert.isOk(deposit);
    assert.strictEqual(deposit.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(deposit.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(deposit.get('fund_uuid'), user1FundUuid);

    // Verify that the Fund balance was updated.

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isOk(trackChangesParams.newList);
    const newDeposit = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.Deposit
        && newInstance.get('uuid') === deposit.get('uuid');
    });
    assert.isOk(newDeposit);
    assert.strictEqual(trackChangesParams.newList.length, 1);
    assert.isOk(trackChangesParams.transaction);
  });
});
