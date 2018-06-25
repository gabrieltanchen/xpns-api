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
  let server;
  const testHelper = new TestHelper();

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
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    signUpSpy = sinon.spy(controllers.UserCtrl, 'signUp');
  });

  after('restore sinon spies', function() {
    signUpSpy.restore();
  });

  after(async function() {
    await testHelper.cleanup();
  });

  afterEach('reset history for sinon spies', function() {
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

    assert.strictEqual(signUpSpy.callCount, 0);
  });

  it('should return 422 with an invalid email', async function() {
    await errorResponseTest(sampleData.users.invalid6, 422, [{
      detail: 'Please enter a valid email address.',
      source: '/data/attributes/email',
    }]);

    assert.strictEqual(signUpSpy.callCount, 0);
  });

  it('should return 422 with no first name', async function() {
    await errorResponseTest(sampleData.users.invalid2, 422, [{
      detail: 'First name is required.',
      source: '/data/attributes/first-name',
    }]);

    assert.strictEqual(signUpSpy.callCount, 0);
  });

  it('should return 422 with no last name', async function() {
    await errorResponseTest(sampleData.users.invalid4, 422, [{
      detail: 'Last name is required.',
      source: '/data/attributes/last-name',
    }]);

    assert.strictEqual(signUpSpy.callCount, 0);
  });

  it('should return 422 with no password');

  it('should return 422 with a short password');

  it('should return 201 with valid data');
});
