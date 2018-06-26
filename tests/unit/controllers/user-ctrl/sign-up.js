const chai = require('chai');
const sampleData = require('../../../sample-data/');
const scrypt = require('scrypt');
const sinon = require('sinon');
const TestHelper = require('../../../test-helper/');
const _ = require('lodash');

const assert = chai.assert;

describe('Unit:Controllers - UserCtrl.signUp', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  before('get app', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
  });

  before('create sinon spies', function() {
    trackChangesSpy = sinon.spy(controllers.AuditCtrl, 'trackChanges');
  });

  after('restore sinon spies', function() {
    trackChangesSpy.restore();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject with no email', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create();
      await controllers.UserCtrl.signUp({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid1.email,
        firstName: sampleData.users.invalid1.firstName,
        lastName: sampleData.users.invalid1.lastName,
        password: sampleData.users.invalid1.password,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Email is required.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no first name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create();
      await controllers.UserCtrl.signUp({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid2.email,
        firstName: sampleData.users.invalid2.firstName,
        lastName: sampleData.users.invalid2.lastName,
        password: sampleData.users.invalid2.password,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'First name is required.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no last name', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create();
      await controllers.UserCtrl.signUp({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid4.email,
        firstName: sampleData.users.invalid4.firstName,
        lastName: sampleData.users.invalid4.lastName,
        password: sampleData.users.invalid4.password,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Last name is required.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no password', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create();
      await controllers.UserCtrl.signUp({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid5.email,
        firstName: sampleData.users.invalid5.firstName,
        lastName: sampleData.users.invalid5.lastName,
        password: sampleData.users.invalid5.password,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Password is required.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with a short password', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create();
      await controllers.UserCtrl.signUp({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.invalid7.email,
        firstName: sampleData.users.invalid7.firstName,
        lastName: sampleData.users.invalid7.lastName,
        password: sampleData.users.invalid7.password,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Passwords must be at least 8 characters.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject without an API call', async function() {
    try {
      await controllers.UserCtrl.signUp({
        auditApiCallUuid: null,
        email: sampleData.users.user1.email,
        firstName: sampleData.users.user1.firstName,
        lastName: sampleData.users.user1.lastName,
        password: sampleData.users.user1.password,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Audit API call is required.');
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should create a new user and household', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    const userUuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });

    assert.isOk(userUuid);

    // Verify the User instance.
    const user = await models.User.findOne({
      attributes: ['email', 'first_name', 'household_uuid', 'last_name', 'uuid'],
      where: {
        uuid: userUuid,
      },
    });
    assert.isOk(user);
    assert.strictEqual(user.get('email'), sampleData.users.user1.email.toLowerCase());
    assert.strictEqual(user.get('first_name'), sampleData.users.user1.firstName);
    assert.isOk(user.get('household_uuid'));
    assert.strictEqual(user.get('last_name'), sampleData.users.user1.lastName);

    // Verify the Household instance.
    const household = await models.Household.findOne({
      attributes: ['name', 'uuid'],
      where: {
        uuid: user.get('household_uuid'),
      },
    });
    assert.isOk(household);
    assert.strictEqual(household.get('name'), sampleData.users.user1.lastName);

    // Verify the UserLogin instance.
    const userLogin = await models.UserLogin.findOne({
      attributes: ['h2', 's1', 'user_uuid'],
      where: {
        user_uuid: user.get('uuid'),
      },
    });
    assert.isOk(userLogin);
    assert.isOk(userLogin.get('h2'));
    assert.isOk(userLogin.get('s1'));
    const h1 = (await scrypt.hash(
      sampleData.users.user1.password,
      controllers.UserCtrl.hashParams,
      96,
      userLogin.get('s1'),
    )).toString('base64');
    const hash = await models.Hash.findOne({
      attributes: ['h1', 's2'],
      where: {
        h1,
      },
    });
    assert.isOk(hash);
    const h2 = (await scrypt.hash(
      sampleData.users.user1.password,
      controllers.UserCtrl.hashParams,
      96,
      hash.get('s2'),
    )).toString('base64');
    assert.strictEqual(userLogin.get('h2'), h2);

    assert.strictEqual(trackChangesSpy.callCount, 1);
    const trackChangesParams = trackChangesSpy.getCall(0).args[0];
    assert.strictEqual(trackChangesParams.auditApiCallUuid, apiCall.get('uuid'));
    assert.isNotOk(trackChangesParams.changeList);
    assert.isNotOk(trackChangesParams.deleteList);
    assert.isOk(trackChangesParams.newList);
    const newHousehold = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.Household &&
        newInstance.get('uuid') === household.get('uuid');
    });
    assert.isOk(newHousehold);
    const newUser = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.User &&
        newInstance.get('uuid') === user.get('uuid');
    });
    assert.isOk(newUser);
    const newUserLogin = _.find(trackChangesParams.newList, (newInstance) => {
      return newInstance instanceof models.UserLogin &&
        newInstance.get('user_uuid') === user.get('uuid');
    });
    assert.isOk(newUserLogin);
    assert.strictEqual(trackChangesParams.newList.length, 3);
    assert.isOk(trackChangesParams.transaction);
  });

  describe('when the email already exists', function() {
    beforeEach('create user', async function() {
      const apiCall = await models.Audit.ApiCall.create();
      await controllers.UserCtrl.signUp({
        auditApiCallUuid: apiCall.get('uuid'),
        email: sampleData.users.user1.email,
        firstName: sampleData.users.user1.firstName,
        lastName: sampleData.users.user1.lastName,
        password: sampleData.users.user1.password,
      });
      trackChangesSpy.resetHistory();
    });

    it('should reject with the same email', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create();
        await controllers.UserCtrl.signUp({
          auditApiCallUuid: apiCall.get('uuid'),
          email: sampleData.users.user1.email,
          firstName: sampleData.users.user1.firstName,
          lastName: sampleData.users.user1.lastName,
          password: sampleData.users.user1.password,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'That email address is already taken.');
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });

    it('should reject with the same email regardless of case', async function() {
      try {
        const apiCall = await models.Audit.ApiCall.create();
        await controllers.UserCtrl.signUp({
          auditApiCallUuid: apiCall.get('uuid'),
          email: sampleData.users.user1.email.toUpperCase(),
          firstName: sampleData.users.user1.firstName,
          lastName: sampleData.users.user1.lastName,
          password: sampleData.users.user1.password,
        });
        /* istanbul ignore next */
        throw new Error('Expected to reject not resolve.');
      } catch (err) {
        assert.isOk(err);
        assert.strictEqual(err.message, 'That email address is already taken.');
      }
      assert.strictEqual(trackChangesSpy.callCount, 0);
    });
  });
});
