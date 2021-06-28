const chai = require('chai');
const TestHelper = require('../../test-helper');

const assert = chai.assert;

describe('Unit:Model - Income', function() {
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
    assert.strictEqual(models.Income.getTableName(), 'incomes');
  });

  it('should have the correct attributes', async function() {
    const attributes = await models.Income.describe();

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

    // household_member_uuid
    assert.isOk(attributes.household_member_uuid);
    assert.strictEqual(attributes.household_member_uuid.type, 'UUID');
    assert.isFalse(attributes.household_member_uuid.allowNull);
    assert.isNull(attributes.household_member_uuid.defaultValue);
    assert.isFalse(attributes.household_member_uuid.primaryKey);

    // date
    assert.isOk(attributes.date);
    assert.strictEqual(attributes.date.type, 'DATE');
    assert.isFalse(attributes.date.allowNull);
    assert.isNull(attributes.date.defaultValue);
    assert.isFalse(attributes.date.primaryKey);

    // amount_cents
    assert.isOk(attributes.amount_cents);
    assert.strictEqual(attributes.amount_cents.type, 'INTEGER');
    assert.isFalse(attributes.amount_cents.allowNull);
    assert.isNull(attributes.amount_cents.defaultValue);
    assert.isFalse(attributes.amount_cents.primaryKey);

    // description
    assert.isOk(attributes.description);
    assert.strictEqual(attributes.description.type, 'CHARACTER VARYING(255)');
    assert.isFalse(attributes.description.allowNull);
    assert.isNull(attributes.description.defaultValue);
    assert.isFalse(attributes.description.primaryKey);

    assert.strictEqual(Object.keys(attributes).length, 8);
  });
});
