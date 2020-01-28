const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /incomes/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1HouseholdMemberUuid;
  let user1IncomeUuid;
  let user1Token;
  let user1Uuid;
  let user2HouseholdMemberUuid;
  let user2Token;
  let user2Uuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  beforeEach('create user 1', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user1Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });
  });

  beforeEach('create user 1 token', async function() {
    user1Token = await controllers.UserCtrl.getToken(user1Uuid);
  });

  beforeEach('create user 1 household member', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1HouseholdMemberUuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user1.firstName,
    });
  });

  beforeEach('create user 1 income', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1IncomeUuid = await controllers.IncomeCtrl.createIncome({
      amountCents: sampleData.incomes.income1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income1.date,
      description: sampleData.incomes.income1.description,
      householdMemberUuid: user1HouseholdMemberUuid,
    });
  });

  beforeEach('create user 2', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user2Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user2.email,
      firstName: sampleData.users.user2.firstName,
      lastName: sampleData.users.user2.lastName,
      password: sampleData.users.user2.password,
    });
  });

  beforeEach('create user 2 token', async function() {
    user2Token = await controllers.UserCtrl.getToken(user2Uuid);
  });

  beforeEach('create user 2 household member', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    user2HouseholdMemberUuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user2.firstName,
    });
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 404 when the income is soft deleted', async function() {
    await models.Income.destroy({
      where: {
        uuid: user1IncomeUuid,
      },
    });
    const res = await chai.request(server)
      .get(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find income.',
      }],
    });
  });

  it('should return 404 when the income belongs to a different household', async function() {
    const res = await chai.request(server)
      .get(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find income.',
      }],
    });
  });

  // This should not happen.
  it('should return 404 when the income household member belongs to a different household', async function() {
    await models.Income.update({
      household_member_uuid: user2HouseholdMemberUuid,
    }, {
      where: {
        uuid: user1IncomeUuid,
      },
    });
    const res = await chai.request(server)
      .get(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find income.',
      }],
    });
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .get(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(
      parseFloat(res.body.data.attributes.amount),
      sampleData.incomes.income1.amount,
    );
    assert.strictEqual(res.body.data.attributes['amount-cents'], sampleData.incomes.income1.amount_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.date, sampleData.incomes.income1.date);
    assert.strictEqual(
      res.body.data.attributes.description,
      sampleData.incomes.income1.description,
    );
    assert.strictEqual(res.body.data.id, user1IncomeUuid);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships['household-member']);
    assert.isOk(res.body.data.relationships['household-member'].data);
    assert.strictEqual(res.body.data.relationships['household-member'].data.id, user1HouseholdMemberUuid);
    assert.strictEqual(res.body.data.type, 'incomes');
  });
});
