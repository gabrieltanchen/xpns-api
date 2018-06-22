const chai = require('chai');
const crypto = require('crypto');
const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');
const _ = require('lodash');

const assert = chai.assert;

const shouldTrackAttribute = ({
  attribute,
  auditChanges,
  auditLog,
  key,
  table,
  value,
}) => {
  const trackedAttr = _.find(auditChanges, (auditChange) => {
    return auditChange.get('table') === table &&
      auditChange.get('attribute') === attribute &&
      auditChange.get('key') === key;
  });
  assert.isOk(trackedAttr);
  assert.strictEqual(trackedAttr.get('audit_log_uuid'), auditLog.get('uuid'));
  assert.isNull(trackedAttr.get('old_value'));
  assert.strictEqual(trackedAttr.get('new_value'), String(value));
};

describe('Unit:Controllers - AuditCtrl._trackNewInstance', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  before('get app', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject without an audit log', async function() {
    try {
      await models.sequelize.transaction({
        isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
      }, async(transaction) => {
        const household = models.Household.build({
          name: sampleData.users.user1.householdName,
        });
        await controllers.AuditCtrl._trackNewInstance(null, household, transaction);
      });
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit log is required.');
    }
  });

  it('should reject without an instance', async function() {
    try {
      const auditLog = await models.Audit.Log.create();
      await models.sequelize.transaction({
        isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
      }, async(transaction) => {
        await controllers.AuditCtrl._trackNewInstance(auditLog, null, transaction);
      });
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Sequelize instance is required.');
    }
  });

  it('should reject without a Sequelize transaction', async function() {
    try {
      const auditLog = await models.Audit.Log.create();
      const household = await models.Household.build({
        name: sampleData.users.user1.householdName,
      });
      await controllers.AuditCtrl._trackNewInstance(auditLog, household, null);
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Sequelize transaction is required.');
    }
  });

  it('should track all Household attributes', async function() {
    const auditLog = await models.Audit.Log.create();
    const household = models.Household.build({
      name: sampleData.users.user1.householdName,
    });

    await models.sequelize.transaction({
      isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackNewInstance(auditLog, household, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    shouldTrackAttribute({
      attribute: 'name',
      auditChanges,
      auditLog,
      key: household.get('uuid'),
      table: 'households',
      value: sampleData.users.user1.householdName,
    });
    assert.strictEqual(auditChanges.length, 1);
  });

  it('should track all User attributes', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.householdName,
    });
    const auditLog = await models.Audit.Log.create();
    const user = models.User.build({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });

    await models.sequelize.transaction({
      isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackNewInstance(auditLog, user, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    shouldTrackAttribute({
      attribute: 'email',
      auditChanges,
      auditLog,
      key: user.get('uuid'),
      table: 'users',
      value: sampleData.users.user1.email,
    });
    shouldTrackAttribute({
      attribute: 'first_name',
      auditChanges,
      auditLog,
      key: user.get('uuid'),
      table: 'users',
      value: sampleData.users.user1.firstName,
    });
    shouldTrackAttribute({
      attribute: 'household_uuid',
      auditChanges,
      auditLog,
      key: user.get('uuid'),
      table: 'users',
      value: household.get('uuid'),
    });
    shouldTrackAttribute({
      attribute: 'last_name',
      auditChanges,
      auditLog,
      key: user.get('uuid'),
      table: 'users',
      value: sampleData.users.user1.lastName,
    });
    assert.strictEqual(auditChanges.length, 4);
  });

  it('should track all UserLogin attributes', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.householdName,
    });
    const user = await models.User.create({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });
    const auditLog = await models.Audit.Log.create();
    const userLogin = models.UserLogin.build({
      h2: crypto.randomBytes(96).toString('base64'),
      s1: crypto.randomBytes(48).toString('base64'),
      user_uuid: user.get('uuid'),
    });

    await models.sequelize.transaction({
      isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackNewInstance(auditLog, userLogin, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    assert.strictEqual(auditChanges.length, 0);
  });
});
