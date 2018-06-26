const chai = require('chai');
const crypto = require('crypto');
const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');
const _ = require('lodash');

const assert = chai.assert;

describe('Unit:Controllers - AuditCtrl._trackInstanceDestroy', function() {
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
    try {
      await models.sequelize.transaction({
        isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
      }, async(transaction) => {
        await controllers.AuditCtrl._trackInstanceDestroy(null, household, transaction);
      });
      /* istanbul ignore next */
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
        await controllers.AuditCtrl._trackInstanceDestroy(auditLog, null, transaction);
      });
      /* istanbul ignore next */
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
    try {
      const auditLog = await models.Audit.Log.create();
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, household, null);
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Sequelize transaction is required.');
    }
  });

  it('should track deleting a Household', async function() {
    const auditLog = await models.Audit.Log.create();
    const household = await models.Household.create({
      name: sampleData.users.user1.householdName,
    });

    await models.sequelize.transaction({
      isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, household, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    const trackDeletedAt = _.find(auditChanges, (auditChange) => {
      return auditChange.get('table') === 'households' &&
        auditChange.get('attribute') === 'deleted_at' &&
        auditChange.get('key') === household.get('uuid');
    });
    assert.isOk(trackDeletedAt);
    assert.isNull(trackDeletedAt.get('old_value'));
    assert.isOk(trackDeletedAt.get('new_value'));
    assert.strictEqual(auditChanges.length, 1);

    // Verify that the Household is deleted.
    assert.isNull(await models.Household.findOne({
      where: {
        uuid: household.get('uuid'),
      },
    }));
    assert.isOk(await models.Household.findOne({
      paranoid: false,
      where: {
        uuid: household.get('uuid'),
      },
    }));
  });

  it('should track deleting a User', async function() {
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

    await models.sequelize.transaction({
      isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, user, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    const trackDeletedAt = _.find(auditChanges, (auditChange) => {
      return auditChange.get('table') === 'users' &&
        auditChange.get('attribute') === 'deleted_at' &&
        auditChange.get('key') === user.get('uuid');
    });
    assert.isOk(trackDeletedAt);
    assert.isNull(trackDeletedAt.get('old_value'));
    assert.isOk(trackDeletedAt.get('new_value'));
    assert.strictEqual(auditChanges.length, 1);

    // Verify that the User is deleted.
    assert.isNull(await models.User.findOne({
      where: {
        uuid: user.get('uuid'),
      },
    }));
    assert.isOk(await models.User.findOne({
      paranoid: false,
      where: {
        uuid: user.get('uuid'),
      },
    }));
  });

  it('should not delete a UserLogin', async function() {
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
    const userLogin = await models.UserLogin.create({
      h2: crypto.randomBytes(96).toString('base64'),
      s1: crypto.randomBytes(48).toString('base64'),
      user_uuid: user.get('uuid'),
    });

    await models.sequelize.transaction({
      isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl._trackInstanceDestroy(auditLog, userLogin, transaction);
    });

    const auditChanges = await models.Audit.Change.findAll({
      where: {
        audit_log_uuid: auditLog.get('uuid'),
      },
    });
    assert.strictEqual(auditChanges.length, 0);

    // Verify that the UserLogin is not deleted.
    assert.isOk(await models.UserLogin.findOne({
      where: {
        user_uuid: user.get('uuid'),
      },
    }));
  });
});
