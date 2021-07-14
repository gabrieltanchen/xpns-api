const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { FundError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - FundCtrl.deleteDeposit', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1DepositUuid;
  let user1FundUuid;
  let user1HouseholdUuid;
  let user1Uuid;
  let user2FundUuid;
  let user2HouseholdUuid;
  let user2Uuid;

  const FUND_INITIAL_BALANCE = 100000;

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
      balance_cents: FUND_INITIAL_BALANCE,
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    user1FundUuid = fund.get('uuid');
  });

  beforeEach('create user 1 deposit', async function() {
    const deposit = await models.Deposit.create({
      amount_cents: sampleData.deposits.deposit1.amount_cents,
      date: sampleData.deposits.deposit1.date,
      fund_uuid: user1FundUuid,
    });
    user1DepositUuid = deposit.get('uuid');
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

  it('should reject with no deposit UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.deleteDeposit({
        auditApiCallUuid: apiCall.get('uuid'),
        depositUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Deposit is required');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.FundCtrl.deleteDeposit({
        auditApiCallUuid: null,
        depositUuid: user1DepositUuid,
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
      await controllers.FundCtrl.deleteDeposit({
        auditApiCallUuid: uuidv4(),
        depositUuid: user1DepositUuid,
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
      await controllers.FundCtrl.deleteDeposit({
        auditApiCallUuid: apiCall.get('uuid'),
        depositUuid: user1DepositUuid,
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

  it('should reject when the deposit does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.deleteDeposit({
        auditApiCallUuid: apiCall.get('uuid'),
        depositUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the deposit belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.FundCtrl.deleteDeposit({
        auditApiCallUuid: apiCall.get('uuid'),
        depositUuid: user1DepositUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the deposit fund belongs to a different household', async function() {
    try {
      await models.Deposit.update({
        fund_uuid: user2FundUuid,
      }, {
        where: {
          uuid: user1DepositUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.deleteDeposit({
        auditApiCallUuid: apiCall.get('uuid'),
        depositUuid: user1DepositUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve when the deposit belongs to the user\'s household', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.FundCtrl.deleteDeposit({
      auditApiCallUuid: apiCall.get('uuid'),
      depositUuid: user1DepositUuid,
    });

    // Verify that the Deposit instance is deleted.
    const deposit = await models.Deposit.findOne({
      attributes: ['uuid'],
      where: {
        uuid: user1DepositUuid,
      },
    });
    assert.isNull(deposit);

    // Verify that the Fund balance was updated.
    const fund = await models.Fund.findOne({
      attributes: ['balance_cents', 'uuid'],
      where: {
        uuid: user1FundUuid,
      },
    });
    assert.isOk(fund);
    assert.strictEqual(fund.get('balance_cents'), FUND_INITIAL_BALANCE - sampleData.deposits.deposit1.amount_cents);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateFund = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Fund
        && updateInstance.get('uuid') === user1FundUuid;
    });
    assert.isOk(updateFund);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isOk(trackChangesParams.deleteList);
    const deleteDeposit = _.find(trackChangesParams.deleteList, (deleteInstance) => {
      return deleteInstance instanceof models.Deposit
        && deleteInstance.get('uuid') === user1DepositUuid;
    });
    assert.isOk(deleteDeposit);
    assert.strictEqual(trackChangesParams.deleteList.length, 1);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });
});
