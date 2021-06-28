const chai = require('chai');
const TestHelper = require('../../test-helper');

const assert = chai.assert;

describe('Unit:Model - Subcategory', function() {
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
    assert.strictEqual(models.Subcategory.getTableName(), 'subcategories');
  });

  it('should have the correct attributes', async function() {
    const attributes = await models.Subcategory.describe();

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

    // category_uuid
    assert.isOk(attributes.category_uuid);
    assert.strictEqual(attributes.category_uuid.type, 'UUID');
    assert.isFalse(attributes.category_uuid.allowNull);
    assert.isNull(attributes.category_uuid.defaultValue);
    assert.isFalse(attributes.category_uuid.primaryKey);

    // name
    assert.isOk(attributes.name);
    assert.strictEqual(attributes.name.type, 'CHARACTER VARYING(255)');
    assert.isFalse(attributes.name.allowNull);
    assert.isNull(attributes.name.defaultValue);
    assert.isFalse(attributes.name.primaryKey);

    assert.strictEqual(Object.keys(attributes).length, 6);
  });
});
