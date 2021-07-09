const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - PATCH /deposits/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let updateDepositSpy;

  let user1DepositUuid;
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

  before('create sinon spies', function() {
    updateDepositSpy = sinon.spy(controllers.FundCtrl, 'updateDeposit');
  });

  after('restore sinon spies', function() {
    updateDepositSpy.restore();
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

  beforeEach('create user 1 fund 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Fund1Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund1.name,
    });
  });

  beforeEach('create user 1 fund 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Fund2Uuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund2.name,
    });
  });

  beforeEach('create user 1 deposit', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1DepositUuid = await controllers.FundCtrl.createDeposit({
      amount: sampleData.deposits.deposit1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.deposits.deposit1.date,
      fundUuid: user1Fund1Uuid,
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

  afterEach('reset history for sinon spies', async function() {
    updateDepositSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .patch(`/deposits/${user1DepositUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.deposits.deposit2.amount_cents,
            'date': sampleData.deposits.deposit2.date,
          },
          'id': user1DepositUuid,
          'relationships': {
            'fund': {
              'data': {
                'id': user1Fund2Uuid,
              },
            },
          },
          'type': 'deposits',
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(updateDepositSpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .patch(`/deposits/${user1DepositUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.deposits.deposit2.amount_cents,
            'date': sampleData.deposits.deposit2.date,
          },
          'id': user1DepositUuid,
          'relationships': {
            'fund': {
              'data': {
                'id': user1Fund2Uuid,
              },
            },
          },
          'type': 'deposits',
        },
      });
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find deposit.',
      }],
    });

    assert.strictEqual(updateDepositSpy.callCount, 1);
    const updateDepositParams = updateDepositSpy.getCall(0).args[0];
    assert.strictEqual(updateDepositParams.amount, sampleData.deposits.deposit2.amount_cents);
    assert.isOk(updateDepositParams.auditApiCallUuid);
    assert.strictEqual(updateDepositParams.date, sampleData.deposits.deposit2.date);
    assert.strictEqual(updateDepositParams.fundUuid, user1Fund2Uuid);
  });

  it('should return 422 with no amount', async function() {
    const res = await chai.request(server)
      .patch(`/deposits/${user1DepositUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount': null,
            'date': sampleData.deposits.deposit2.date,
          },
          'id': user1DepositUuid,
          'relationships': {
            'fund': {
              'data': {
                'id': user1Fund2Uuid,
              },
            },
          },
          'type': 'deposits',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Amount is required.',
        source: {
          pointer: '/data/attributes/amount',
        },
      }],
    });
    assert.strictEqual(updateDepositSpy.callCount, 0);
  });

  it('should return 422 with an invalid amount', async function() {
    const res = await chai.request(server)
      .patch(`/deposits/${user1DepositUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount': '12.34',
            'date': sampleData.deposits.deposit2.date,
          },
          'id': user1DepositUuid,
          'relationships': {
            'fund': {
              'data': {
                'id': user1Fund2Uuid,
              },
            },
          },
          'type': 'deposits',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Amount must be an integer.',
        source: {
          pointer: '/data/attributes/amount',
        },
      }],
    });
    assert.strictEqual(updateDepositSpy.callCount, 0);
  });

  it('should return 422 with no date', async function() {
    const res = await chai.request(server)
      .patch(`/deposits/${user1DepositUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.deposits.deposit2.amount_cents,
            'date': null,
          },
          'id': user1DepositUuid,
          'relationships': {
            'fund': {
              'data': {
                'id': user1Fund2Uuid,
              },
            },
          },
          'type': 'deposits',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Date is required.',
        source: {
          pointer: '/data/attributes/date',
        },
      }, {
        detail: 'Date must be valid.',
        source: {
          pointer: '/data/attributes/date',
        },
      }],
    });
    assert.strictEqual(updateDepositSpy.callCount, 0);
  });

  it('should return 422 with an invalid date', async function() {
    const res = await chai.request(server)
      .patch(`/deposits/${user1DepositUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.deposits.deposit2.amount_cents,
            'date': 'invalid date',
          },
          'id': user1DepositUuid,
          'relationships': {
            'fund': {
              'data': {
                'id': user1Fund2Uuid,
              },
            },
          },
          'type': 'deposits',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Date must be valid.',
        source: {
          pointer: '/data/attributes/date',
        },
      }],
    });
    assert.strictEqual(updateDepositSpy.callCount, 0);
  });

  it('should return 422 with no fund uuid', async function() {
    const res = await chai.request(server)
      .patch(`/deposits/${user1DepositUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.deposits.deposit2.amount_cents,
            'date': sampleData.deposits.deposit2.date,
          },
          'id': user1DepositUuid,
          'relationships': {
            'fund': {
              'data': {
                'id': null,
              },
            },
          },
          'type': 'deposits',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Fund is required.',
        source: {
          pointer: '/data/relationships/fund/data/id',
        },
      }],
    });
    assert.strictEqual(updateDepositSpy.callCount, 0);
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .patch(`/deposits/${user1DepositUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.deposits.deposit2.amount_cents,
            'date': sampleData.deposits.deposit2.date,
          },
          'id': user1DepositUuid,
          'relationships': {
            'fund': {
              'data': {
                'id': user1Fund2Uuid,
              },
            },
          },
          'type': 'deposits',
        },
      });
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes.amount, sampleData.deposits.deposit2.amount_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.date, sampleData.deposits.deposit2.date);
    assert.strictEqual(res.body.data.id, user1DepositUuid);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships.fund);
    assert.isOk(res.body.data.relationships.fund.data);
    assert.strictEqual(res.body.data.relationships.fund.data.id, user1Fund2Uuid);
    assert.strictEqual(res.body.data.type, 'deposits');

    // Validate FundCtrl.updateDeposit call.
    assert.strictEqual(updateDepositSpy.callCount, 1);
    const updateDepositParams = updateDepositSpy.getCall(0).args[0];
    assert.strictEqual(updateDepositParams.amount, sampleData.deposits.deposit2.amount_cents);
    assert.isOk(updateDepositParams.auditApiCallUuid);
    assert.strictEqual(updateDepositParams.date, sampleData.deposits.deposit2.date);
    assert.strictEqual(updateDepositParams.fundUuid, user1Fund2Uuid);

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
        uuid: updateDepositParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'PATCH');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/deposits/${user1DepositUuid}`);
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
