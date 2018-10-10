const chai = require('chai');
const sinon = require('sinon');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;

describe('Unit:Controllers - ExpenseCtrl.updateExpense', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  let trackChangesSpy;

  let expenseUuid;
  let user1CategoryUuid;
  let user1HouseholdUuid;
  let user1Uuid;
  let user1VendorUuid;
  let user2CategoryUuid;
  let user2HouseholdUuid;
  let user2VendorUuid;

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

  beforeEach('create user 1 category', async function() {
    const category = await models.Category.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.categories.category1.name,
    });
    user1CategoryUuid = category.get('uuid');
  });

  beforeEach('create user 1 vendor', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user1HouseholdUuid,
      name: sampleData.vendors.vendor1.name,
    });
    user1VendorUuid = vendor.get('uuid');
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

  beforeEach('create user 2 category', async function() {
    const category = await models.Category.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.categories.category2.name,
    });
    user2CategoryUuid = category.get('uuid');
  });

  beforeEach('create user 2 vendor', async function() {
    const vendor = await models.Vendor.create({
      household_uuid: user2HouseholdUuid,
      name: sampleData.vendors.vendor2.name,
    });
    user2VendorUuid = vendor.get('uuid');
  });

  afterEach('reset history for sinon spies', function() {
    trackChangesSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should reject with no expense UUID');

  it('should reject with no category UUID');

  it('should reject with no vendor UUID');

  it('should reject with no date');

  it('should reject with an invalid date');

  it('should reject with no amount');

  it('should reject with an invalid amount');

  it('should reject with no reimbursed amount');

  it('should reject with an invalid reimbursed amount');

  it('should reject with no description');

  it('should reject with an invalid description');

  it('should reject with no audit API call');

  it('should reject when the audit API call does not exist');

  it('should reject when the user does not exist');

  it('should reject when the expense does not exist');

  it('should reject when the expense belongs to a different household');

  // This should not happen.
  it('should reject when the expense category belongs to a different household');

  // This should not happen.
  it('should reject when the expense vendor belongs to a different household');

  it('should resolve with no updates');

  it('should resolve updating the amount');

  it('should resolve updating the date');

  it('should resolve updating the description');

  it('should resolve updating the reimbursed amount');

  it('should reject updating the category when the it does not exist');

  it('should reject updating the category when the it belongs to a different household');

  it('should resolve updating the category');

  it('should reject updating the vendor when it does not exist');

  it('should reject updating the vendor when it belongs to a different household');

  it('should resolve updating the vendor');
});
