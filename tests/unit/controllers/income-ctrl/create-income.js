const chai = require('chai');
const sinon = require('sinon');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const { IncomeError } = require('../../../../app/middleware/error-handler/');

const assert = chai.assert;

describe('Unit:Controllers - IncomeCtrl.createIncome', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let user1HouseholdMemberUuid;
  let user1HouseholdUuid;
  let user1Uuid;
  let user2HouseholdMemberUuid;
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

  beforeEach('create user 1 household member', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.users.user1.firstName,
    });
    user1HouseholdMemberUuid = householdMember.get('uuid');
  });

  beforeEach('create user 2', async function() {
    const household = await models.Household.create({
      name: sampleData.users.user2.lastName,
    });
    user2HouseholdUuid = household.get('uuid');
    await models.User.create({
      email: sampleData.users.user2.email,
      first_name: sampleData.users.user2.firstName,
      household_uuid: household.get('uuid'),
      last_name: sampleData.users.user2.lastName,
    });
  });

  beforeEach('create user 2 household member', async function() {
    const householdMember = await models.HouseholdMember.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.users.user2.firstName,
    });
    user2HouseholdMemberUuid = householdMember.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject with no household member UUID', async function() {
    try {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amountCents: sampleData.incomes.income1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        description: sampleData.incomes.income1.description,
        householdMemberUuid: null,
      });
      /* istanbul ignore next */
      throw new Error('Expected to reject not resolve.');
    } catch (err) {
      assert.isOk(err);
      assert.strictEqual(err.message, 'Household member is required');
      assert.isTrue(err instanceof IncomeError);
    }
    assert.strictEqual(trackChangesSpy.callCount, 0);
  });

  it('should reject with no amount');

  it('should reject with an invalid amount');

  it('should reject with no description');

  it('should reject with an invalid description');

  it('should reject with no audit API call');

  it('should reject when the audit API call does not exist');

  it('should reject when the user does not exist');

  it('should reject when the household member does not exist');

  it('should reject when the household member belongs to a different household');

  it('should resolve creating an income');
});
