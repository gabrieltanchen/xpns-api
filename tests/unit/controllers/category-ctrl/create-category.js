const chai = require('chai');
const sinon = require('sinon');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;

describe.only('Unit:Controllers - CategoryCtrl.createCategory', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdUuid;
  let user1Uuid;
  let user2HouseholdUuid;
  let user2Uuid;

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

  beforeEach('create user 1', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user1.lastName,
    });
    user1HouseholdUuid = household.get('uuid');
    const user = await models.User.create({
      email: sampleData.users.user1.email,
      first_name: sampleData.users.user1.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user1.lastName,
    });
    user1Uuid = user.get('uuid');
  });

  beforeEach('create user 2', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user2.lastName,
    });
    user2HouseholdUuid = household.get('uuid');
    const user = await models.User.create({
      email: sampleData.users.user2.email,
      first_name: sampleData.users.user2.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user2.lastName,
    });
    user2Uuid = user.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject with no name');

  it('should reject with no audit API call');

  it('should reject when the audit API call does not exist');

  it('should reject when the user does not exist');

  it('should resolve creating a parent category');

  it('should reject creating a child category when the parent does not exist');

  it('should reject creating a child category when the parent belongs to a different household');

  it('should resolve creating a child category');
});
