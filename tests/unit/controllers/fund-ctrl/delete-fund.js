const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { FundError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - FundCtrl.deleteFund', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let fundUuid;
  let user1HouseholdUuid;
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

  beforeEach('create fund', async function() {
    const fund = await models.Fund.create({
      amount_cents: 0,
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    fundUuid = fund.get('uuid');
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
      await controllers.FundCtrl.deleteFund({
        auditApiCallUuid: apiCall.get('uuid'),
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

  it('should reject with no audit API call', async function() {
    try {
      await controllers.FundCtrl.deleteFund({
        auditApiCallUuid: null,
        fundUuid,
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
      await controllers.FundCtrl.deleteFund({
        auditApiCallUuid: uuidv4(),
        fundUuid,
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
      await controllers.FundCtrl.deleteFund({
        auditApiCallUuid: apiCall.get('uuid'),
        fundUuid,
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
      await controllers.FundCtrl.deleteFund({
        auditApiCallUuid: apiCall.get('uuid'),
        fundUuid: uuidv4(),
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

  it('should reject when the fund belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.FundCtrl.deleteFund({
        auditApiCallUuid: apiCall.get('uuid'),
        fundUuid,
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

  it('should resolve with no child deposits or expenses', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.FundCtrl.deleteFund({
      auditApiCallUuid: apiCall.get('uuid'),
      fundUuid,
    });

    // Verify that the Fund instance is deleted.
    const fund = await models.Fund.findOne({
      attributes: ['uuid'],
      where: {
        uuid: fundUuid,
      },
    });
    assert.isNull(fund);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isOk(trackChangesParams.deleteList);
    const deleteFund = _.find(trackChangesParams.deleteList, (deleteInstance) => {
      return deleteInstance instanceof models.Fund
        && deleteInstance.get('uuid') === fundUuid;
    });
    assert.isOk(deleteFund);
    assert.strictEqual(trackChangesParams.deleteList.length, 1);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  describe('when the fund has a deposit', function() {
    let depositUuid;

    beforeEach('create child deposit', async function() {
      const deposit = await models.Deposit.create({
        amount_cents: sampleData.expenses.expense1.amount_cents,
        date: sampleData.expenses.expense1.date,
        fund_uuid: fundUuid,
      });
      depositUuid = deposit.get('uuid');
    });

    it('should reject when deleting the fund', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.FundCtrl.deleteFund({
          auditApiCallUuid: apiCall.get('uuid'),
          fundUuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Cannot delete with deposits');
        assert.isTrue(err instanceof FundError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should resolve when the deposit is deleted', async function() {
      await models.Deposit.destroy({
        where: {
          uuid: depositUuid,
        },
      });

      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.deleteFund({
        auditApiCallUuid: apiCall.get('uuid'),
        fundUuid,
      });

      // Verify that the Fund instance is deleted.
      const fund = await models.Fund.findOne({
        attributes: ['uuid'],
        where: {
          uuid: fundUuid,
        },
      });
      assert.isNull(fund);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isNotOk(trackChangesParams.changeList);
      assert.isOk(trackChangesParams.deleteList);
      const deleteFund = _.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Fund
          && deleteInstance.get('uuid') === fundUuid;
      });
      assert.isOk(deleteFund);
      assert.strictEqual(trackChangesParams.deleteList.length, 1);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });

  describe('when the fund has an expense', function() {
    let expenseUuid;
    let householdMemberUuid;
    let subcategoryUuid;
    let vendorUuid;

    beforeEach('create household member', async function() {
      const householdMember = await models.HouseholdMember.create({
        household_uuid: user1HouseholdUuid,
        name: sampleData.users.user1.firstName,
      });
      householdMemberUuid = householdMember.get('uuid');
    });

    beforeEach('create subcategory', async function() {
      const category = await models.Category.create({
        household_uuid: user1HouseholdUuid,
        name: sampleData.categories.category1.name,
      });
      const subcategory = await models.Subcategory.create({
        category_uuid: category.get('uuid'),
        name: sampleData.categories.category2.name,
      });
      subcategoryUuid = subcategory.get('uuid');
    });

    beforeEach('create vendor', async function() {
      const vendor = await models.Vendor.create({
        household_uuid: user1HouseholdUuid,
        name: sampleData.vendors.vendor1.name,
      });
      vendorUuid = vendor.get('uuid');
    });

    beforeEach('create child expense', async function() {
      const expense = await models.Expense.create({
        amount_cents: sampleData.expenses.expense1.amount_cents,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        fund_uuid: fundUuid,
        household_member_uuid: householdMemberUuid,
        reimbursed_cents: sampleData.expenses.expense1.reimbursed_cents,
        subcategory_uuid: subcategoryUuid,
        vendor_uuid: vendorUuid,
      });
      expenseUuid = expense.get('uuid');
    });

    it('should reject when the deleting the fund', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.FundCtrl.deleteFund({
          auditApiCallUuid: apiCall.get('uuid'),
          fundUuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Cannot delete with expenses');
        assert.isTrue(err instanceof FundError);
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should resolve when the expense is deleted', async function() {
      await models.Expense.destroy({
        where: {
          uuid: expenseUuid,
        },
      });

      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.FundCtrl.deleteFund({
        auditApiCallUuid: apiCall.get('uuid'),
        fundUuid,
      });

      // Verify that the Fund instance is deleted.
      const fund = await models.Fund.findOne({
        attributes: ['uuid'],
        where: {
          uuid: fundUuid,
        },
      });
      assert.isNull(fund);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isNotOk(trackChangesParams.changeList);
      assert.isOk(trackChangesParams.deleteList);
      const deleteFund = _.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.Fund
          && deleteInstance.get('uuid') === fundUuid;
      });
      assert.isOk(deleteFund);
      assert.strictEqual(trackChangesParams.deleteList.length, 1);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });
});
