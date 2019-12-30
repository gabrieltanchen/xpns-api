const chai = require('chai');
const TestHelper = require('../../test-helper/');

const assert = chai.assert;

describe('Unit:Model - Budget', function() {
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
    assert.strictEqual(models.Budget.getTableName(), 'budgets');
  });

  it('should have the correct attributes', async function() {
    const attributes = await models.Budget.describe();

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

    // subcategory_uuid
    assert.isOk(attributes.subcategory_uuid);
    assert.strictEqual(attributes.subcategory_uuid.type, 'UUID');
    assert.isFalse(attributes.subcategory_uuid.allowNull);
    assert.isNull(attributes.subcategory_uuid.defaultValue);
    assert.isFalse(attributes.subcategory_uuid.primaryKey);

    // year
    assert.isOk(attributes.year);
    assert.strictEqual(attributes.year.type, 'INTEGER');
    assert.isFalse(attributes.year.allowNull);
    assert.isNull(attributes.year.defaultValue);
    assert.isFalse(attributes.year.primaryKey);

    // month
    assert.isOk(attributes.month);
    assert.strictEqual(attributes.month.type, 'INTEGER');
    assert.isFalse(attributes.month.allowNull);
    assert.isNull(attributes.month.defaultValue);
    assert.isFalse(attributes.month.primaryKey);

    // budget_cents
    assert.isOk(attributes.budget_cents);
    assert.strictEqual(attributes.budget_cents.type, 'INTEGER');
    assert.isFalse(attributes.budget_cents.allowNull);
    assert.isNull(attributes.budget_cents.defaultValue);
    assert.isFalse(attributes.budget_cents.primaryKey);

    assert.strictEqual(Object.keys(attributes).length, 8);
  });
});
