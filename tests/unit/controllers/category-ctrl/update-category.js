const chai = require('chai');
const sinon = require('sinon');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');
const { CategoryError } = require('../../../../app/middleware/error-handler');

const assert = chai.assert;

describe('Unit:Controllers - CategoryCtrl.updateCategory', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let categoryUuid;
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

  beforeEach('create category', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    categoryUuid = category.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no category UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.CategoryCtrl.updateCategory({
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: null,
        name: sampleData.categories.category2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Category is required');
      assert.isTrue(err instanceof CategoryError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.CategoryCtrl.updateCategory({
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid,
        name: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Name is required');
      assert.isTrue(err instanceof CategoryError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no audit API call', async function() {
    try {
      await controllers.CategoryCtrl.updateCategory({
        auditApiCallUuid: null,
        categoryUuid,
        name: sampleData.categories.category2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof CategoryError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the audit API call does not exist', async function() {
    try {
      await controllers.CategoryCtrl.updateCategory({
        auditApiCallUuid: uuidv4(),
        categoryUuid,
        name: sampleData.categories.category2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Missing audit API call');
      assert.isTrue(err instanceof CategoryError);
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
      await controllers.CategoryCtrl.updateCategory({
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid,
        name: sampleData.categories.category2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit user does not exist');
      assert.isTrue(err instanceof CategoryError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the category does not exist', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.CategoryCtrl.updateCategory({
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid: uuidv4(),
        name: sampleData.categories.category2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof CategoryError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject when the category belongs to a different household', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user2Uuid,
      });
      await controllers.CategoryCtrl.updateCategory({
        auditApiCallUuid: apiCall.get('uuid'),
        categoryUuid,
        name: sampleData.categories.category2.name,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Not found');
      assert.isTrue(err instanceof CategoryError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve with no updates', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.CategoryCtrl.updateCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category1.name,
    });

    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should resolve updating the category name', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.CategoryCtrl.updateCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category2.name,
    });

    // Verify the Category instance.
    const category = await models.Category.findOne({
      attributes: ['household_uuid', 'name', 'uuid'],
      where: {
        uuid: categoryUuid,
      },
    });
    assert.isOk(category);
    assert.strictEqual(category.get('household_uuid'), user1HouseholdUuid);
    assert.strictEqual(category.get('name'), sampleData.categories.category2.name);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isOk(trackChangesParams.changeList);
    const updateCategory = _.find(trackChangesParams.changeList, (updateInstance) => {
      return updateInstance instanceof models.Category
        && updateInstance.get('uuid') === categoryUuid;
    });
    assert.isOk(updateCategory);
    assert.strictEqual(trackChangesParams.changeList.length, 1);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isNotOk(trackChangesParams.newList);
    assert.isOk(trackChangesParams.transaction);
  });
});
