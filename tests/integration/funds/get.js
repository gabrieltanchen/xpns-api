const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /funds', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let fund1Uuid;
  let fund2Uuid;
  let fund3Uuid;
  let fund4Uuid;
  let fund5Uuid;
  let fund6Uuid;
  let fund7Uuid;
  let fund8Uuid;
  let fund9Uuid;
  let fund10Uuid;
  let fund11Uuid;
  let fund12Uuid;
  let fund13Uuid;
  let fund14Uuid;
  let fund15Uuid;
  let fund16Uuid;
  let fund17Uuid;
  let fund18Uuid;
  let fund19Uuid;
  let fund20Uuid;
  let fund21Uuid;
  let fund22Uuid;
  let fund23Uuid;
  let fund24Uuid;
  let fund25Uuid;
  let fund26Uuid;
  let fund27Uuid;
  let fund28Uuid;
  let user1Token;
  let user1Uuid;
  let user2Token;
  let user2Uuid;

  // 3 Angelica
  // 13 Austin
  // 23 Casey
  // 12 Clay
  // 9 Clifford
  // 1 Courtney
  // 19 Damon
  // 18 Dennis
  // 25 Denton
  // 16 Eugenia
  // 8 Freddie
  // 22 Greg
  // 5 Haley
  // 11 Hannah
  // 17 Jasper
  // 10 Jim
  // 7 Joan
  // 26 Kemp
  // 15 Lane
  // 2 Ollie
  // 6 Pearl
  // 14 Rosaline
  // 20 Salena
  // 24 Samson
  // 21 Thalia
  // 27 Victoria
  // 4 Zach

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

  before('create fund 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund1Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund1.name,
    });
  });

  before('create fund 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund2Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund2.name,
    });
  });

  before('create fund 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund3Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund3.name,
    });
  });

  before('create fund 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund4Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund4.name,
    });
  });

  before('create fund 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund5Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund5.name,
    });
  });

  before('create fund 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund6Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund6.name,
    });
  });

  before('create fund 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund7Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund7.name,
    });
  });

  before('create fund 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund8Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund8.name,
    });
  });

  before('create fund 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund9Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund9.name,
    });
  });

  before('create fund 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund10Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund10.name,
    });
  });

  before('create fund 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund11Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund11.name,
    });
  });

  before('create fund 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund12Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund12.name,
    });
  });

  before('create fund 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund13Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund13.name,
    });
  });

  before('create fund 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund14Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund14.name,
    });
  });

  before('create fund 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund15Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund15.name,
    });
  });

  before('create fund 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund16Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund16.name,
    });
  });

  before('create fund 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund17Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund17.name,
    });
  });

  before('create fund 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund18Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund18.name,
    });
  });

  before('create fund 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund19Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund19.name,
    });
  });

  before('create fund 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund20Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund20.name,
    });
  });

  before('create fund 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund21Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund21.name,
    });
  });

  before('create fund 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund22Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund22.name,
    });
  });

  before('create fund 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund23Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund23.name,
    });
  });

  before('create fund 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund24Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund24.name,
    });
  });

  before('create fund 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund25Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund25.name,
    });
  });

  before('create fund 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund26Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund26.name,
    });
  });

  before('create fund 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    fund27Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund27.name,
    });
  });

  before('create fund 28', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    fund28Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund28.name,
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
      .get('/funds')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 200 and 25 funds as user 1 with no limit or page specified', async function() {
    const res = await chai.request(server)
      .get('/funds')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 25);

    // Fund 3
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.funds.fund3.name);
    assert.strictEqual(res.body.data[0].id, fund3Uuid);
    assert.strictEqual(res.body.data[0].type, 'funds');

    // Fund 13
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.funds.fund13.name);
    assert.strictEqual(res.body.data[1].id, fund13Uuid);
    assert.strictEqual(res.body.data[1].type, 'funds');

    // Fund 23
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.funds.fund23.name);
    assert.strictEqual(res.body.data[2].id, fund23Uuid);
    assert.strictEqual(res.body.data[2].type, 'funds');

    // Fund 12
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.funds.fund12.name);
    assert.strictEqual(res.body.data[3].id, fund12Uuid);
    assert.strictEqual(res.body.data[3].type, 'funds');

    // Fund 9
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.funds.fund9.name);
    assert.strictEqual(res.body.data[4].id, fund9Uuid);
    assert.strictEqual(res.body.data[4].type, 'funds');

    // Fund 1
    assert.isOk(res.body.data[5].attributes);
    assert.isOk(res.body.data[5].attributes['created-at']);
    assert.strictEqual(res.body.data[5].attributes.name, sampleData.funds.fund1.name);
    assert.strictEqual(res.body.data[5].id, fund1Uuid);
    assert.strictEqual(res.body.data[5].type, 'funds');

    // Fund 19
    assert.isOk(res.body.data[6].attributes);
    assert.isOk(res.body.data[6].attributes['created-at']);
    assert.strictEqual(res.body.data[6].attributes.name, sampleData.funds.fund19.name);
    assert.strictEqual(res.body.data[6].id, fund19Uuid);
    assert.strictEqual(res.body.data[6].type, 'funds');

    // Fund 18
    assert.isOk(res.body.data[7].attributes);
    assert.isOk(res.body.data[7].attributes['created-at']);
    assert.strictEqual(res.body.data[7].attributes.name, sampleData.funds.fund18.name);
    assert.strictEqual(res.body.data[7].id, fund18Uuid);
    assert.strictEqual(res.body.data[7].type, 'funds');

    // Fund 25
    assert.isOk(res.body.data[8].attributes);
    assert.isOk(res.body.data[8].attributes['created-at']);
    assert.strictEqual(res.body.data[8].attributes.name, sampleData.funds.fund25.name);
    assert.strictEqual(res.body.data[8].id, fund25Uuid);
    assert.strictEqual(res.body.data[8].type, 'funds');

    // Fund 16
    assert.isOk(res.body.data[9].attributes);
    assert.isOk(res.body.data[9].attributes['created-at']);
    assert.strictEqual(res.body.data[9].attributes.name, sampleData.funds.fund16.name);
    assert.strictEqual(res.body.data[9].id, fund16Uuid);
    assert.strictEqual(res.body.data[9].type, 'funds');

    // Fund 8
    assert.isOk(res.body.data[10].attributes);
    assert.isOk(res.body.data[10].attributes['created-at']);
    assert.strictEqual(res.body.data[10].attributes.name, sampleData.funds.fund8.name);
    assert.strictEqual(res.body.data[10].id, fund8Uuid);
    assert.strictEqual(res.body.data[10].type, 'funds');

    // Fund 22
    assert.isOk(res.body.data[11].attributes);
    assert.isOk(res.body.data[11].attributes['created-at']);
    assert.strictEqual(res.body.data[11].attributes.name, sampleData.funds.fund22.name);
    assert.strictEqual(res.body.data[11].id, fund22Uuid);
    assert.strictEqual(res.body.data[11].type, 'funds');

    // Fund 5
    assert.isOk(res.body.data[12].attributes);
    assert.isOk(res.body.data[12].attributes['created-at']);
    assert.strictEqual(res.body.data[12].attributes.name, sampleData.funds.fund5.name);
    assert.strictEqual(res.body.data[12].id, fund5Uuid);
    assert.strictEqual(res.body.data[12].type, 'funds');

    // Fund 11
    assert.isOk(res.body.data[13].attributes);
    assert.isOk(res.body.data[13].attributes['created-at']);
    assert.strictEqual(res.body.data[13].attributes.name, sampleData.funds.fund11.name);
    assert.strictEqual(res.body.data[13].id, fund11Uuid);
    assert.strictEqual(res.body.data[13].type, 'funds');

    // Fund 17
    assert.isOk(res.body.data[14].attributes);
    assert.isOk(res.body.data[14].attributes['created-at']);
    assert.strictEqual(res.body.data[14].attributes.name, sampleData.funds.fund17.name);
    assert.strictEqual(res.body.data[14].id, fund17Uuid);
    assert.strictEqual(res.body.data[14].type, 'funds');

    // Fund 10
    assert.isOk(res.body.data[15].attributes);
    assert.isOk(res.body.data[15].attributes['created-at']);
    assert.strictEqual(res.body.data[15].attributes.name, sampleData.funds.fund10.name);
    assert.strictEqual(res.body.data[15].id, fund10Uuid);
    assert.strictEqual(res.body.data[15].type, 'funds');

    // Fund 7
    assert.isOk(res.body.data[16].attributes);
    assert.isOk(res.body.data[16].attributes['created-at']);
    assert.strictEqual(res.body.data[16].attributes.name, sampleData.funds.fund7.name);
    assert.strictEqual(res.body.data[16].id, fund7Uuid);
    assert.strictEqual(res.body.data[16].type, 'funds');

    // Fund 26
    assert.isOk(res.body.data[17].attributes);
    assert.isOk(res.body.data[17].attributes['created-at']);
    assert.strictEqual(res.body.data[17].attributes.name, sampleData.funds.fund26.name);
    assert.strictEqual(res.body.data[17].id, fund26Uuid);
    assert.strictEqual(res.body.data[17].type, 'funds');

    // Fund 15
    assert.isOk(res.body.data[18].attributes);
    assert.isOk(res.body.data[18].attributes['created-at']);
    assert.strictEqual(res.body.data[18].attributes.name, sampleData.funds.fund15.name);
    assert.strictEqual(res.body.data[18].id, fund15Uuid);
    assert.strictEqual(res.body.data[18].type, 'funds');

    // Fund 2
    assert.isOk(res.body.data[19].attributes);
    assert.isOk(res.body.data[19].attributes['created-at']);
    assert.strictEqual(res.body.data[19].attributes.name, sampleData.funds.fund2.name);
    assert.strictEqual(res.body.data[19].id, fund2Uuid);
    assert.strictEqual(res.body.data[19].type, 'funds');

    // Fund 6
    assert.isOk(res.body.data[20].attributes);
    assert.isOk(res.body.data[20].attributes['created-at']);
    assert.strictEqual(res.body.data[20].attributes.name, sampleData.funds.fund6.name);
    assert.strictEqual(res.body.data[20].id, fund6Uuid);
    assert.strictEqual(res.body.data[20].type, 'funds');

    // Fund 14
    assert.isOk(res.body.data[21].attributes);
    assert.isOk(res.body.data[21].attributes['created-at']);
    assert.strictEqual(res.body.data[21].attributes.name, sampleData.funds.fund14.name);
    assert.strictEqual(res.body.data[21].id, fund14Uuid);
    assert.strictEqual(res.body.data[21].type, 'funds');

    // Fund 20
    assert.isOk(res.body.data[22].attributes);
    assert.isOk(res.body.data[22].attributes['created-at']);
    assert.strictEqual(res.body.data[22].attributes.name, sampleData.funds.fund20.name);
    assert.strictEqual(res.body.data[22].id, fund20Uuid);
    assert.strictEqual(res.body.data[22].type, 'funds');

    // Fund 24
    assert.isOk(res.body.data[23].attributes);
    assert.isOk(res.body.data[23].attributes['created-at']);
    assert.strictEqual(res.body.data[23].attributes.name, sampleData.funds.fund24.name);
    assert.strictEqual(res.body.data[23].id, fund24Uuid);
    assert.strictEqual(res.body.data[23].type, 'funds');

    // Fund 21
    assert.isOk(res.body.data[24].attributes);
    assert.isOk(res.body.data[24].attributes['created-at']);
    assert.strictEqual(res.body.data[24].attributes.name, sampleData.funds.fund21.name);
    assert.strictEqual(res.body.data[24].id, fund21Uuid);
    assert.strictEqual(res.body.data[24].type, 'funds');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 2 funds as user 1 with no limit and page=2', async function() {
    const res = await chai.request(server)
      .get('/funds?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 2);

    // Fund 27
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.funds.fund27.name);
    assert.strictEqual(res.body.data[0].id, fund27Uuid);
    assert.strictEqual(res.body.data[0].type, 'funds');

    // Fund 4
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.funds.fund4.name);
    assert.strictEqual(res.body.data[1].id, fund4Uuid);
    assert.strictEqual(res.body.data[1].type, 'funds');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 5 funds as user 1 with limit=5 and page=4', async function() {
    const res = await chai.request(server)
      .get('/funds?limit=5&page=4')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 5);

    // Fund 10
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.funds.fund10.name);
    assert.strictEqual(res.body.data[0].id, fund10Uuid);
    assert.strictEqual(res.body.data[0].type, 'funds');

    // Fund 7
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.funds.fund7.name);
    assert.strictEqual(res.body.data[1].id, fund7Uuid);
    assert.strictEqual(res.body.data[1].type, 'funds');

    // Fund 26
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.funds.fund26.name);
    assert.strictEqual(res.body.data[2].id, fund26Uuid);
    assert.strictEqual(res.body.data[2].type, 'funds');

    // Fund 15
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.funds.fund15.name);
    assert.strictEqual(res.body.data[3].id, fund15Uuid);
    assert.strictEqual(res.body.data[3].type, 'funds');

    // Fund 2
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.funds.fund2.name);
    assert.strictEqual(res.body.data[4].id, fund2Uuid);
    assert.strictEqual(res.body.data[4].type, 'funds');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 6);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 1 fund as user 2', async function() {
    const res = await chai.request(server)
      .get('/funds')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 1);

    // Fund 28
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.funds.fund28.name);
    assert.strictEqual(res.body.data[0].id, fund28Uuid);
    assert.strictEqual(res.body.data[0].type, 'funds');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });

  it('should return 200 and 0 funds as user 2 with page=2', async function() {
    const res = await chai.request(server)
      .get('/funds?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 0);
    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });
});
