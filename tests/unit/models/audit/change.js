const chai = require('chai');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;

describe('Unit:Model - AuditChange', function() {
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
    assert.strictEqual(models.Audit.Change.getTableName(), 'audit_changes');
  });

  it('should have the correct attributes', async function() {
    const attributes = await models.Audit.Change.describe();

    assert.isOk(attributes);

    // uuid
    assert.isOk(attributes.uuid);
    assert.strictEqual(attributes.uuid.type, 'UUID');
    assert.isFalse(attributes.uuid.allowNull);
    assert.isNull(attributes.uuid.defaultValue);
    assert.isTrue(attributes.uuid.primaryKey);

    // audit_log_uuid
    assert.isOk(attributes.audit_log_uuid);
    assert.strictEqual(attributes.audit_log_uuid.type, 'UUID');
    assert.isFalse(attributes.audit_log_uuid.allowNull);
    assert.isNull(attributes.audit_log_uuid.defaultValue);
    assert.isFalse(attributes.audit_log_uuid.primaryKey);

    // table
    assert.isOk(attributes.table);
    assert.strictEqual(attributes.table.type, 'CHARACTER VARYING(255)');
    assert.isFalse(attributes.table.allowNull);
    assert.isNull(attributes.table.defaultValue);
    assert.isFalse(attributes.table.primaryKey);

    // key
    assert.isOk(attributes.key);
    assert.strictEqual(attributes.key.type, 'UUID');
    assert.isFalse(attributes.key.allowNull);
    assert.isNull(attributes.key.defaultValue);
    assert.isFalse(attributes.key.primaryKey);

    // attribute
    assert.isOk(attributes.attribute);
    assert.strictEqual(attributes.attribute.type, 'CHARACTER VARYING(255)');
    assert.isFalse(attributes.attribute.allowNull);
    assert.isNull(attributes.attribute.defaultValue);
    assert.isFalse(attributes.attribute.primaryKey);

    // old_value
    assert.isOk(attributes.old_value);
    assert.strictEqual(attributes.old_value.type, 'TEXT');
    assert.isTrue(attributes.old_value.allowNull);
    assert.isNull(attributes.old_value.defaultValue);
    assert.isFalse(attributes.old_value.primaryKey);

    // new_value
    assert.isOk(attributes.new_value);
    assert.strictEqual(attributes.new_value.type, 'TEXT');
    assert.isTrue(attributes.new_value.allowNull);
    assert.isNull(attributes.new_value.defaultValue);
    assert.isFalse(attributes.new_value.primaryKey);

    assert.strictEqual(Object.keys(attributes).length, 7);
  });
});
