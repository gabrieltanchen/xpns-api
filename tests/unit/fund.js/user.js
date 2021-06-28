const chai = require('chai');
const TestHelper = require('../../test-helper');

const assert = chai.assert;

describe('Unit:Model - User', function() {
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
    assert.strictEqual(models.User.getTableName(), 'users');
  });

  it('should have the correct attributes', async function() {
    const attributes = await models.User.describe();

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

    // deleted_at
    assert.isOk(attributes.deleted_at);
    assert.strictEqual(attributes.deleted_at.type, 'TIMESTAMP WITH TIME ZONE');
    assert.isTrue(attributes.deleted_at.allowNull);
    assert.isNull(attributes.deleted_at.defaultValue);
    assert.isFalse(attributes.deleted_at.primaryKey);

    // household_uuid
    assert.isOk(attributes.household_uuid);
    assert.strictEqual(attributes.household_uuid.type, 'UUID');
    assert.isFalse(attributes.household_uuid.allowNull);
    assert.isNull(attributes.household_uuid.defaultValue);
    assert.isFalse(attributes.household_uuid.primaryKey);

    // email
    assert.isOk(attributes.email);
    assert.strictEqual(attributes.email.type, 'CHARACTER VARYING(255)');
    assert.isFalse(attributes.email.allowNull);
    assert.isNull(attributes.email.defaultValue);
    assert.isFalse(attributes.email.primaryKey);

    // first_name
    assert.isOk(attributes.first_name);
    assert.strictEqual(attributes.first_name.type, 'CHARACTER VARYING(255)');
    assert.isFalse(attributes.first_name.allowNull);
    assert.isNull(attributes.first_name.defaultValue);
    assert.isFalse(attributes.first_name.primaryKey);

    // last_name
    assert.isOk(attributes.last_name);
    assert.strictEqual(attributes.last_name.type, 'CHARACTER VARYING(255)');
    assert.isFalse(attributes.last_name.allowNull);
    assert.isNull(attributes.last_name.defaultValue);
    assert.isFalse(attributes.last_name.primaryKey);

    assert.strictEqual(Object.keys(attributes).length, 8);
  });
});
