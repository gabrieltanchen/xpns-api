const chai = require('chai');
const TestHelper = require('../../test-helper/');

const assert = chai.assert;

describe('Unit:Model - Hash', function() {
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
    assert.strictEqual(models.Hash.getTableName(), 'hashes');
  });

  it('should have the correct attributes', async function() {
    const attributes = await models.Hash.describe();

    assert.isOk(attributes);

    // h1
    assert.isOk(attributes.h1);
    assert.strictEqual(attributes.h1.type, 'CHARACTER VARYING(128)');
    assert.isFalse(attributes.h1.allowNull);
    assert.isNull(attributes.h1.defaultValue);
    assert.isTrue(attributes.h1.primaryKey);

    // s2
    assert.isOk(attributes.s2);
    assert.strictEqual(attributes.s2.type, 'CHARACTER VARYING(64)');
    assert.isFalse(attributes.s2.allowNull);
    assert.isNull(attributes.s2.defaultValue);
    assert.isFalse(attributes.s2.primaryKey);

    assert.strictEqual(Object.keys(attributes).length, 2);
  });
});
