const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { FundError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - FundCtrl.updateDeposit', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1DepositUuid;
  let user1Fund1Uuid;
  let user1Fund2Uuid;
  let user1HouseholdUuid;
  let user1Uuid;
  let user2Fund1Uuid;
  let user2Fund2Uuid;
  let user2HouseholdUuid;
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

  beforeEach('create user 1 fund 1', async function() {
    const fund = await models.Fund.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    user1Fund1Uuid = fund.get('uuid');
  });

  beforeEach('create user 1 fund 2', async function() {
    const fund = await models.Fund.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category2.name,
    });
    user1Fund2Uuid = fund.get('uuid');
  });

  beforeEach('create user 1 deposit', async function() {
    const deposit = await models.Deposit.create({
      amount_cents: sampleData.expenses.expense1.amount_cents,
      date: sampleData.expenses.expense1.date,
      fund_uuid: user1Fund1Uuid,
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

  beforeEach('create user 2 fund 1', async function() {
    const fund = await models.Fund.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category3.name,
    });
    user2Fund1Uuid = fund.get('uuid');
  });

  beforeEach('create user 2 fund 2', async function() {
    const fund = await models.Fund.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category4.name,
    });
    user2Fund2Uuid = fund.get('uuid');
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
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        depositUuid: null,
        fundUuid: user1Fund2Uuid,
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

  it('should reject with no fund UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        depositUuid: user1DepositUuid,
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
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: null,
        depositUuid: user1DepositUuid,
        fundUuid: user1Fund2Uuid,
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
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: 'Invalid date',
        depositUuid: user1DepositUuid,
        fundUuid: user1Fund2Uuid,
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
      await controllers.FundCtrl.updateDeposit({
        amount: null,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        depositUuid: user1DepositUuid,
        fundUuid: user1Fund2Uuid,
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
      await controllers.FundCtrl.updateDeposit({
        amount: 'invalid amount',
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        depositUuid: user1DepositUuid,
        fundUuid: user1Fund2Uuid,
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
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: null,
        date: sampleData.expenses.expense2.date,
        depositUuid: user1DepositUuid,
        fundUuid: user1Fund2Uuid,
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
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: uuidv4(),
        date: sampleData.expenses.expense2.date,
        depositUuid: user1DepositUuid,
        fundUuid: user1Fund2Uuid,
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
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        depositUuid: user1DepositUuid,
        fundUuid: user1Fund2Uuid,
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
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        depositUuid: uuidv4(),
        fundUuid: user1Fund2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Deposit not found');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the deposit belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        depositUuid: user1DepositUuid,
        fundUuid: user1Fund2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Deposit not found');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  // This should not happen.
  it('should reject when the deposit fund belongs to a different household', async function() {
    try {
      await models.Deposit.update({
        fund_uuid: user2Fund1Uuid,
      }, {
        where: {
          uuid: user1DepositUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        depositUuid: user1DepositUuid,
        fundUuid: user1Fund2Uuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Deposit not found');
      assert.isTrue(err instanceof FundError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.FundCtrl.updateDeposit({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      depositUuid: user1DepositUuid,
      fundUuid: user1Fund1Uuid,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the amount', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.FundCtrl.updateDeposit({
      amount: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      depositUuid: user1DepositUuid,
      fundUuid: user1Fund1Uuid,
    });

    // Verify the Deposit instance.
    const deposit = await models.Deposit.findOne({
      attributes: [
        'amount_cents',
        'date',
        'fund_uuid',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Fund,
        required: true,
      }],
      where: {
        uuid: user1DepositUuid,
      },
    });
    assert.isOk(deposit);
    assert.strictEqual(deposit.get('amount_cents'), sampleData.expenses.expense2.amount_cents);
    assert.strictEqual(deposit.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(deposit.get('fund_uuid'), user1Fund1Uuid);
    assert.strictEqual(deposit.Fund.get('uuid'), user1Fund1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateDeposit = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Deposit
        && updateInstance.get('uuid') === user1DepositUuid;
    });
    assert.isOk(updateDeposit);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating the date', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.FundCtrl.updateDeposit({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense2.date,
      depositUuid: user1DepositUuid,
      fundUuid: user1Fund1Uuid,
    });

    // Verify the Deposit instance.
    const deposit = await models.Deposit.findOne({
      attributes: [
        'amount_cents',
        'date',
        'fund_uuid',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Fund,
        required: true,
      }],
      where: {
        uuid: user1DepositUuid,
      },
    });
    assert.isOk(deposit);
    assert.strictEqual(deposit.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(deposit.get('date'), sampleData.expenses.expense2.date);
    assert.strictEqual(deposit.get('fund_uuid'), user1Fund1Uuid);
    assert.strictEqual(deposit.Fund.get('uuid'), user1Fund1Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateDeposit = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Deposit
        && updateInstance.get('uuid') === user1DepositUuid;
    });
    assert.isOk(updateDeposit);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should reject updating the fund when it does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        depositUuid: user1DepositUuid,
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

  it('should reject updating the fund when it belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.updateDeposit({
        amount: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        depositUuid: user1DepositUuid,
        fundUuid: user2Fund2Uuid,
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

  it('should resolve updating the fund', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.FundCtrl.updateDeposit({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      depositUuid: user1DepositUuid,
      fundUuid: user1Fund2Uuid,
    });

    // Verify the Deposit instance.
    const deposit = await models.Deposit.findOne({
      attributes: [
        'amount_cents',
        'date',
        'fund_uuid',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Fund,
        required: true,
      }],
      where: {
        uuid: user1DepositUuid,
      },
    });
    assert.isOk(deposit);
    assert.strictEqual(deposit.get('amount_cents'), sampleData.expenses.expense1.amount_cents);
    assert.strictEqual(deposit.get('date'), sampleData.expenses.expense1.date);
    assert.strictEqual(deposit.get('fund_uuid'), user1Fund2Uuid);
    assert.strictEqual(deposit.Fund.get('uuid'), user1Fund2Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateDeposit = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Deposit
        && updateInstance.get('uuid') === user1DepositUuid;
    });
    assert.isOk(updateDeposit);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  it('should resolve updating all attributes', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.FundCtrl.updateDeposit({
      amount: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense2.date,
      depositUuid: user1DepositUuid,
      fundUuid: user1Fund2Uuid,
    });

    // Verify the Deposit instance.
    const deposit = await models.Deposit.findOne({
      attributes: [
        'amount_cents',
        'date',
        'fund_uuid',
        'uuid',
      ],
      include: [{
        attributes: ['uuid'],
        model: models.Fund,
        required: true,
      }],
      where: {
        uuid: user1DepositUuid,
      },
    });
    assert.isOk(deposit);
    assert.strictEqual(deposit.get('amount_cents'), sampleData.expenses.expense2.amount_cents);
    assert.strictEqual(deposit.get('date'), sampleData.expenses.expense2.date);
    assert.strictEqual(deposit.get('fund_uuid'), user1Fund2Uuid);
    assert.strictEqual(deposit.Fund.get('uuid'), user1Fund2Uuid);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateDeposit = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Deposit
        && updateInstance.get('uuid') === user1DepositUuid;
    });
    assert.isOk(updateDeposit);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });
});
