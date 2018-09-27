const chai = require('chai');
const nconf = require('nconf');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;

describe('Unit:Controllers - UserCtrl.getToken', function() {
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

  it('should reject with no user uuid', async function() {
    try {
      await controllers.UserCtrl.getToken(null);
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'User UUID is required.');
    }
  });

  it('should reject when the user does not exist', async function() {
    try {
      await controllers.UserCtrl.getToken(uuidv4());
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'User not found.');
    }
  });

  it('should resolve with a signed token', async function() {
    const token = await controllers.UserCtrl.getToken(userUuid);
    assert.isOk(token);

    // Validate jwt.
    const decoded = jwt.verify(token, nconf.get('jwtPrivateKey'), {
      algorithms: [controllers.UserCtrl.jwtAlgorithm],
    });
    assert.isOk(decoded);
    assert.strictEqual(decoded.email, sampleData.users.user1.email.toLowerCase());
    assert.strictEqual(decoded.first_name, sampleData.users.user1.firstName);
    assert.strictEqual(decoded.last_name, sampleData.users.user1.lastName);
    assert.strictEqual(decoded.uuid, userUuid);
  });
});
