const chai = require('chai');
const TestHelper = require('../../test-helper/');

const assert = chai.assert;

describe('Unit:Model - UserLogin', function() {
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
    assert.strictEqual(models.UserLogin.getTableName(), 'user_logins');
  });

  it('should have the correct attributes', async function() {
    const attributes = await models.UserLogin.describe();

    assert.isOk(attributes);

    // user_uuid
    assert.isOk(attributes.user_uuid);
    assert.strictEqual(attributes.user_uuid.type, 'UUID');
    assert.isFalse(attributes.user_uuid.allowNull);
    assert.isNull(attributes.user_uuid.defaultValue);
    assert.isTrue(attributes.user_uuid.primaryKey);

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

    // s1
    assert.isOk(attributes.s1);
    assert.strictEqual(attributes.s1.type, 'CHARACTER VARYING(64)');
    assert.isFalse(attributes.s1.allowNull);
    assert.isNull(attributes.s1.defaultValue);
    assert.isFalse(attributes.s1.primaryKey);

    // h2
    assert.isOk(attributes.h2);
    assert.strictEqual(attributes.h2.type, 'CHARACTER VARYING(128)');
    assert.isFalse(attributes.h2.allowNull);
    assert.isNull(attributes.h2.defaultValue);
    assert.isFalse(attributes.h2.primaryKey);

    assert.strictEqual(Object.keys(attributes).length, 5);
  });
});
