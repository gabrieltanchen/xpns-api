const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - PATCH /funds/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let updateFundSpy;

  let user1FundUuid;
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

  before('create sinon spies', function() {
    updateFundSpy = sinon.spy(controllers.FundCtrl, 'updateFund');
  });

  after('restore sinon spies', function() {
    updateFundSpy.restore();
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

  beforeEach('create user 1 fund', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1FundUuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund1.name,
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

  afterEach('reset history for sinon spies', function() {
    updateFundSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .patch(`/funds/${user1FundUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'name': sampleData.funds.fund2.name,
          },
          'id': user1FundUuid,
          'type': 'funds',
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(updateFundSpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .patch(`/funds/${user1FundUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.funds.fund2.name,
          },
          'id': user1FundUuid,
          'type': 'funds',
        },
      });
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find fund.',
      }],
    });

    assert.strictEqual(updateFundSpy.callCount, 1);
    const updateFundParams = updateFundSpy.getCall(0).args[0];
    assert.isOk(updateFundParams.auditApiCallUuid);
    assert.strictEqual(updateFundParams.fundUuid, user1FundUuid);
    assert.strictEqual(updateFundParams.name, sampleData.funds.fund2.name);
  });

  it('should return 422 with no name', async function() {
    const res = await chai.request(server)
      .patch(`/funds/${user1FundUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'name': '',
          },
          'id': user1FundUuid,
          'type': 'funds',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Fund name is required.',
        source: {
          pointer: '/data/attributes/name',
        },
      }],
    });
    assert.strictEqual(updateFundSpy.callCount, 0);
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .patch(`/funds/${user1FundUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.funds.fund2.name,
          },
          'id': user1FundUuid,
          'type': 'funds',
        },
      });
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes.amount, 0);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.name, sampleData.funds.fund2.name);
    assert.strictEqual(res.body.data.id, user1FundUuid);
    assert.strictEqual(res.body.data.type, 'funds');

    // Validate FundCtrl.updateFund call.
    assert.strictEqual(updateFundSpy.callCount, 1);
    const updateFundParams = updateFundSpy.getCall(0).args[0];
    assert.isOk(updateFundParams.auditApiCallUuid);
    assert.strictEqual(updateFundParams.fundUuid, user1FundUuid);
    assert.strictEqual(updateFundParams.name, sampleData.funds.fund2.name);

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
        uuid: updateFundParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'PATCH');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/funds/${user1FundUuid}`);
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
