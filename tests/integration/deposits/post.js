const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /deposits', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let createDepositSpy;

  let fundUuid;
  let userToken;
  let userUuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    createDepositSpy = sinon.spy(controllers.FundCtrl, 'createDeposit');
  });

  after('restore sinon spies', function() {
    createDepositSpy.restore();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  beforeEach('create user', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    userUuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });
  });

  beforeEach('create user token', async function() {
    userToken = await controllers.UserCtrl.getToken(userUuid);
  });

  beforeEach('create fund', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    fundUuid = await controllers.FundCtrl.createFund({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.funds.fund1.name,
    });
  });

  afterEach('reset history for sinon spies', function() {
    createDepositSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .post('/deposits')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.deposits.deposit1.amount_cents,
            'date': sampleData.deposits.deposit1.date,
          },
          'relationships': {
            'fund': {
              'data': {
                'id': fundUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(createDepositSpy.callCount, 0);
  });

  it('should return 422 with no amount', async function() {
    const res = await chai.request(server)
      .post('/deposits')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': null,
            'date': sampleData.deposits.deposit1.date,
          },
          'relationships': {
            'fund': {
              'data': {
                'id': fundUuid,
              },
            },
          },
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
    assert.strictEqual(createDepositSpy.callCount, 0);
  });

  it('should return 422 with an invalid amount', async function() {
    const res = await chai.request(server)
      .post('/deposits')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': '12.34',
            'date': sampleData.deposits.deposit1.date,
          },
          'relationships': {
            'fund': {
              'data': {
                'id': fundUuid,
              },
            },
          },
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
    assert.strictEqual(createDepositSpy.callCount, 0);
  });

  it('should return 422 with no date', async function() {
    const res = await chai.request(server)
      .post('/deposits')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.deposits.deposit1.amount_cents,
            'date': null,
          },
          'relationships': {
            'fund': {
              'data': {
                'id': fundUuid,
              },
            },
          },
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
    assert.strictEqual(createDepositSpy.callCount, 0);
  });

  it('should return 422 with an invalid date', async function() {
    const res = await chai.request(server)
      .post('/deposits')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.deposits.deposit1.amount_cents,
            'date': 'invalid date',
          },
          'relationships': {
            'fund': {
              'data': {
                'id': fundUuid,
              },
            },
          },
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
    assert.strictEqual(createDepositSpy.callCount, 0);
  });

  it('should return 422 with no fund uuid', async function() {
    const res = await chai.request(server)
      .post('/deposits')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.deposits.deposit1.amount_cents,
            'date': sampleData.deposits.deposit1.date,
          },
          'relationships': {
            'fund': {
              'data': {
                'id': null,
              },
            },
          },
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
    assert.strictEqual(createDepositSpy.callCount, 0);
  });

  it('should return 201 with valid data', async function() {
    const res = await chai.request(server)
      .post('/deposits')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.deposits.deposit1.amount_cents,
            'date': sampleData.deposits.deposit1.date,
          },
          'relationships': {
            'fund': {
              'data': {
                'id': fundUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(201);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes.amount, sampleData.deposits.deposit1.amount_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.date, sampleData.deposits.deposit1.date);
    assert.isOk(res.body.data.id);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships.fund);
    assert.isOk(res.body.data.relationships.fund.data);
    assert.strictEqual(res.body.data.relationships.fund.data.id, fundUuid);
    assert.strictEqual(res.body.data.type, 'deposits');

    // Validate FundCtrl.createDeposit call.
    assert.strictEqual(createDepositSpy.callCount, 1);
    const createDepositParams = createDepositSpy.getCall(0).args[0];
    assert.strictEqual(createDepositParams.amount, sampleData.deposits.deposit1.amount_cents);
    assert.isOk(createDepositParams.auditApiCallUuid);
    assert.strictEqual(createDepositParams.date, sampleData.deposits.deposit1.date);
    assert.strictEqual(createDepositParams.fundUuid, fundUuid);

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
        uuid: createDepositParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'POST');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), '/deposits');
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), userUuid);
  });
});
