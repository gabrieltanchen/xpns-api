const chai = require('chai');
const chaiHttp = require('chai-http');
const sampleData = require('../../sample-data/');
const sinon = require('sinon');
const TestHelper = require('../../test-helper/');
const _ = require('lodash');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /users', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let getTokenSpy;
  let signUpSpy;

  const errorResponseTest = async(attributes, expectedStatus, expectedErrors) => {
    const res = await chai.request(server)
      .post('/users')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'email': attributes.email,
            'first-name': attributes.firstName,
            'last-name': attributes.lastName,
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

  before(async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    getTokenSpy = sinon.spy(controllers.UserCtrl, 'getToken');
    signUpSpy = sinon.spy(controllers.UserCtrl, 'signUp');
  });

  after('restore sinon spies', function() {
    getTokenSpy.restore();
    signUpSpy.restore();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  afterEach('reset history for sinon spies', function() {
    getTokenSpy.resetHistory();
    signUpSpy.resetHistory();
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
    assert.strictEqual(signUpSpy.callCount, 0);
  });

  it('should return 422 with an invalid email', async function() {
    await errorResponseTest(sampleData.users.invalid6, 422, [{
      detail: 'Please enter a valid email address.',
      source: '/data/attributes/email',
    }]);

    assert.strictEqual(getTokenSpy.callCount, 0);
    assert.strictEqual(signUpSpy.callCount, 0);
  });

  it('should return 422 with no first name', async function() {
    await errorResponseTest(sampleData.users.invalid2, 422, [{
      detail: 'First name is required.',
      source: '/data/attributes/first-name',
    }]);

    assert.strictEqual(getTokenSpy.callCount, 0);
    assert.strictEqual(signUpSpy.callCount, 0);
  });

  it('should return 422 with no last name', async function() {
    await errorResponseTest(sampleData.users.invalid4, 422, [{
      detail: 'Last name is required.',
      source: '/data/attributes/last-name',
    }]);

    assert.strictEqual(getTokenSpy.callCount, 0);
    assert.strictEqual(signUpSpy.callCount, 0);
  });

  it('should return 422 with no password', async function() {
    await errorResponseTest(sampleData.users.invalid5, 422, [{
      detail: 'Passwords must be a minimum of 8 characters.',
      source: '/data/attributes/password',
    }]);

    assert.strictEqual(getTokenSpy.callCount, 0);
    assert.strictEqual(signUpSpy.callCount, 0);
  });

  it('should return 422 with a short password', async function() {
    await errorResponseTest(sampleData.users.invalid7, 422, [{
      detail: 'Passwords must be a minimum of 8 characters.',
      source: '/data/attributes/password',
    }]);

    assert.strictEqual(getTokenSpy.callCount, 0);
    assert.strictEqual(signUpSpy.callCount, 0);
  });

  it('should return 201 with valid data', async function() {
    const res = await chai.request(server)
      .post('/users')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'email': sampleData.users.user1.email,
            'first-name': sampleData.users.user1.firstName,
            'last-name': sampleData.users.user1.lastName,
            'password': sampleData.users.user1.password,
          },
          'type': 'users',
        },
      });
    expect(res).to.have.status(201);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.email, sampleData.users.user1.email.toLowerCase());
    assert.strictEqual(res.body.data.attributes['first-name'], sampleData.users.user1.firstName);
    assert.strictEqual(res.body.data.attributes['last-name'], sampleData.users.user1.lastName);
    assert.isOk(res.body.data.attributes.token);
    assert.isOk(res.body.data.id);
    assert.strictEqual(res.body.data.type, 'users');

    // Validate UserCtrl.getToken call.
    assert.strictEqual(getTokenSpy.callCount, 1);
    assert.strictEqual(getTokenSpy.getCall(0).args[0], res.body.data.id);

    // Validate UserCtrl.signUp call.
    assert.strictEqual(signUpSpy.callCount, 1);
    const signUpParams = signUpSpy.getCall(0).args[0];
    assert.isOk(signUpParams.auditApiCallUuid);
    assert.strictEqual(signUpParams.email, sampleData.users.user1.email);
    assert.strictEqual(signUpParams.firstName, sampleData.users.user1.firstName);
    assert.strictEqual(signUpParams.lastName, sampleData.users.user1.lastName);
    assert.strictEqual(signUpParams.password, sampleData.users.user1.password);

    // Validate Audit API call.
    const apiCall = await models.Audit.ApiCall.findOne({
      attributes: [
        'http_method',
        'ip_address',
        'route',
        'user_agent',
        'user_uuid',
        'uuid',
      ],
      where: {
        uuid: signUpParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'POST');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), '/users');
    assert.isOk(apiCall.get('user_agent'));
    assert.isNull(apiCall.get('user_uuid'));
  });
});
