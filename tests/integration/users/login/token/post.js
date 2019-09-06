const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const sampleData = require('../../../../sample-data/');
const sinon = require('sinon');
const TestHelper = require('../../../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /users/login/token', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let loginWithTokenSpy;

  let userUuid;
  let userToken;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    loginWithTokenSpy = sinon.spy(controllers.UserCtrl, 'loginWithToken');
  });

  after('restore sinon spies', function() {
    loginWithTokenSpy.restore();
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

  afterEach('reset history for sinon spies', function() {
    loginWithTokenSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 422 with no token', async function() {
    const res = await chai.request(server)
      .post('/users/login/token')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'token': null,
          },
          'type': 'users',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'No token provided.',
        source: {
          pointer: '/data/attributes/token',
        },
      }],
    });

    assert.strictEqual(loginWithTokenSpy.callCount, 0);
  });

  it('should return 403 with an invalid token', async function() {
    const invalidToken = jwt.sign({
      uuid: userUuid,
    }, 'some-fake-private-key', {
      algorithm: controllers.UserCtrl.jwtAlgorithm,
      expiresIn: controllers.UserCtrl.tokenExpiresIn,
    });
    const res = await chai.request(server)
      .post('/users/login/token')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'token': invalidToken,
          },
          'type': 'users',
        },
      });
    expect(res).to.have.status(403);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });

    assert.strictEqual(loginWithTokenSpy.callCount, 1);
  });

  it('should return 200 with a valid token', async function() {
    const res = await chai.request(server)
      .post('/users/login/token')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'token': userToken,
          },
          'type': 'users',
        },
      });
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes.email, sampleData.users.user1.email.toLowerCase());
    assert.strictEqual(res.body.data.attributes['first-name'], sampleData.users.user1.firstName);
    assert.strictEqual(res.body.data.attributes['last-name'], sampleData.users.user1.lastName);
    assert.strictEqual(res.body.data.id, userUuid);
    assert.strictEqual(res.body.data.type, 'users');

    // Validate UserCtrl.loginWithToken call.
    assert.strictEqual(loginWithTokenSpy.callCount, 1);
    assert.strictEqual(loginWithTokenSpy.getCall(0).args[0], userToken);
  });
});
