const chai = require('chai');
const chaiHttp = require('chai-http');
const sampleData = require('../../../sample-data/');
const sinon = require('sinon');
const TestHelper = require('../../../test-helper/');
const _ = require('lodash');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /users/login', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let getTokenSpy;
  let loginWithPasswordSpy;

  let userUuid;

  const errorResponseTest = async(attributes, expectedStatus, expectedErrors) => {
    const res = await chai.request(server)
      .post('/users/login')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'email': attributes.email,
            'password': attributes.password,
          },
          'type': 'users',
        },
      });
    expect(res).to.have.status(expectedStatus);
    for (const expectedError of expectedErrors) {
      const foundError = _.find(res.body.errors, (error) => {
        return error.detail === expectedError.detail;
      });
      assert.isOk(foundError, `should find error: ${expectedError.detail}`);
      if (expectedError.source) {
        assert.isOk(foundError.source, `should find error source: ${expectedError.detail}`);
        assert.strictEqual(foundError.source.pointer, expectedError.source);
      }
    }
    assert.strictEqual(res.body.errors.length, expectedErrors.length);
  };

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    getTokenSpy = sinon.spy(controllers.UserCtrl, 'getToken');
    loginWithPasswordSpy = sinon.spy(controllers.UserCtrl, 'loginWithPassword');
  });

  after('restore sinon spies', function() {
    getTokenSpy.restore();
    loginWithPasswordSpy.restore();
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

  afterEach('reset history for sinon spies', function() {
    getTokenSpy.resetHistory();
    loginWithPasswordSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 422 with no email', async function() {
    await errorResponseTest(sampleData.users.invalid1, 422, [{
      detail: 'Email address is required.',
      source: '/data/attributes/email',
    }, {
      detail: 'Please enter a valid email address.',
      source: '/data/attributes/email',
    }]);

    assert.strictEqual(getTokenSpy.callCount, 0);
    assert.strictEqual(loginWithPasswordSpy.callCount, 0);
  });

  it('should return 422 with an invalid email', async function() {
    await errorResponseTest(sampleData.users.invalid5, 422, [{
      detail: 'Please enter a valid email address.',
      source: '/data/attributes/email',
    }]);

    assert.strictEqual(getTokenSpy.callCount, 0);
    assert.strictEqual(loginWithPasswordSpy.callCount, 0);
  });

  it('should return 422 with no password', async function() {
    await errorResponseTest(sampleData.users.invalid4, 422, [{
      detail: 'Passwords must be a minimum of 8 characters.',
      source: '/data/attributes/password',
    }]);

    assert.strictEqual(getTokenSpy.callCount, 0);
    assert.strictEqual(loginWithPasswordSpy.callCount, 0);
  });

  it('should return 422 with a short password', async function() {
    await errorResponseTest(sampleData.users.invalid6, 422, [{
      detail: 'Passwords must be a minimum of 8 characters.',
      source: '/data/attributes/password',
    }]);

    assert.strictEqual(getTokenSpy.callCount, 0);
    assert.strictEqual(loginWithPasswordSpy.callCount, 0);
  });

  it('should return 403 with an invalid password', async function() {
    await errorResponseTest({
      email: sampleData.users.user1.email,
      password: sampleData.users.user2.password,
    }, 403, [{
      detail: 'Invalid email/password combination.',
    }]);

    assert.strictEqual(getTokenSpy.callCount, 0);
    assert.strictEqual(loginWithPasswordSpy.callCount, 1);
  });

  it('should return 200 with the correct password', async function() {
    const res = await chai.request(server)
      .post('/users/login')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'email': sampleData.users.user1.email,
            'password': sampleData.users.user1.password,
          },
          'type': 'users',
        },
      });
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.email, sampleData.users.user1.email.toLowerCase());
    assert.strictEqual(res.body.data.attributes['first-name'], sampleData.users.user1.firstName);
    assert.strictEqual(res.body.data.attributes['last-name'], sampleData.users.user1.lastName);
    assert.isOk(res.body.data.attributes.token);
    assert.strictEqual(res.body.data.id, userUuid);
    assert.strictEqual(res.body.data.type, 'users');

    // Validate UserCtrl.getToken call.
    assert.strictEqual(getTokenSpy.callCount, 1);
    assert.strictEqual(getTokenSpy.getCall(0).args[0], userUuid);

    // Validate UserCtrl.loginWithPassword call.
    assert.strictEqual(loginWithPasswordSpy.callCount, 1);
    const loginWithPasswordParams = loginWithPasswordSpy.getCall(0).args[0];
    assert.strictEqual(loginWithPasswordParams.email, sampleData.users.user1.email);
    assert.strictEqual(loginWithPasswordParams.password, sampleData.users.user1.password);
  });
});
