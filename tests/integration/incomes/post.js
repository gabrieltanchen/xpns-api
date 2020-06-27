const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /incomes', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let createIncomeSpy;

  let householdMemberUuid;
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
    createIncomeSpy = sinon.spy(controllers.IncomeCtrl, 'createIncome');
  });

  after('restore sinon spies', function() {
    createIncomeSpy.restore();
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

  beforeEach('create household member', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    householdMemberUuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user1.firstName,
    });
  });

  afterEach('reset history for sinon spies', function() {
    createIncomeSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .post('/incomes')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.incomes.income1.amount_cents,
            'date': sampleData.incomes.income1.date,
            'description': sampleData.incomes.income1.description,
          },
          'relationships': {
            'household-member': {
              'data': {
                'id': householdMemberUuid,
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
    assert.strictEqual(createIncomeSpy.callCount, 0);
  });

  it('should return 422 with no amount cents', async function() {
    const res = await chai.request(server)
      .post('/incomes')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': null,
            'date': sampleData.incomes.income1.date,
            'description': sampleData.incomes.income1.description,
          },
          'relationships': {
            'household-member': {
              'data': {
                'id': householdMemberUuid,
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
    assert.strictEqual(createIncomeSpy.callCount, 0);
  });

  it('should return 422 with an invalid amount cents', async function() {
    const res = await chai.request(server)
      .post('/incomes')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': '12.34',
            'date': sampleData.incomes.income1.date,
            'description': sampleData.incomes.income1.description,
          },
          'relationships': {
            'household-member': {
              'data': {
                'id': householdMemberUuid,
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
    assert.strictEqual(createIncomeSpy.callCount, 0);
  });

  it('should return 422 with no date', async function() {
    const res = await chai.request(server)
      .post('/incomes')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.incomes.income1.amount_cents,
            'date': null,
            'description': sampleData.incomes.income1.description,
          },
          'relationships': {
            'household-member': {
              'data': {
                'id': householdMemberUuid,
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
    assert.strictEqual(createIncomeSpy.callCount, 0);
  });

  it('should return 422 with an invalid date', async function() {
    const res = await chai.request(server)
      .post('/incomes')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.incomes.income1.amount_cents,
            'date': 'invalid date',
            'description': sampleData.incomes.income1.description,
          },
          'relationships': {
            'household-member': {
              'data': {
                'id': householdMemberUuid,
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
    assert.strictEqual(createIncomeSpy.callCount, 0);
  });

  it('should return 422 with no household member uuid', async function() {
    const res = await chai.request(server)
      .post('/incomes')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.incomes.income1.amount_cents,
            'date': sampleData.incomes.income1.date,
            'description': sampleData.incomes.income1.description,
          },
          'relationships': {
            'household-member': {
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
        detail: 'Member is required.',
        source: {
          pointer: '/data/relationships/household-member/data/id',
        },
      }],
    });
    assert.strictEqual(createIncomeSpy.callCount, 0);
  });

  it('should return 201 with valid data', async function() {
    const res = await chai.request(server)
      .post('/incomes')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.incomes.income1.amount_cents,
            'date': sampleData.incomes.income1.date,
            'description': sampleData.incomes.income1.description,
          },
          'relationships': {
            'household-member': {
              'data': {
                'id': householdMemberUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(201);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes.amount, sampleData.incomes.income1.amount_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.date, sampleData.incomes.income1.date);
    assert.strictEqual(
      res.body.data.attributes.description,
      sampleData.incomes.income1.description,
    );
    assert.isOk(res.body.data.id);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships['household-member']);
    assert.isOk(res.body.data.relationships['household-member'].data);
    assert.strictEqual(res.body.data.relationships['household-member'].data.id, householdMemberUuid);
    assert.strictEqual(res.body.data.type, 'incomes');

    // Validate IncomeCtrl.createIncome call.
    assert.strictEqual(createIncomeSpy.callCount, 1);
    const createIncomeParams = createIncomeSpy.getCall(0).args[0];
    assert.strictEqual(createIncomeParams.amount, sampleData.incomes.income1.amount_cents);
    assert.isOk(createIncomeParams.auditApiCallUuid);
    assert.strictEqual(createIncomeParams.date, sampleData.incomes.income1.date);
    assert.strictEqual(createIncomeParams.description, sampleData.incomes.income1.description);
    assert.strictEqual(createIncomeParams.householdMemberUuid, householdMemberUuid);

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
        uuid: createIncomeParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'POST');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), '/incomes');
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), userUuid);
  });
});
