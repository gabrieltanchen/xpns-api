const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

const validateDeposit = ({
  depositUuid,
  expectedDeposit,
  fundUuid,
  returnedDeposit,
}) => {
  assert.isOk(returnedDeposit.attributes);
  assert.strictEqual(returnedDeposit.attributes.amount, expectedDeposit.amount_cents);
  assert.isOk(returnedDeposit.attributes['created-at']);
  assert.strictEqual(returnedDeposit.attributes.date, expectedDeposit.date);
  assert.strictEqual(returnedDeposit.id, depositUuid);
  assert.isOk(returnedDeposit.relationships);
  assert.isOk(returnedDeposit.relationships.fund);
  assert.isOk(returnedDeposit.relationships.fund.data);
  assert.strictEqual(returnedDeposit.relationships.fund.data.id, fundUuid);
  assert.strictEqual(returnedDeposit.relationships.fund.data.type, 'funds');
  assert.strictEqual(returnedDeposit.type, 'deposits');
};

chai.use(chaiHttp);

describe('Integration - GET /deposits', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let deposit1Uuid;
  let deposit2Uuid;
  let deposit3Uuid;
  let deposit4Uuid;
  let deposit5Uuid;
  let deposit6Uuid;
  let deposit7Uuid;
  let deposit8Uuid;
  let deposit9Uuid;
  let deposit10Uuid;
  let deposit11Uuid;
  let deposit12Uuid;
  let deposit13Uuid;
  let deposit14Uuid;
  let deposit15Uuid;
  let deposit16Uuid;
  let deposit17Uuid;
  let deposit18Uuid;
  let deposit19Uuid;
  let deposit20Uuid;
  let deposit21Uuid;
  let deposit22Uuid;
  let deposit23Uuid;
  let deposit24Uuid;
  let deposit25Uuid;
  let deposit26Uuid;
  let deposit27Uuid;
  let deposit28Uuid;
  let user1Fund1Uuid;
  let user1Fund2Uuid;
  let user1Token;
  let user1Uuid;
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

  before('create user 1 fund 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Fund1Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund1.name,
    });
  });

  before('create user 1 fund 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Fund2Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund2.name,
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

  before('create deposit 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit1Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit1.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit2Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit2.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit3Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit3.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit3.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit4Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit4.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit4.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit5Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit5.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit5.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit6Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit6.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit6.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit7Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit7.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit7.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit8Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit8.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit8.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit9Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit9.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit9.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit10Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit10.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit10.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit11Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit11.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit11.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit12Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit12.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit12.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit13Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit13.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit13.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit14Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit14.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit14.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit15Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit15.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit15.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit16Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit16.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit16.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit17Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit17.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit17.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit18Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit18.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit18.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit19Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit19.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit19.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit20Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit20.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit20.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit21Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit21.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit21.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit22Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit22.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit22.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit23Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit23.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit23.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit24Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit24.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit24.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit25Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit25.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit25.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit26Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit26.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit26.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit27Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit27.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit27.date,
      fundUuid: user1Fund1Uuid,
    });
  });

  before('create deposit 28', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    deposit28Uuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit28.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit28.date,
      fundUuid: user1Fund2Uuid,
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
      .get('/deposits')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 403 with no fund id', async function() {
    const res = await chai.request(server)
      .get('/deposits')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(403);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Fund ID is required.',
      }],
    });
  });

  describe('when called with the fund_id query param', function() {
    it('should return 404 when the fund does not exist', async function() {
      const res = await chai.request(server)
        .get(`/deposits?fund_id=${uuidv4()}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find fund.',
        }],
      });
    });

    it('should return 404 when the fund belongs to a different household', async function() {
      const res = await chai.request(server)
        .get(`/deposits?fund_id=${user1Fund1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user2Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find fund.',
        }],
      });
    });

    it('should return 200 and 25 deposits as user 1 with fund 1 and no limit or page specified', async function() {
      const res = await chai.request(server)
        .get(`/deposits?fund_id=${user1Fund1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 25);

      // Deposit 27
      validateDeposit({
        depositUuid: deposit27Uuid,
        expectedDeposit: sampleData.deposits.deposit27,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[0],
      });

      // Deposit 26
      validateDeposit({
        depositUuid: deposit26Uuid,
        expectedDeposit: sampleData.deposits.deposit26,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[1],
      });

      // Deposit 25
      validateDeposit({
        depositUuid: deposit25Uuid,
        expectedDeposit: sampleData.deposits.deposit25,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[2],
      });

      // Deposit 24
      validateDeposit({
        depositUuid: deposit24Uuid,
        expectedDeposit: sampleData.deposits.deposit24,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[3],
      });

      // Deposit 23
      validateDeposit({
        depositUuid: deposit23Uuid,
        expectedDeposit: sampleData.deposits.deposit23,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[4],
      });

      // Deposit 22
      validateDeposit({
        depositUuid: deposit22Uuid,
        expectedDeposit: sampleData.deposits.deposit22,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[5],
      });

      // Deposit 21
      validateDeposit({
        depositUuid: deposit21Uuid,
        expectedDeposit: sampleData.deposits.deposit21,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[6],
      });

      // Deposit 20
      validateDeposit({
        depositUuid: deposit20Uuid,
        expectedDeposit: sampleData.deposits.deposit20,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[7],
      });

      // Deposit 19
      validateDeposit({
        depositUuid: deposit19Uuid,
        expectedDeposit: sampleData.deposits.deposit19,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[8],
      });

      // Deposit 18
      validateDeposit({
        depositUuid: deposit18Uuid,
        expectedDeposit: sampleData.deposits.deposit18,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[9],
      });

      // Deposit 17
      validateDeposit({
        depositUuid: deposit17Uuid,
        expectedDeposit: sampleData.deposits.deposit17,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[10],
      });

      // Deposit 16
      validateDeposit({
        depositUuid: deposit16Uuid,
        expectedDeposit: sampleData.deposits.deposit16,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[11],
      });

      // Deposit 15
      validateDeposit({
        depositUuid: deposit15Uuid,
        expectedDeposit: sampleData.deposits.deposit15,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[12],
      });

      // Deposit 14
      validateDeposit({
        depositUuid: deposit14Uuid,
        expectedDeposit: sampleData.deposits.deposit14,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[13],
      });

      // Deposit 13
      validateDeposit({
        depositUuid: deposit13Uuid,
        expectedDeposit: sampleData.deposits.deposit13,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[14],
      });

      // Deposit 12
      validateDeposit({
        depositUuid: deposit12Uuid,
        expectedDeposit: sampleData.deposits.deposit12,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[15],
      });

      // Deposit 11
      validateDeposit({
        depositUuid: deposit11Uuid,
        expectedDeposit: sampleData.deposits.deposit11,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[16],
      });

      // Deposit 10
      validateDeposit({
        depositUuid: deposit10Uuid,
        expectedDeposit: sampleData.deposits.deposit10,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[17],
      });

      // Deposit 9
      validateDeposit({
        depositUuid: deposit9Uuid,
        expectedDeposit: sampleData.deposits.deposit9,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[18],
      });

      // Deposit 8
      validateDeposit({
        depositUuid: deposit8Uuid,
        expectedDeposit: sampleData.deposits.deposit8,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[19],
      });

      // Deposit 7
      validateDeposit({
        depositUuid: deposit7Uuid,
        expectedDeposit: sampleData.deposits.deposit7,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[20],
      });

      // Deposit 6
      validateDeposit({
        depositUuid: deposit6Uuid,
        expectedDeposit: sampleData.deposits.deposit6,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[21],
      });

      // Deposit 5
      validateDeposit({
        depositUuid: deposit5Uuid,
        expectedDeposit: sampleData.deposits.deposit5,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[22],
      });

      // Deposit 4
      validateDeposit({
        depositUuid: deposit4Uuid,
        expectedDeposit: sampleData.deposits.deposit4,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[23],
      });

      // Deposit 3
      validateDeposit({
        depositUuid: deposit3Uuid,
        expectedDeposit: sampleData.deposits.deposit3,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[24],
      });

      assert.isOk(res.body.included);
      const fundInclude = _.find(res.body.included, (include) => {
        return include.id === user1Fund1Uuid
          && include.type === 'funds';
      });
      assert.isOk(fundInclude);
      assert.isOk(fundInclude.attributes);
      assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 2 deposits as user 1 with fund 1 and no limit and page=2', async function() {
      const res = await chai.request(server)
        .get(`/deposits?fund_id=${user1Fund1Uuid}&page=2`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);

      // Deposit 2
      validateDeposit({
        depositUuid: deposit2Uuid,
        expectedDeposit: sampleData.deposits.deposit2,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[0],
      });

      // Deposit 1
      validateDeposit({
        depositUuid: deposit1Uuid,
        expectedDeposit: sampleData.deposits.deposit1,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[1],
      });

      assert.isOk(res.body.included);
      const fundInclude = _.find(res.body.included, (include) => {
        return include.id === user1Fund1Uuid
          && include.type === 'funds';
      });
      assert.isOk(fundInclude);
      assert.isOk(fundInclude.attributes);
      assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 5 deposits as user 1 with fund 1 limit=5 and page=4', async function() {
      const res = await chai.request(server)
        .get(`/deposits?fund_id=${user1Fund1Uuid}&limit=5&page=4`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 5);

      // Deposit 12
      validateDeposit({
        depositUuid: deposit12Uuid,
        expectedDeposit: sampleData.deposits.deposit12,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[0],
      });

      // Deposit 11
      validateDeposit({
        depositUuid: deposit11Uuid,
        expectedDeposit: sampleData.deposits.deposit11,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[1],
      });

      // Deposit 10
      validateDeposit({
        depositUuid: deposit10Uuid,
        expectedDeposit: sampleData.deposits.deposit10,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[2],
      });

      // Deposit 9
      validateDeposit({
        depositUuid: deposit9Uuid,
        expectedDeposit: sampleData.deposits.deposit9,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[3],
      });

      // Deposit 8
      validateDeposit({
        depositUuid: deposit8Uuid,
        expectedDeposit: sampleData.deposits.deposit8,
        fundUuid: user1Fund1Uuid,
        returnedDeposit: res.body.data[4],
      });

      assert.isOk(res.body.included);
      const fundInclude = _.find(res.body.included, (include) => {
        return include.id === user1Fund1Uuid
          && include.type === 'funds';
      });
      assert.isOk(fundInclude);
      assert.isOk(fundInclude.attributes);
      assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 6);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 1 deposit as user 1 with fund 2', async function() {
      const res = await chai.request(server)
        .get(`/deposits?fund_id=${user1Fund2Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);

      // Deposit 28
      validateDeposit({
        depositUuid: deposit28Uuid,
        expectedDeposit: sampleData.deposits.deposit28,
        fundUuid: user1Fund2Uuid,
        returnedDeposit: res.body.data[0],
      });

      assert.isOk(res.body.included);
      const fundInclude = _.find(res.body.included, (include) => {
        return include.id === user1Fund2Uuid
          && include.type === 'funds';
      });
      assert.isOk(fundInclude);
      assert.isOk(fundInclude.attributes);
      assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund2.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 1);
    });

    describe('with fund 1 and sort=date and sortDirection=asc', function() {
      it('should return 200 and 25 deposits as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=date&sortDirection=asc`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 25);

        // Deposit 1
        validateDeposit({
          depositUuid: deposit1Uuid,
          expectedDeposit: sampleData.deposits.deposit1,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 2
        validateDeposit({
          depositUuid: deposit2Uuid,
          expectedDeposit: sampleData.deposits.deposit2,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        // Deposit 3
        validateDeposit({
          depositUuid: deposit3Uuid,
          expectedDeposit: sampleData.deposits.deposit3,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[2],
        });

        // Deposit 4
        validateDeposit({
          depositUuid: deposit4Uuid,
          expectedDeposit: sampleData.deposits.deposit4,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[3],
        });

        // Deposit 5
        validateDeposit({
          depositUuid: deposit5Uuid,
          expectedDeposit: sampleData.deposits.deposit5,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[4],
        });

        // Deposit 6
        validateDeposit({
          depositUuid: deposit6Uuid,
          expectedDeposit: sampleData.deposits.deposit6,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[5],
        });

        // Deposit 7
        validateDeposit({
          depositUuid: deposit7Uuid,
          expectedDeposit: sampleData.deposits.deposit7,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[6],
        });

        // Deposit 8
        validateDeposit({
          depositUuid: deposit8Uuid,
          expectedDeposit: sampleData.deposits.deposit8,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[7],
        });

        // Deposit 9
        validateDeposit({
          depositUuid: deposit9Uuid,
          expectedDeposit: sampleData.deposits.deposit9,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[8],
        });

        // Deposit 10
        validateDeposit({
          depositUuid: deposit10Uuid,
          expectedDeposit: sampleData.deposits.deposit10,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[9],
        });

        // Deposit 11
        validateDeposit({
          depositUuid: deposit11Uuid,
          expectedDeposit: sampleData.deposits.deposit11,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[10],
        });

        // Deposit 12
        validateDeposit({
          depositUuid: deposit12Uuid,
          expectedDeposit: sampleData.deposits.deposit12,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[11],
        });

        // Deposit 13
        validateDeposit({
          depositUuid: deposit13Uuid,
          expectedDeposit: sampleData.deposits.deposit13,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[12],
        });

        // Deposit 14
        validateDeposit({
          depositUuid: deposit14Uuid,
          expectedDeposit: sampleData.deposits.deposit14,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[13],
        });

        // Deposit 15
        validateDeposit({
          depositUuid: deposit15Uuid,
          expectedDeposit: sampleData.deposits.deposit15,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[14],
        });

        // Deposit 16
        validateDeposit({
          depositUuid: deposit16Uuid,
          expectedDeposit: sampleData.deposits.deposit16,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[15],
        });

        // Deposit 17
        validateDeposit({
          depositUuid: deposit17Uuid,
          expectedDeposit: sampleData.deposits.deposit17,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[16],
        });

        // Deposit 18
        validateDeposit({
          depositUuid: deposit18Uuid,
          expectedDeposit: sampleData.deposits.deposit18,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[17],
        });

        // Deposit 19
        validateDeposit({
          depositUuid: deposit19Uuid,
          expectedDeposit: sampleData.deposits.deposit19,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[18],
        });

        // Deposit 20
        validateDeposit({
          depositUuid: deposit20Uuid,
          expectedDeposit: sampleData.deposits.deposit20,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[19],
        });

        // Deposit 21
        validateDeposit({
          depositUuid: deposit21Uuid,
          expectedDeposit: sampleData.deposits.deposit21,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[20],
        });

        // Deposit 22
        validateDeposit({
          depositUuid: deposit22Uuid,
          expectedDeposit: sampleData.deposits.deposit22,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[21],
        });

        // Deposit 23
        validateDeposit({
          depositUuid: deposit23Uuid,
          expectedDeposit: sampleData.deposits.deposit23,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[22],
        });

        // Deposit 24
        validateDeposit({
          depositUuid: deposit24Uuid,
          expectedDeposit: sampleData.deposits.deposit24,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[23],
        });

        // Deposit 25
        validateDeposit({
          depositUuid: deposit25Uuid,
          expectedDeposit: sampleData.deposits.deposit25,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[24],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 2 deposits as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=date&sortDirection=asc&page=2`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 2);

        // Deposit 26
        validateDeposit({
          depositUuid: deposit26Uuid,
          expectedDeposit: sampleData.deposits.deposit26,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 27
        validateDeposit({
          depositUuid: deposit27Uuid,
          expectedDeposit: sampleData.deposits.deposit27,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 5 deposits as user 1 with limit=5 and page=4', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=date&sortDirection=asc&limit=5&page=4`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 5);

        // Deposit 16
        validateDeposit({
          depositUuid: deposit16Uuid,
          expectedDeposit: sampleData.deposits.deposit16,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 17
        validateDeposit({
          depositUuid: deposit17Uuid,
          expectedDeposit: sampleData.deposits.deposit17,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        // Deposit 18
        validateDeposit({
          depositUuid: deposit18Uuid,
          expectedDeposit: sampleData.deposits.deposit18,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[2],
        });

        // Deposit 19
        validateDeposit({
          depositUuid: deposit19Uuid,
          expectedDeposit: sampleData.deposits.deposit19,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[3],
        });

        // Deposit 20
        validateDeposit({
          depositUuid: deposit20Uuid,
          expectedDeposit: sampleData.deposits.deposit20,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[4],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 6);
        assert.strictEqual(res.body.meta.total, 27);
      });
    });

    describe('with fund 1 and sort=date and sortDirection=desc', function() {
      it('should return 200 and 25 deposits as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=date&sortDirection=desc`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 25);

        // Deposit 27
        validateDeposit({
          depositUuid: deposit27Uuid,
          expectedDeposit: sampleData.deposits.deposit27,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 26
        validateDeposit({
          depositUuid: deposit26Uuid,
          expectedDeposit: sampleData.deposits.deposit26,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        // Deposit 25
        validateDeposit({
          depositUuid: deposit25Uuid,
          expectedDeposit: sampleData.deposits.deposit25,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[2],
        });

        // Deposit 24
        validateDeposit({
          depositUuid: deposit24Uuid,
          expectedDeposit: sampleData.deposits.deposit24,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[3],
        });

        // Deposit 23
        validateDeposit({
          depositUuid: deposit23Uuid,
          expectedDeposit: sampleData.deposits.deposit23,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[4],
        });

        // Deposit 22
        validateDeposit({
          depositUuid: deposit22Uuid,
          expectedDeposit: sampleData.deposits.deposit22,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[5],
        });

        // Deposit 21
        validateDeposit({
          depositUuid: deposit21Uuid,
          expectedDeposit: sampleData.deposits.deposit21,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[6],
        });

        // Deposit 20
        validateDeposit({
          depositUuid: deposit20Uuid,
          expectedDeposit: sampleData.deposits.deposit20,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[7],
        });

        // Deposit 19
        validateDeposit({
          depositUuid: deposit19Uuid,
          expectedDeposit: sampleData.deposits.deposit19,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[8],
        });

        // Deposit 18
        validateDeposit({
          depositUuid: deposit18Uuid,
          expectedDeposit: sampleData.deposits.deposit18,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[9],
        });

        // Deposit 17
        validateDeposit({
          depositUuid: deposit17Uuid,
          expectedDeposit: sampleData.deposits.deposit17,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[10],
        });

        // Deposit 16
        validateDeposit({
          depositUuid: deposit16Uuid,
          expectedDeposit: sampleData.deposits.deposit16,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[11],
        });

        // Deposit 15
        validateDeposit({
          depositUuid: deposit15Uuid,
          expectedDeposit: sampleData.deposits.deposit15,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[12],
        });

        // Deposit 14
        validateDeposit({
          depositUuid: deposit14Uuid,
          expectedDeposit: sampleData.deposits.deposit14,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[13],
        });

        // Deposit 13
        validateDeposit({
          depositUuid: deposit13Uuid,
          expectedDeposit: sampleData.deposits.deposit13,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[14],
        });

        // Deposit 12
        validateDeposit({
          depositUuid: deposit12Uuid,
          expectedDeposit: sampleData.deposits.deposit12,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[15],
        });

        // Deposit 11
        validateDeposit({
          depositUuid: deposit11Uuid,
          expectedDeposit: sampleData.deposits.deposit11,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[16],
        });

        // Deposit 10
        validateDeposit({
          depositUuid: deposit10Uuid,
          expectedDeposit: sampleData.deposits.deposit10,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[17],
        });

        // Deposit 9
        validateDeposit({
          depositUuid: deposit9Uuid,
          expectedDeposit: sampleData.deposits.deposit9,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[18],
        });

        // Deposit 8
        validateDeposit({
          depositUuid: deposit8Uuid,
          expectedDeposit: sampleData.deposits.deposit8,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[19],
        });

        // Deposit 7
        validateDeposit({
          depositUuid: deposit7Uuid,
          expectedDeposit: sampleData.deposits.deposit7,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[20],
        });

        // Deposit 6
        validateDeposit({
          depositUuid: deposit6Uuid,
          expectedDeposit: sampleData.deposits.deposit6,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[21],
        });

        // Deposit 5
        validateDeposit({
          depositUuid: deposit5Uuid,
          expectedDeposit: sampleData.deposits.deposit5,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[22],
        });

        // Deposit 4
        validateDeposit({
          depositUuid: deposit4Uuid,
          expectedDeposit: sampleData.deposits.deposit4,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[23],
        });

        // Deposit 3
        validateDeposit({
          depositUuid: deposit3Uuid,
          expectedDeposit: sampleData.deposits.deposit3,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[24],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 2 deposits as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=date&sortDirection=desc&page=2`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 2);

        // Deposit 2
        validateDeposit({
          depositUuid: deposit2Uuid,
          expectedDeposit: sampleData.deposits.deposit2,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 1
        validateDeposit({
          depositUuid: deposit1Uuid,
          expectedDeposit: sampleData.deposits.deposit1,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 5 deposits as user 1 with limit=5 and page=4', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=date&sortDirection=desc&limit=5&page=4`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 5);

        // Deposit 12
        validateDeposit({
          depositUuid: deposit12Uuid,
          expectedDeposit: sampleData.deposits.deposit12,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 11
        validateDeposit({
          depositUuid: deposit11Uuid,
          expectedDeposit: sampleData.deposits.deposit11,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        // Deposit 10
        validateDeposit({
          depositUuid: deposit10Uuid,
          expectedDeposit: sampleData.deposits.deposit10,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[2],
        });

        // Deposit 9
        validateDeposit({
          depositUuid: deposit9Uuid,
          expectedDeposit: sampleData.deposits.deposit9,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[3],
        });

        // Deposit 8
        validateDeposit({
          depositUuid: deposit8Uuid,
          expectedDeposit: sampleData.deposits.deposit8,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[4],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 6);
        assert.strictEqual(res.body.meta.total, 27);
      });
    });

    describe('with fund 1 and sort=amount and sortDirection=asc', function() {
      it('should return 200 and 25 deposits as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=amount&sortDirection=asc`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 25);

        // Deposit 7
        validateDeposit({
          depositUuid: deposit7Uuid,
          expectedDeposit: sampleData.deposits.deposit7,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 4
        validateDeposit({
          depositUuid: deposit4Uuid,
          expectedDeposit: sampleData.deposits.deposit4,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        // Deposit 20
        validateDeposit({
          depositUuid: deposit20Uuid,
          expectedDeposit: sampleData.deposits.deposit20,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[2],
        });

        // Deposit 17
        validateDeposit({
          depositUuid: deposit17Uuid,
          expectedDeposit: sampleData.deposits.deposit17,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[3],
        });

        // Deposit 25
        validateDeposit({
          depositUuid: deposit25Uuid,
          expectedDeposit: sampleData.deposits.deposit25,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[4],
        });

        // Deposit 12
        validateDeposit({
          depositUuid: deposit12Uuid,
          expectedDeposit: sampleData.deposits.deposit12,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[5],
        });

        // Deposit 10
        validateDeposit({
          depositUuid: deposit10Uuid,
          expectedDeposit: sampleData.deposits.deposit10,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[6],
        });

        // Deposit 21
        validateDeposit({
          depositUuid: deposit21Uuid,
          expectedDeposit: sampleData.deposits.deposit21,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[7],
        });

        // Deposit 5
        validateDeposit({
          depositUuid: deposit5Uuid,
          expectedDeposit: sampleData.deposits.deposit5,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[8],
        });

        // Deposit 8
        validateDeposit({
          depositUuid: deposit8Uuid,
          expectedDeposit: sampleData.deposits.deposit8,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[9],
        });

        // Deposit 26
        validateDeposit({
          depositUuid: deposit26Uuid,
          expectedDeposit: sampleData.deposits.deposit26,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[10],
        });

        // Deposit 2
        validateDeposit({
          depositUuid: deposit2Uuid,
          expectedDeposit: sampleData.deposits.deposit2,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[11],
        });

        // Deposit 23
        validateDeposit({
          depositUuid: deposit23Uuid,
          expectedDeposit: sampleData.deposits.deposit23,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[12],
        });

        // Deposit 9
        validateDeposit({
          depositUuid: deposit9Uuid,
          expectedDeposit: sampleData.deposits.deposit9,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[13],
        });

        // Deposit 3
        validateDeposit({
          depositUuid: deposit3Uuid,
          expectedDeposit: sampleData.deposits.deposit3,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[14],
        });

        // Deposit 19
        validateDeposit({
          depositUuid: deposit19Uuid,
          expectedDeposit: sampleData.deposits.deposit19,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[15],
        });

        // Deposit 18
        validateDeposit({
          depositUuid: deposit18Uuid,
          expectedDeposit: sampleData.deposits.deposit18,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[16],
        });

        // Deposit 27
        validateDeposit({
          depositUuid: deposit27Uuid,
          expectedDeposit: sampleData.deposits.deposit27,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[17],
        });

        // Deposit 24
        validateDeposit({
          depositUuid: deposit24Uuid,
          expectedDeposit: sampleData.deposits.deposit24,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[18],
        });

        // Deposit 22
        validateDeposit({
          depositUuid: deposit22Uuid,
          expectedDeposit: sampleData.deposits.deposit22,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[19],
        });

        // Deposit 1
        validateDeposit({
          depositUuid: deposit1Uuid,
          expectedDeposit: sampleData.deposits.deposit1,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[20],
        });

        // Deposit 16
        validateDeposit({
          depositUuid: deposit16Uuid,
          expectedDeposit: sampleData.deposits.deposit16,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[21],
        });

        // Deposit 14
        validateDeposit({
          depositUuid: deposit14Uuid,
          expectedDeposit: sampleData.deposits.deposit14,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[22],
        });

        // Deposit 15
        validateDeposit({
          depositUuid: deposit15Uuid,
          expectedDeposit: sampleData.deposits.deposit15,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[23],
        });

        // Deposit 6
        validateDeposit({
          depositUuid: deposit6Uuid,
          expectedDeposit: sampleData.deposits.deposit6,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[24],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 2 deposits as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=amount&sortDirection=asc&page=2`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 2);

        // Deposit 11
        validateDeposit({
          depositUuid: deposit11Uuid,
          expectedDeposit: sampleData.deposits.deposit11,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 13
        validateDeposit({
          depositUuid: deposit13Uuid,
          expectedDeposit: sampleData.deposits.deposit13,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 5 deposits as user 1 with limit=5 and page=4', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=amount&sortDirection=asc&limit=5&page=4`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 5);

        // Deposit 19
        validateDeposit({
          depositUuid: deposit19Uuid,
          expectedDeposit: sampleData.deposits.deposit19,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 18
        validateDeposit({
          depositUuid: deposit18Uuid,
          expectedDeposit: sampleData.deposits.deposit18,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        // Deposit 27
        validateDeposit({
          depositUuid: deposit27Uuid,
          expectedDeposit: sampleData.deposits.deposit27,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[2],
        });

        // Deposit 24
        validateDeposit({
          depositUuid: deposit24Uuid,
          expectedDeposit: sampleData.deposits.deposit24,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[3],
        });

        // Deposit 22
        validateDeposit({
          depositUuid: deposit22Uuid,
          expectedDeposit: sampleData.deposits.deposit22,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[4],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 6);
        assert.strictEqual(res.body.meta.total, 27);
      });
    });

    describe('with fund 1 and sort=amount and sortDirection=desc', function() {
      it('should return 200 and 25 deposits as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=amount&sortDirection=desc`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 25);

        // Deposit 13
        validateDeposit({
          depositUuid: deposit13Uuid,
          expectedDeposit: sampleData.deposits.deposit13,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 11
        validateDeposit({
          depositUuid: deposit11Uuid,
          expectedDeposit: sampleData.deposits.deposit11,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        // Deposit 6
        validateDeposit({
          depositUuid: deposit6Uuid,
          expectedDeposit: sampleData.deposits.deposit6,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[2],
        });

        // Deposit 15
        validateDeposit({
          depositUuid: deposit15Uuid,
          expectedDeposit: sampleData.deposits.deposit15,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[3],
        });

        // Deposit 14
        validateDeposit({
          depositUuid: deposit14Uuid,
          expectedDeposit: sampleData.deposits.deposit14,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[4],
        });

        // Deposit 16
        validateDeposit({
          depositUuid: deposit16Uuid,
          expectedDeposit: sampleData.deposits.deposit16,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[5],
        });

        // Deposit 1
        validateDeposit({
          depositUuid: deposit1Uuid,
          expectedDeposit: sampleData.deposits.deposit1,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[6],
        });

        // Deposit 22
        validateDeposit({
          depositUuid: deposit22Uuid,
          expectedDeposit: sampleData.deposits.deposit22,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[7],
        });

        // Deposit 24
        validateDeposit({
          depositUuid: deposit24Uuid,
          expectedDeposit: sampleData.deposits.deposit24,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[8],
        });

        // Deposit 27
        validateDeposit({
          depositUuid: deposit27Uuid,
          expectedDeposit: sampleData.deposits.deposit27,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[9],
        });

        // Deposit 18
        validateDeposit({
          depositUuid: deposit18Uuid,
          expectedDeposit: sampleData.deposits.deposit18,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[10],
        });

        // Deposit 19
        validateDeposit({
          depositUuid: deposit19Uuid,
          expectedDeposit: sampleData.deposits.deposit19,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[11],
        });

        // Deposit 3
        validateDeposit({
          depositUuid: deposit3Uuid,
          expectedDeposit: sampleData.deposits.deposit3,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[12],
        });

        // Deposit 9
        validateDeposit({
          depositUuid: deposit9Uuid,
          expectedDeposit: sampleData.deposits.deposit9,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[13],
        });

        // Deposit 23
        validateDeposit({
          depositUuid: deposit23Uuid,
          expectedDeposit: sampleData.deposits.deposit23,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[14],
        });

        // Deposit 2
        validateDeposit({
          depositUuid: deposit2Uuid,
          expectedDeposit: sampleData.deposits.deposit2,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[15],
        });

        // Deposit 26
        validateDeposit({
          depositUuid: deposit26Uuid,
          expectedDeposit: sampleData.deposits.deposit26,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[16],
        });

        // Deposit 8
        validateDeposit({
          depositUuid: deposit8Uuid,
          expectedDeposit: sampleData.deposits.deposit8,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[17],
        });

        // Deposit 5
        validateDeposit({
          depositUuid: deposit5Uuid,
          expectedDeposit: sampleData.deposits.deposit5,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[18],
        });

        // Deposit 21
        validateDeposit({
          depositUuid: deposit21Uuid,
          expectedDeposit: sampleData.deposits.deposit21,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[19],
        });

        // Deposit 10
        validateDeposit({
          depositUuid: deposit10Uuid,
          expectedDeposit: sampleData.deposits.deposit10,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[20],
        });

        // Deposit 12
        validateDeposit({
          depositUuid: deposit12Uuid,
          expectedDeposit: sampleData.deposits.deposit12,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[21],
        });

        // Deposit 25
        validateDeposit({
          depositUuid: deposit25Uuid,
          expectedDeposit: sampleData.deposits.deposit25,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[22],
        });

        // Deposit 17
        validateDeposit({
          depositUuid: deposit17Uuid,
          expectedDeposit: sampleData.deposits.deposit17,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[23],
        });

        // Deposit 20
        validateDeposit({
          depositUuid: deposit20Uuid,
          expectedDeposit: sampleData.deposits.deposit20,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[24],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 2 deposits as user 1 with no limit or page specified', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=amount&sortDirection=desc&page=2`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 2);

        // Deposit 4
        validateDeposit({
          depositUuid: deposit4Uuid,
          expectedDeposit: sampleData.deposits.deposit4,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 7
        validateDeposit({
          depositUuid: deposit7Uuid,
          expectedDeposit: sampleData.deposits.deposit7,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 2);
        assert.strictEqual(res.body.meta.total, 27);
      });

      it('should return 200 and 5 deposits as user 1 with limit=5 and page=4', async function() {
        const res = await chai.request(server)
          .get(`/deposits?fund_id=${user1Fund1Uuid}&sort=amount&sortDirection=desc&limit=5&page=4`)
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);
        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 5);

        // Deposit 2
        validateDeposit({
          depositUuid: deposit2Uuid,
          expectedDeposit: sampleData.deposits.deposit2,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[0],
        });

        // Deposit 26
        validateDeposit({
          depositUuid: deposit26Uuid,
          expectedDeposit: sampleData.deposits.deposit26,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[1],
        });

        // Deposit 8
        validateDeposit({
          depositUuid: deposit8Uuid,
          expectedDeposit: sampleData.deposits.deposit8,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[2],
        });

        // Deposit 5
        validateDeposit({
          depositUuid: deposit5Uuid,
          expectedDeposit: sampleData.deposits.deposit5,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[3],
        });

        // Deposit 21
        validateDeposit({
          depositUuid: deposit21Uuid,
          expectedDeposit: sampleData.deposits.deposit21,
          fundUuid: user1Fund1Uuid,
          returnedDeposit: res.body.data[4],
        });

        assert.isOk(res.body.included);
        const fundInclude = _.find(res.body.included, (include) => {
          return include.id === user1Fund1Uuid
            && include.type === 'funds';
        });
        assert.isOk(fundInclude);
        assert.isOk(fundInclude.attributes);
        assert.strictEqual(fundInclude.attributes.name, sampleData.funds.fund1.name);
        assert.strictEqual(res.body.included.length, 1);

        assert.isOk(res.body.meta);
        assert.strictEqual(res.body.meta.pages, 6);
        assert.strictEqual(res.body.meta.total, 27);
      });
    });
  });
});
