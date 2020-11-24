const chai = require('chai');
const jwt = require('jsonwebtoken');
const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;

describe('Unit:Controllers - UserCtrl.loginWithToken', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let userUuid;
  let userToken;

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

  beforeEach('create jwt', async function() {
    userToken = await controllers.UserCtrl.getToken(userUuid);
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should reject with no token', async function() {
    try {
      await controllers.UserCtrl.loginWithToken(null);
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.name, 'JsonWebTokenError');
      assert.strictEqual(err.message, 'jwt must be provided');
    }
  });

  it('should reject with an invalid token', async function() {
    const invalidToken = jwt.sign({
      uuid: userUuid,
    }, 'some-fake-private-key', {
      algorithm: controllers.UserCtrl.jwtAlgorithm,
      expiresIn: controllers.UserCtrl.tokenExpiresIn,
    });
    try {
      await controllers.UserCtrl.loginWithToken(invalidToken);
      /* istsanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.name, 'JsonWebTokenError');
      assert.strictEqual(err.message, 'invalid signature');
    }
  });

  it('should resolve with a valid token', async function() {
    const result = await controllers.UserCtrl.loginWithToken(userToken);
    assert.isOk(result);
    assert.strictEqual(result.uuid, userUuid);
  });
});
