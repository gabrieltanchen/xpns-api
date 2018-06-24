const chai = require('chai');
const crypto = require('crypto');
const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');
const _ = require('lodash');

const assert = chai.assert;

const shouldTrackAttribute = ({
  attribute,
  auditChanges,
  key,
  newValue,
  oldValue,
  table,
}) => {
  const trackedAttr = _.find(auditChanges, (auditChange) => {
    return auditChange.get('table') === table &&
      auditChange.get('attribute') === attribute &&
      auditChange.get('key') === key;
  });
  assert.isOk(trackedAttr);
  assert.strictEqual(trackedAttr.get('old_value'), String(oldValue));
  assert.strictEqual(trackedAttr.get('new_value'), String(newValue));
};

describe('Unit:Controllers - AuditCtrl._trackInstanceUpdate', function() {
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
    const household = await models.Household.create({
      name: sampleData.users.user1.householdName,
    });
    household.set('name', sampleData.users.user2.householdName);
    try {
      await models.sequelize.transaction({
        isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
      }, async(transaction) => {
        await controllers.AuditCtrl._trackInstanceUpdate(null, household, transaction);
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
        await controllers.AuditCtrl._trackInstanceUpdate(auditLog, null, transaction);
      });
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Sequelize instance is required.');
    }
  });

  it('should reject without a Sequelize transaction', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.householdName,
    });
    household.set('name', sampleData.users.user2.householdName);
    try {
      const auditLog = await models.Audit.Log.create();
      await controllers.AuditCtrl._trackInstanceUpdate(auditLog, household, null);
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Sequelize transaction is required.');
    }
  });

  it('should track all Household attributes', async function() {
    const auditLog = await models.Audit.Log.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.householdName,
    });
    household.set('name', sampleData.users.user2.householdName);

    await models.sequelize.transaction({
      isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceUpdate(auditLog, household, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    shouldTrackAttribute({
      attribute: 'name',
      auditChanges,
      key: household.get('uuid'),
      newValue: sampleData.users.user2.householdName,
      oldValue: sampleData.users.user1.householdName,
      table: 'households',
    });
    assert.strictEqual(auditChanges.length, 1);
  });

  it('should track all User attributes', async function() {
    const auditLog = await models.Audit.Log.create();
    const household1 = await models.Household.create({
      name: sampleData.users.user1.householdName,
    });
    const household2 = await models.Household.create({
      name: sampleData.users.user2.householdName,
    });
    const user = await models.User.create({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household1.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });
    user.set('email', sampleData.users.user2.email);
    user.set('first_name', sampleData.users.user2.firstName);
    user.set('household_uuid', household2.get('uuid'));
    user.set('last_name', sampleData.users.user2.lastName);

    await models.sequelize.transaction({
      isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceUpdate(auditLog, user, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    shouldTrackAttribute({
      attribute: 'email',
      auditChanges,
      key: user.get('uuid'),
      newValue: sampleData.users.user2.email,
      oldValue: sampleData.users.user1.email,
      table: 'users',
    });
    shouldTrackAttribute({
      attribute: 'first_name',
      auditChanges,
      key: user.get('uuid'),
      newValue: sampleData.users.user2.firstName,
      oldValue: sampleData.users.user1.firstName,
      table: 'users',
    });
    shouldTrackAttribute({
      attribute: 'household_uuid',
      auditChanges,
      key: user.get('uuid'),
      newValue: household2.get('uuid'),
      oldValue: household1.get('uuid'),
      table: 'users',
    });
    shouldTrackAttribute({
      attribute: 'last_name',
      auditChanges,
      key: user.get('uuid'),
      newValue: sampleData.users.user2.lastName,
      oldValue: sampleData.users.user1.lastName,
      table: 'users',
    });
    assert.strictEqual(auditChanges.length, 4);
  });

  it('should track all UserLogin attributes', async function() {
    const auditLog = await models.Audit.Log.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.householdName,
    });
    const user = await models.User.create({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });
    const newH2 = crypto.randomBytes(96).toString('base64');
    const newS1 = crypto.randomBytes(48).toString('base64');
    const oldH2 = crypto.randomBytes(96).toString('base64');
    const oldS1 = crypto.randomBytes(48).toString('base64');
    const userLogin = await models.UserLogin.create({
      h2: oldH2,
      s1: oldS1,
      user_uuid: user.get('uuid'),
    });
    userLogin.set('h2', newH2);
    userLogin.set('s1', newS1);

    await models.sequelize.transaction({
      isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceUpdate(auditLog, userLogin, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    assert.strictEqual(auditChanges.length, 0);
  });
});
