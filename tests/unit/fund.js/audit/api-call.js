const chai = require('chai');
const TestHelper = require('../../../test-helper');

const assert = chai.assert;

describe('Unit:Model - AuditApiCall', function() {
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
    assert.strictEqual(models.Audit.ApiCall.getTableName(), 'audit_api_calls');
  });

  it('should have the correct attributes', async function() {
    const attributes = await models.Audit.ApiCall.describe();

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

    // user_uuid
    assert.isOk(attributes.user_uuid);
    assert.strictEqual(attributes.user_uuid.type, 'UUID');
    assert.isTrue(attributes.user_uuid.allowNull);
    assert.isNull(attributes.user_uuid.defaultValue);
    assert.isFalse(attributes.user_uuid.primaryKey);

    // user_agent
    assert.isOk(attributes.user_agent);
    assert.strictEqual(attributes.user_agent.type, 'TEXT');
    assert.isTrue(attributes.user_agent.allowNull);
    assert.isNull(attributes.user_agent.defaultValue);
    assert.isFalse(attributes.user_agent.primaryKey);

    // ip_address
    assert.isOk(attributes.ip_address);
    assert.strictEqual(attributes.ip_address.type, 'CHARACTER VARYING(255)');
    assert.isTrue(attributes.ip_address.allowNull);
    assert.isNull(attributes.ip_address.defaultValue);
    assert.isFalse(attributes.ip_address.primaryKey);

    // http_method
    assert.isOk(attributes.http_method);
    assert.strictEqual(attributes.http_method.type, 'CHARACTER VARYING(255)');
    assert.isTrue(attributes.http_method.allowNull);
    assert.isNull(attributes.http_method.defaultValue);
    assert.isFalse(attributes.http_method.primaryKey);

    // route
    assert.isOk(attributes.route);
    assert.strictEqual(attributes.route.type, 'CHARACTER VARYING(255)');
    assert.isTrue(attributes.route.allowNull);
    assert.isNull(attributes.route.defaultValue);
    assert.isFalse(attributes.route.primaryKey);

    assert.strictEqual(Object.keys(attributes).length, 8);
  });
});
