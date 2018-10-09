const chai = require('chai');
const sinon = require('sinon');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;

describe('Unit:Controllers - VendorCtrl.createVendor', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let userHouseholdUuid;
  let userUuid;

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

  beforeEach('create user', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    userHouseholdUuid = household.get('uuid');
    const user = await models.User.create({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });
    userUuid = user.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject with no name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: userUuid,
      });
      await controllers.VendorCtrl.createVendor({
        auditApiCallUuid: apiCall.get('uuid'),
        name: null,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Name is required.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.VendorCtrl.createVendor({
        auditApiCallUuid: null,
        name: sampleData.vendors.vendor1.name,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Unauthorized');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.VendorCtrl.createVendor({
        auditApiCallUuid: uuidv4(),
        name: sampleData.vendors.vendor1.name,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Unauthorized');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the user does not exist', async function() {
    try {
      await models.User.destroy({
        where: {
          uuid: userUuid,
        },
      });
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: userUuid,
      });
      await controllers.VendorCtrl.createVendor({
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.vendors.vendor1.name,
      });
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Unauthorized');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve creating a vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    const vendorUuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });

    assert.isOk(vendorUuid);

    // Verify the Vendor instance.
    const vendor = await models.Vendor.findOne({
      attributes: ['household_uuid', 'name', 'uuid'],
      where: {
        uuid: vendorUuid,
      },
    });
    assert.isOk(vendor);
    assert.strictEqual(vendor.get('household_uuid'), userHouseholdUuid);
    assert.strictEqual(vendor.get('name'), sampleData.vendors.vendor1.name);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isOk(trackChangesParams.newList);
    const newVendor = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.Vendor
        && newInstance.get('uuid') === vendor.get('uuid');
    });
    assert.isOk(newVendor);
    assert.strictEqual(trackChangesParams.newList.length, 1);
    assert.isOk(trackChangesParams.transaction);
  });
});
