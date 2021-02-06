const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { HouseholdError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - HouseholdCtrl.deleteMember', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let householdMemberUuid;
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

  beforeEach('create household member', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.users.user1.firstName,
    });
    householdMemberUuid = householdMember.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no household member UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.HouseholdCtrl.deleteMember({
        auditApiCallUuid: apiCall.get('uuid'),
        householdMemberUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member is required');
      assert.isTrue(err instanceof HouseholdError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.HouseholdCtrl.deleteMember({
        auditApiCallUuid: null,
        householdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof HouseholdError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.HouseholdCtrl.deleteMember({
        auditApiCallUuid: uuidv4(),
        householdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof HouseholdError);
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
      await controllers.HouseholdCtrl.deleteMember({
        auditApiCallUuid: apiCall.get('uuid'),
        householdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof HouseholdError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the household member does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.HouseholdCtrl.deleteMember({
        auditApiCallUuid: apiCall.get('uuid'),
        householdMemberUuid: uuidv4(),
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof HouseholdError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the household member belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.HouseholdCtrl.deleteMember({
        auditApiCallUuid: apiCall.get('uuid'),
        householdMemberUuid,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof HouseholdError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve when the household member belongs to the user\'s household', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.HouseholdCtrl.deleteMember({
      auditApiCallUuid: apiCall.get('uuid'),
      householdMemberUuid,
    });

    // Verify that the HouseholdMember instance is deleted.
    const householdMember = await models.HouseholdMember.findOne({
      attributes: ['uuid'],
      where: {
        uuid: householdMemberUuid,
      },
    });
    assert.isNull(householdMember);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isOk(trackChangesParams.deleteList);
    const deleteCategory = _.find(trackChangesParams.deleteList, (deleteInstance) => {
      return deleteInstance instanceof models.HouseholdMember
        && deleteInstance.get('uuid') === householdMemberUuid;
    });
    assert.isOk(deleteCategory);
    assert.strictEqual(trackChangesParams.deleteList.length, 1);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });

  describe('when the household member has an expense', function() {
    let expenseUuid;
    let subcategoryUuid;
    let vendorUuid;

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

    beforeEach('create expense', async function() {
      const expense = await models.Expense.create({
        amount_cents: sampleData.expenses.expense1.amount_cents,
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        household_member_uuid: householdMemberUuid,
        reimbursed_cents: sampleData.expenses.expense1.reimbursed_cents,
        subcategory_uuid: subcategoryUuid,
        vendor_uuid: vendorUuid,
      });
      expenseUuid = expense.get('uuid');
    });

    it('should reject when deleting the household member', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.HouseholdCtrl.deleteMember({
          auditApiCallUuid: apiCall.get('uuid'),
          householdMemberUuid,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'Cannot delete with expenses');
        assert.isTrue(err instanceof HouseholdError);
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
      await controllers.HouseholdCtrl.deleteMember({
        auditApiCallUuid: apiCall.get('uuid'),
        householdMemberUuid,
      });

      // Verify that the HouseholdMember instance is deleted.
      const householdMember = await models.HouseholdMember.findOne({
        attributes: ['uuid'],
        where: {
          uuid: householdMemberUuid,
        },
      });
      assert.isNull(householdMember);

      assert.strictEqual(trackChangesSpy.callCount, 1);
      const trackChangesParams = trackChangesSpy.getCall(0).args[0];
      assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
      assert.isNotOk(trackChangesParams.changeList);
      assert.isOk(trackChangesParams.deleteList);
      const deleteCategory = _.find(trackChangesParams.deleteList, (deleteInstance) => {
        return deleteInstance instanceof models.HouseholdMember
          && deleteInstance.get('uuid') === householdMemberUuid;
      });
      assert.isOk(deleteCategory);
      assert.strictEqual(trackChangesParams.deleteList.length, 1);
      assert.isNotOk(trackChangesParams.newList);
      assert.isOk(trackChangesParams.transaction);
    });
  });
});
