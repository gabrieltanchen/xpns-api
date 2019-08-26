const chai = require('chai');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');
const { LOGIN_PASSWORD_FAILED } = require('../../../../app/middleware/error-handler/');

const assert = chai.assert;

describe('Unit:Controllers - UserCtrl.loginWithPassword', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let userUuid;

  before('get app', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  beforeEach('create user', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    userUuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject with no email', async function() {
    try {
      await controllers.UserCtrl.loginWithPassword({
        email: null,
        password: sampleData.users.user1.password,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'No email or password given');
      assert.strictEqual(err.code, LOGIN_PASSWORD_FAILED);
    }
  });

  it('should reject with no password', async function() {
    try {
      await controllers.UserCtrl.loginWithPassword({
        email: sampleData.users.user1.email,
        password: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'No email or password given');
      assert.strictEqual(err.code, LOGIN_PASSWORD_FAILED);
    }
  });

  it('should reject when the user does not exist', async function() {
    try {
      await controllers.UserCtrl.loginWithPassword({
        email: sampleData.users.user2.email,
        password: sampleData.users.user1.password,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'User does not exist');
      assert.strictEqual(err.code, LOGIN_PASSWORD_FAILED);
    }
  });

  it('should reject with the wrong password', async function() {
    try {
      await controllers.UserCtrl.loginWithPassword({
        email: sampleData.users.user1.email,
        password: sampleData.users.user2.password,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Wrong password');
      assert.strictEqual(err.code, LOGIN_PASSWORD_FAILED);
    }
  });

  it('should return the user uuid with the correct password', async function() {
    const result = await controllers.UserCtrl.loginWithPassword({
      email: sampleData.users.user1.email,
      password: sampleData.users.user1.password,
    });
    assert.strictEqual(result, userUuid);
  });
});
