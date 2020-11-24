const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

const validateIncome = ({
  expectedIncome,
  householdMemberUuid,
  incomeUuid,
  returnedIncome,
}) => {
  assert.isOk(returnedIncome.attributes);
  assert.strictEqual(parseFloat(returnedIncome.attributes.amount), expectedIncome.amount_cents);
  assert.isOk(returnedIncome.attributes['created-at']);
  assert.strictEqual(returnedIncome.attributes.date, expectedIncome.date);
  assert.strictEqual(returnedIncome.id, incomeUuid);
  assert.isOk(returnedIncome.relationships);
  assert.isOk(returnedIncome.relationships['household-member']);
  assert.isOk(returnedIncome.relationships['household-member'].data);
  assert.strictEqual(returnedIncome.relationships['household-member'].data.id, householdMemberUuid);
  assert.strictEqual(returnedIncome.type, 'incomes');
};

chai.use(chaiHttp);

describe('Integration - GET /incomes', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1HouseholdMember1Uuid;
  let user1HouseholdMember2Uuid;
  let user1Income1Uuid;
  let user1Income2Uuid;
  let user1Income3Uuid;
  let user1Income4Uuid;
  let user1Income5Uuid;
  let user1Income6Uuid;
  let user1Income7Uuid;
  let user1Income8Uuid;
  let user1Income9Uuid;
  let user1Income10Uuid;
  let user1Income11Uuid;
  let user1Income12Uuid;
  let user1Income13Uuid;
  let user1Income14Uuid;
  let user1Income15Uuid;
  let user1Income16Uuid;
  let user1Income17Uuid;
  let user1Income18Uuid;
  let user1Income19Uuid;
  let user1Income20Uuid;
  let user1Income21Uuid;
  let user1Income22Uuid;
  let user1Income23Uuid;
  let user1Income24Uuid;
  let user1Income25Uuid;
  let user1Income26Uuid;
  let user1Income27Uuid;
  let user1Income28Uuid;
  let user1Token;
  let user1Uuid;
  let user2HouseholdMemberUuid;
  let user2IncomeUuid;
  let user2Token;
  let user2Uuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create user 1', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user1Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });
  });

  before('create user 1 token', async function() {
    user1Token = await controllers.UserCtrl.getToken(user1Uuid);
  });

  before('create user 1 household member 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1HouseholdMember1Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user1.firstName,
    });
  });

  before('create user 1 household member 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1HouseholdMember2Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user2.firstName,
    });
  });

  before('create user 1 income 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income1Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income1.date,
      description: sampleData.incomes.income1.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income2Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income2.date,
      description: sampleData.incomes.income2.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income3Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income3.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income3.date,
      description: sampleData.incomes.income3.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income4Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income4.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income4.date,
      description: sampleData.incomes.income4.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income5Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income5.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income5.date,
      description: sampleData.incomes.income5.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income6Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income6.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income6.date,
      description: sampleData.incomes.income6.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income7Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income7.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income7.date,
      description: sampleData.incomes.income7.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income8Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income8.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income8.date,
      description: sampleData.incomes.income8.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income9Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income9.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income9.date,
      description: sampleData.incomes.income9.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income10Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income10.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income10.date,
      description: sampleData.incomes.income10.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income11Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income11.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income11.date,
      description: sampleData.incomes.income11.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income12Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income12.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income12.date,
      description: sampleData.incomes.income12.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income13Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income13.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income13.date,
      description: sampleData.incomes.income13.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income14Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income14.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income14.date,
      description: sampleData.incomes.income14.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income15Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income15.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income15.date,
      description: sampleData.incomes.income15.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income16Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income16.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income16.date,
      description: sampleData.incomes.income16.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income17Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income17.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income17.date,
      description: sampleData.incomes.income17.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income18Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income18.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income18.date,
      description: sampleData.incomes.income18.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income19Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income19.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income19.date,
      description: sampleData.incomes.income19.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income20Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income20.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income20.date,
      description: sampleData.incomes.income20.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income21Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income21.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income21.date,
      description: sampleData.incomes.income21.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income22Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income22.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income22.date,
      description: sampleData.incomes.income22.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income23Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income23.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income23.date,
      description: sampleData.incomes.income23.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income24Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income24.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income24.date,
      description: sampleData.incomes.income24.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income25Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income25.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income25.date,
      description: sampleData.incomes.income25.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income26Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income26.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income26.date,
      description: sampleData.incomes.income26.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income27Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income27.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income27.date,
      description: sampleData.incomes.income27.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
    });
  });

  before('create user 1 income 28', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Income28Uuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income28.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income28.date,
      description: sampleData.incomes.income28.description,
      householdMemberUuid: user1HouseholdMember2Uuid,
    });
  });

  before('create user 2', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user2Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user2.email,
      firstName: sampleData.users.user2.firstName,
      lastName: sampleData.users.user2.lastName,
      password: sampleData.users.user2.password,
    });
  });

  before('create user 2 token', async function() {
    user2Token = await controllers.UserCtrl.getToken(user2Uuid);
  });

  before('create user 2 household member', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    user2HouseholdMemberUuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user3.firstName,
    });
  });

  before('create user 2 income', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    user2IncomeUuid = await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income29.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.incomes.income29.date,
      description: sampleData.incomes.income29.description,
      householdMemberUuid: user2HouseholdMemberUuid,
    });
  });

  after('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get('/incomes')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 200 and 25 incomes as user 1 with no limit or page specified', async function() {
    const res = await chai.request(server)
      .get('/incomes')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 25);

    // Income 28
    validateIncome({
      expectedIncome: sampleData.incomes.income28,
      householdMemberUuid: user1HouseholdMember2Uuid,
      incomeUuid: user1Income28Uuid,
      returnedIncome: res.body.data[0],
    });

    // Income 27
    validateIncome({
      expectedIncome: sampleData.incomes.income27,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income27Uuid,
      returnedIncome: res.body.data[1],
    });

    // Income 26
    validateIncome({
      expectedIncome: sampleData.incomes.income26,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income26Uuid,
      returnedIncome: res.body.data[2],
    });

    // Income 25
    validateIncome({
      expectedIncome: sampleData.incomes.income25,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income25Uuid,
      returnedIncome: res.body.data[3],
    });

    // Income 24
    validateIncome({
      expectedIncome: sampleData.incomes.income24,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income24Uuid,
      returnedIncome: res.body.data[4],
    });

    // Income 23
    validateIncome({
      expectedIncome: sampleData.incomes.income23,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income23Uuid,
      returnedIncome: res.body.data[5],
    });

    // Income 22
    validateIncome({
      expectedIncome: sampleData.incomes.income22,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income22Uuid,
      returnedIncome: res.body.data[6],
    });

    // Income 21
    validateIncome({
      expectedIncome: sampleData.incomes.income21,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income21Uuid,
      returnedIncome: res.body.data[7],
    });

    // Income 20
    validateIncome({
      expectedIncome: sampleData.incomes.income20,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income20Uuid,
      returnedIncome: res.body.data[8],
    });

    // Income 19
    validateIncome({
      expectedIncome: sampleData.incomes.income19,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income19Uuid,
      returnedIncome: res.body.data[9],
    });

    // Income 18
    validateIncome({
      expectedIncome: sampleData.incomes.income18,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income18Uuid,
      returnedIncome: res.body.data[10],
    });

    // Income 17
    validateIncome({
      expectedIncome: sampleData.incomes.income17,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income17Uuid,
      returnedIncome: res.body.data[11],
    });

    // Income 16
    validateIncome({
      expectedIncome: sampleData.incomes.income16,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income16Uuid,
      returnedIncome: res.body.data[12],
    });

    // Income 15
    validateIncome({
      expectedIncome: sampleData.incomes.income15,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income15Uuid,
      returnedIncome: res.body.data[13],
    });

    // Income 14
    validateIncome({
      expectedIncome: sampleData.incomes.income14,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income14Uuid,
      returnedIncome: res.body.data[14],
    });

    // Income 13
    validateIncome({
      expectedIncome: sampleData.incomes.income13,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income13Uuid,
      returnedIncome: res.body.data[15],
    });

    // Income 12
    validateIncome({
      expectedIncome: sampleData.incomes.income12,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income12Uuid,
      returnedIncome: res.body.data[16],
    });

    // Income 11
    validateIncome({
      expectedIncome: sampleData.incomes.income11,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income11Uuid,
      returnedIncome: res.body.data[17],
    });

    // Income 10
    validateIncome({
      expectedIncome: sampleData.incomes.income10,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income10Uuid,
      returnedIncome: res.body.data[18],
    });

    // Income 9
    validateIncome({
      expectedIncome: sampleData.incomes.income9,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income9Uuid,
      returnedIncome: res.body.data[19],
    });

    // Income 8
    validateIncome({
      expectedIncome: sampleData.incomes.income8,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income8Uuid,
      returnedIncome: res.body.data[20],
    });

    // Income 7
    validateIncome({
      expectedIncome: sampleData.incomes.income7,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income7Uuid,
      returnedIncome: res.body.data[21],
    });

    // Income 6
    validateIncome({
      expectedIncome: sampleData.incomes.income6,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income6Uuid,
      returnedIncome: res.body.data[22],
    });

    // Income 5
    validateIncome({
      expectedIncome: sampleData.incomes.income5,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income5Uuid,
      returnedIncome: res.body.data[23],
    });

    // Income 4
    validateIncome({
      expectedIncome: sampleData.incomes.income4,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income4Uuid,
      returnedIncome: res.body.data[24],
    });

    assert.isOk(res.body.included);
    const householdMember1Include = _.find(res.body.included, (include) => {
      return include.id === user1HouseholdMember1Uuid
        && include.type === 'household-members';
    });
    assert.isOk(householdMember1Include);
    assert.isOk(householdMember1Include.attributes);
    assert.strictEqual(householdMember1Include.attributes.name, sampleData.users.user1.firstName);
    const householdMember2Include = _.find(res.body.included, (include) => {
      return include.id === user1HouseholdMember2Uuid
        && include.type === 'household-members';
    });
    assert.isOk(householdMember2Include);
    assert.isOk(householdMember2Include.attributes);
    assert.strictEqual(householdMember2Include.attributes.name, sampleData.users.user2.firstName);
    assert.strictEqual(res.body.included.length, 2);

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 28);
  });

  it('should return 200 and 3 incomes as user 1 with no limit and page=2', async function() {
    const res = await chai.request(server)
      .get('/incomes?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 3);

    // Income 3
    validateIncome({
      expectedIncome: sampleData.incomes.income3,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income3Uuid,
      returnedIncome: res.body.data[0],
    });

    // Income 2
    validateIncome({
      expectedIncome: sampleData.incomes.income2,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income2Uuid,
      returnedIncome: res.body.data[1],
    });

    // Income 1
    validateIncome({
      expectedIncome: sampleData.incomes.income1,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income1Uuid,
      returnedIncome: res.body.data[2],
    });

    assert.isOk(res.body.included);
    const householdMember1Include = _.find(res.body.included, (include) => {
      return include.id === user1HouseholdMember1Uuid
        && include.type === 'household-members';
    });
    assert.isOk(householdMember1Include);
    assert.isOk(householdMember1Include.attributes);
    assert.strictEqual(householdMember1Include.attributes.name, sampleData.users.user1.firstName);
    assert.strictEqual(res.body.included.length, 1);

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 28);
  });

  it('should return 200 and 5 incomes as user 1 with limit=5 and page=4', async function() {
    const res = await chai.request(server)
      .get('/incomes?limit=5&page=4')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 5);

    // Income 13
    validateIncome({
      expectedIncome: sampleData.incomes.income13,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income13Uuid,
      returnedIncome: res.body.data[0],
    });

    // Income 12
    validateIncome({
      expectedIncome: sampleData.incomes.income12,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income12Uuid,
      returnedIncome: res.body.data[1],
    });

    // Income 11
    validateIncome({
      expectedIncome: sampleData.incomes.income11,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income11Uuid,
      returnedIncome: res.body.data[2],
    });

    // Income 10
    validateIncome({
      expectedIncome: sampleData.incomes.income10,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income10Uuid,
      returnedIncome: res.body.data[3],
    });

    // Income 9
    validateIncome({
      expectedIncome: sampleData.incomes.income9,
      householdMemberUuid: user1HouseholdMember1Uuid,
      incomeUuid: user1Income9Uuid,
      returnedIncome: res.body.data[4],
    });

    assert.isOk(res.body.included);
    const householdMember1Include = _.find(res.body.included, (include) => {
      return include.id === user1HouseholdMember1Uuid
        && include.type === 'household-members';
    });
    assert.isOk(householdMember1Include);
    assert.isOk(householdMember1Include.attributes);
    assert.strictEqual(householdMember1Include.attributes.name, sampleData.users.user1.firstName);
    assert.strictEqual(res.body.included.length, 1);

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 6);
    assert.strictEqual(res.body.meta.total, 28);
  });

  it('should return 200 and 1 income as user 2', async function() {
    const res = await chai.request(server)
      .get('/incomes')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 1);

    validateIncome({
      expectedIncome: sampleData.incomes.income29,
      householdMemberUuid: user2HouseholdMemberUuid,
      incomeUuid: user2IncomeUuid,
      returnedIncome: res.body.data[0],
    });

    assert.isOk(res.body.included);
    const householdMemberInclude = _.find(res.body.included, (include) => {
      return include.id === user2HouseholdMemberUuid
        && include.type === 'household-members';
    });
    assert.isOk(householdMemberInclude);
    assert.isOk(householdMemberInclude.attributes);
    assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user3.firstName);
    assert.strictEqual(res.body.included.length, 1);

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });

  describe('when called with the household_member_id query param', function() {
    it('should return 404 when the household member does not exist', async function() {
      const res = await chai.request(server)
        .get(`/incomes?household_member_id=${uuidv4()}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find member.',
        }],
      });
    });

    it('should return 200 and 25 incomes as user 1 with household member 1 with no limit or page specified', async function() {
      const res = await chai.request(server)
        .get(`/incomes?household_member_id=${user1HouseholdMember1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 25);

      // Income 27
      validateIncome({
        expectedIncome: sampleData.incomes.income27,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income27Uuid,
        returnedIncome: res.body.data[0],
      });

      // Income 26
      validateIncome({
        expectedIncome: sampleData.incomes.income26,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income26Uuid,
        returnedIncome: res.body.data[1],
      });

      // Income 25
      validateIncome({
        expectedIncome: sampleData.incomes.income25,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income25Uuid,
        returnedIncome: res.body.data[2],
      });

      // Income 24
      validateIncome({
        expectedIncome: sampleData.incomes.income24,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income24Uuid,
        returnedIncome: res.body.data[3],
      });

      // Income 23
      validateIncome({
        expectedIncome: sampleData.incomes.income23,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income23Uuid,
        returnedIncome: res.body.data[4],
      });

      // Income 22
      validateIncome({
        expectedIncome: sampleData.incomes.income22,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income22Uuid,
        returnedIncome: res.body.data[5],
      });

      // Income 21
      validateIncome({
        expectedIncome: sampleData.incomes.income21,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income21Uuid,
        returnedIncome: res.body.data[6],
      });

      // Income 20
      validateIncome({
        expectedIncome: sampleData.incomes.income20,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income20Uuid,
        returnedIncome: res.body.data[7],
      });

      // Income 19
      validateIncome({
        expectedIncome: sampleData.incomes.income19,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income19Uuid,
        returnedIncome: res.body.data[8],
      });

      // Income 18
      validateIncome({
        expectedIncome: sampleData.incomes.income18,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income18Uuid,
        returnedIncome: res.body.data[9],
      });

      // Income 17
      validateIncome({
        expectedIncome: sampleData.incomes.income17,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income17Uuid,
        returnedIncome: res.body.data[10],
      });

      // Income 16
      validateIncome({
        expectedIncome: sampleData.incomes.income16,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income16Uuid,
        returnedIncome: res.body.data[11],
      });

      // Income 15
      validateIncome({
        expectedIncome: sampleData.incomes.income15,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income15Uuid,
        returnedIncome: res.body.data[12],
      });

      // Income 14
      validateIncome({
        expectedIncome: sampleData.incomes.income14,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income14Uuid,
        returnedIncome: res.body.data[13],
      });

      // Income 13
      validateIncome({
        expectedIncome: sampleData.incomes.income13,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income13Uuid,
        returnedIncome: res.body.data[14],
      });

      // Income 12
      validateIncome({
        expectedIncome: sampleData.incomes.income12,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income12Uuid,
        returnedIncome: res.body.data[15],
      });

      // Income 11
      validateIncome({
        expectedIncome: sampleData.incomes.income11,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income11Uuid,
        returnedIncome: res.body.data[16],
      });

      // Income 10
      validateIncome({
        expectedIncome: sampleData.incomes.income10,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income10Uuid,
        returnedIncome: res.body.data[17],
      });

      // Income 9
      validateIncome({
        expectedIncome: sampleData.incomes.income9,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income9Uuid,
        returnedIncome: res.body.data[18],
      });

      // Income 8
      validateIncome({
        expectedIncome: sampleData.incomes.income8,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income8Uuid,
        returnedIncome: res.body.data[19],
      });

      // Income 7
      validateIncome({
        expectedIncome: sampleData.incomes.income7,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income7Uuid,
        returnedIncome: res.body.data[20],
      });

      // Income 6
      validateIncome({
        expectedIncome: sampleData.incomes.income6,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income6Uuid,
        returnedIncome: res.body.data[21],
      });

      // Income 5
      validateIncome({
        expectedIncome: sampleData.incomes.income5,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income5Uuid,
        returnedIncome: res.body.data[22],
      });

      // Income 4
      validateIncome({
        expectedIncome: sampleData.incomes.income4,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income4Uuid,
        returnedIncome: res.body.data[23],
      });

      // Income 3
      validateIncome({
        expectedIncome: sampleData.incomes.income3,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income3Uuid,
        returnedIncome: res.body.data[24],
      });

      assert.isOk(res.body.included);
      const householdMember1Include = _.find(res.body.included, (include) => {
        return include.id === user1HouseholdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMember1Include);
      assert.isOk(householdMember1Include.attributes);
      assert.strictEqual(householdMember1Include.attributes.name, sampleData.users.user1.firstName);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 2 income as user 1 with household member 1 and no limit and page=2', async function() {
      const res = await chai.request(server)
        .get(`/incomes?household_member_id=${user1HouseholdMember1Uuid}&page=2`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);

      // Income 2
      validateIncome({
        expectedIncome: sampleData.incomes.income2,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income2Uuid,
        returnedIncome: res.body.data[0],
      });

      // Income 1
      validateIncome({
        expectedIncome: sampleData.incomes.income1,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income1Uuid,
        returnedIncome: res.body.data[1],
      });

      assert.isOk(res.body.included);
      const householdMember1Include = _.find(res.body.included, (include) => {
        return include.id === user1HouseholdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMember1Include);
      assert.isOk(householdMember1Include.attributes);
      assert.strictEqual(householdMember1Include.attributes.name, sampleData.users.user1.firstName);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 5 incomes as user 1 with household member 1 and limit=5 and page=4', async function() {
      const res = await chai.request(server)
        .get(`/incomes?household_member_id=${user1HouseholdMember1Uuid}&limit=5&page=4`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 5);

      // Income 12
      validateIncome({
        expectedIncome: sampleData.incomes.income12,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income12Uuid,
        returnedIncome: res.body.data[0],
      });

      // Income 11
      validateIncome({
        expectedIncome: sampleData.incomes.income11,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income11Uuid,
        returnedIncome: res.body.data[1],
      });

      // Income 10
      validateIncome({
        expectedIncome: sampleData.incomes.income10,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income10Uuid,
        returnedIncome: res.body.data[2],
      });

      // Income 9
      validateIncome({
        expectedIncome: sampleData.incomes.income9,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income9Uuid,
        returnedIncome: res.body.data[3],
      });

      // Income 8
      validateIncome({
        expectedIncome: sampleData.incomes.income8,
        householdMemberUuid: user1HouseholdMember1Uuid,
        incomeUuid: user1Income8Uuid,
        returnedIncome: res.body.data[4],
      });

      assert.isOk(res.body.included);
      const householdMember1Include = _.find(res.body.included, (include) => {
        return include.id === user1HouseholdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMember1Include);
      assert.isOk(householdMember1Include.attributes);
      assert.strictEqual(householdMember1Include.attributes.name, sampleData.users.user1.firstName);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 6);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 1 income as user 1 with household member 2', async function() {
      const res = await chai.request(server)
        .get(`/incomes?household_member_id=${user1HouseholdMember2Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);

      // Income 28
      validateIncome({
        expectedIncome: sampleData.incomes.income28,
        householdMemberUuid: user1HouseholdMember2Uuid,
        incomeUuid: user1Income28Uuid,
        returnedIncome: res.body.data[0],
      });

      assert.isOk(res.body.included);
      const householdMember2Include = _.find(res.body.included, (include) => {
        return include.id === user1HouseholdMember2Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMember2Include);
      assert.isOk(householdMember2Include.attributes);
      assert.strictEqual(householdMember2Include.attributes.name, sampleData.users.user2.firstName);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 1);
    });

    it('should return 404 as user 2 with household member 1', async function() {
      const res = await chai.request(server)
        .get(`/incomes?household_member_id=${user1HouseholdMember1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user2Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find member.',
        }],
      });
    });
  });
});
