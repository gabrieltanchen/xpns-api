const chai = require('chai');
const sampleData = require('../../../sample-data/');
const Sequelize = require('sequelize');
const sinon = require('sinon');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;

describe('Unit:Controllers - AuditCtrl.trackChanges', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackInstanceDestroySpy;
  let trackInstanceUpdateSpy;
  let trackNewInstanceSpy;

  before('get app', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
  });

  before('create sinon spies', function() {
    trackInstanceDestroySpy = sinon.spy(controllers.AuditCtrl, '_trackInstanceDestroy');
    trackInstanceUpdateSpy = sinon.spy(controllers.AuditCtrl, '_trackInstanceUpdate');
    trackNewInstanceSpy = sinon.spy(controllers.AuditCtrl, '_trackNewInstance');
  });

  after('restore sinon spies', function() {
    trackInstanceDestroySpy.restore();
    trackInstanceUpdateSpy.restore();
    trackNewInstanceSpy.restore();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  afterEach('reset history for sinon spies', function() {
    trackInstanceDestroySpy.resetHistory();
    trackInstanceUpdateSpy.resetHistory();
    trackNewInstanceSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject without a Sequelize transaction', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create();
      const household = models.Household.build({
        name: sampleData.users.user1.lastName,
      });
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid: apiCall.get('uuid'),
        newList: [household],
        transaction: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Sequelize transaction is required.');
    }
    assert.strictEqual(trackInstanceDestroySpy.callCount, 0);
    assert.strictEqual(trackInstanceUpdateSpy.callCount, 0);
    assert.strictEqual(trackNewInstanceSpy.callCount, 0);
  });

  it('should reject without an API call', async function() {
    try {
      const household = models.Household.build({
        name: sampleData.users.user1.lastName,
      });
      await models.sequelize.transaction({
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
      }, async(transaction) => {
        await controllers.AuditCtrl.trackChanges({
          auditApiCallUuid: null,
          newList: [household],
          transaction,
        });
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'API call is required.');
    }
    assert.strictEqual(trackInstanceDestroySpy.callCount, 0);
    assert.strictEqual(trackInstanceUpdateSpy.callCount, 0);
    assert.strictEqual(trackNewInstanceSpy.callCount, 0);
  });

  it('should call _trackNewInstance with a new instance', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    const household = models.Household.build({
      name: sampleData.users.user1.lastName,
    });
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid: apiCall.get('uuid'),
        newList: [household],
        transaction,
      });
    });

    assert.strictEqual(trackInstanceDestroySpy.callCount, 0);
    assert.strictEqual(trackInstanceUpdateSpy.callCount, 0);
    assert.strictEqual(trackNewInstanceSpy.callCount, 1);

    const newInstanceArgs = trackNewInstanceSpy.getCall(0).args;
    assert.strictEqual(newInstanceArgs.length, 3);
    assert.deepEqual(newInstanceArgs[1], household);
  });

  it('should call _trackInstanceUpdate when updating an instance', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    household.set('name', sampleData.users.user2.lastName);
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid: apiCall.get('uuid'),
        changeList: [household],
        transaction,
      });
    });

    assert.strictEqual(trackInstanceDestroySpy.callCount, 0);
    assert.strictEqual(trackInstanceUpdateSpy.callCount, 1);
    assert.strictEqual(trackNewInstanceSpy.callCount, 0);

    const instanceUpdateArgs = trackInstanceUpdateSpy.getCall(0).args;
    assert.strictEqual(instanceUpdateArgs.length, 3);
    assert.deepEqual(instanceUpdateArgs[1], household);
  });

  it('should call _trackInstanceDestroy when deleting an instance', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });

    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid: apiCall.get('uuid'),
        deleteList: [household],
        transaction,
      });
    });

    assert.strictEqual(trackInstanceDestroySpy.callCount, 1);
    assert.strictEqual(trackInstanceUpdateSpy.callCount, 0);
    assert.strictEqual(trackNewInstanceSpy.callCount, 0);

    const instanceDestroyArgs = trackInstanceDestroySpy.getCall(0).args;
    assert.strictEqual(instanceDestroyArgs.length, 3);
    assert.deepEqual(instanceDestroyArgs[1], household);
  });
});
