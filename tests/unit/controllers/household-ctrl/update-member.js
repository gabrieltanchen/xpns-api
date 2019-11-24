const chai = require('chai');
const sinon = require('sinon');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');
const { HouseholdError } = require('../../../../app/middleware/error-handler/');

const assert = chai.assert;

describe('Unit:Controllers - HouseholdCtrl.updateMember', function() {
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
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
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
    await testHelper.truncateTables();
  });

  it('should reject with no household member UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.HouseholdCtrl.updateMember({
        auditApiCallUuid: apiCall.get('uuid'),
        householdMemberUuid: null,
        name: sampleData.users.user2.firstName,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member is required');
      assert.isTrue(err instanceof HouseholdError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.HouseholdCtrl.updateMember({
        auditApiCallUuid: apiCall.get('uuid'),
        householdMemberUuid,
        name: null,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Name is required');
      assert.isTrue(err instanceof HouseholdError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.HouseholdCtrl.updateMember({
        auditApiCallUuid: null,
        householdMemberUuid,
        name: sampleData.users.user2.firstName,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof HouseholdError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.HouseholdCtrl.updateMember({
        auditApiCallUuid: uuidv4(),
        householdMemberUuid,
        name: sampleData.users.user2.firstName,
      });
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
      await controllers.HouseholdCtrl.updateMember({
        auditApiCallUuid: apiCall.get('uuid'),
        householdMemberUuid,
        name: sampleData.users.user2.firstName,
      });
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
      await controllers.HouseholdCtrl.updateMember({
        auditApiCallUuid: apiCall.get('uuid'),
        householdMemberUuid: uuidv4(),
        name: sampleData.users.user2.firstName,
      });
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
      await controllers.HouseholdCtrl.updateMember({
        auditApiCallUuid: apiCall.get('uuid'),
        householdMemberUuid,
        name: sampleData.users.user2.firstName,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof HouseholdError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.HouseholdCtrl.updateMember({
      auditApiCallUuid: apiCall.get('uuid'),
      householdMemberUuid,
      name: sampleData.users.user1.firstName,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the household member name', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.HouseholdCtrl.updateMember({
      auditApiCallUuid: apiCall.get('uuid'),
      householdMemberUuid,
      name: sampleData.users.user2.firstName,
    });

    // Verify the HouseholdMember instance.
    const householdMember = await models.HouseholdMember.findOne({
      attributes: ['household_uuid', 'name', 'uuid'],
      where: {
        uuid: householdMemberUuid,
      },
    });
    assert.isOk(householdMember);
    assert.strictEqual(householdMember.get('household_uuid'), user1HouseholdUuid);
    assert.strictEqual(householdMember.get('name'), sampleData.users.user2.firstName);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateVendor = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.HouseholdMember
        && updateInstance.get('uuid') === householdMemberUuid;
    });
    assert.isOk(updateVendor);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });
});
