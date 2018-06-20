const chai = require('chai');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;

describe('Unit:Model - AuditLog', function() {
  let models;
  const testHelper = new TestHelper();

  before('get models', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    models = app.get('models');
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  it('should have the correct table name', function() {
    assert.strictEqual(models.Audit.Log.getTableName(), 'audit_logs');
  });

  it('should have the correct attributes', async function() {
    const attributes = await models.Audit.Log.describe();

    assert.isOk(attributes);

    // uuid
    assert.isOk(attributes.uuid);
    assert.strictEqual(attributes.uuid.type, 'UUID');
    assert.isFalse(attributes.uuid.allowNull);
    assert.isNull(attributes.uuid.defaultValue);
    assert.isTrue(attributes.uuid.primaryKey);

    // created_at
    assert.isOk(attributes.created_at);
    assert.strictEqual(attributes.created_at.type, 'TIMESTAMP WITH TIME ZONE');
    assert.isFalse(attributes.created_at.allowNull);
    assert.isNull(attributes.created_at.defaultValue);
    assert.isFalse(attributes.created_at.primaryKey);

    // updated_at
    assert.isOk(attributes.updated_at);
    assert.strictEqual(attributes.updated_at.type, 'TIMESTAMP WITH TIME ZONE');
    assert.isFalse(attributes.updated_at.allowNull);
    assert.isNull(attributes.updated_at.defaultValue);
    assert.isFalse(attributes.updated_at.primaryKey);

    // audit_api_call_uuid
    assert.isOk(attributes.audit_api_call_uuid);
    assert.strictEqual(attributes.audit_api_call_uuid.type, 'UUID');
    assert.isTrue(attributes.audit_api_call_uuid.allowNull);
    assert.isNull(attributes.audit_api_call_uuid.defaultValue);
    assert.isFalse(attributes.audit_api_call_uuid.primaryKey);

    // worker
    assert.isOk(attributes.worker);
    assert.strictEqual(attributes.worker.type, 'CHARACTER VARYING(255)');
    assert.isTrue(attributes.worker.allowNull);
    assert.isNull(attributes.worker.defaultValue);
    assert.isFalse(attributes.worker.primaryKey);

    // worker_action
    assert.isOk(attributes.worker_action);
    assert.strictEqual(attributes.worker_action.type, 'CHARACTER VARYING(255)');
    assert.isTrue(attributes.worker_action.allowNull);
    assert.isNull(attributes.worker_action.defaultValue);
    assert.isFalse(attributes.worker_action.primaryKey);

    assert.strictEqual(Object.keys(attributes).length, 6);
  });
});
