const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - PATCH /incomes/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let updateIncomeSpy;

  let user1HouseholdMember1Uuid;
  let user1HouseholdMember2Uuid;
  let user1IncomeUuid;
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
    updateIncomeSpy = sinon.spy(controllers.IncomeCtrl, 'updateIncome');
  });

  after('restore sinon spies', function() {
    updateIncomeSpy.restore();
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

  beforeEach('create user 1 household member 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1HouseholdMember1Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user1.firstName,
    });
  });

  beforeEach('create user 1 household member 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1HouseholdMember2Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user2.firstName,
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
      householdMemberUuid: user1HouseholdMember1Uuid,
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
    updateIncomeSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .patch(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.incomes.income2.amount_cents,
            'date': sampleData.incomes.income2.date,
            'description': sampleData.incomes.income2.description,
          },
          'id': user1IncomeUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
          },
          'type': 'incomes',
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(updateIncomeSpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .patch(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.incomes.income2.amount_cents,
            'date': sampleData.incomes.income2.date,
            'description': sampleData.incomes.income2.description,
          },
          'id': user1IncomeUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
          },
          'type': 'incomes',
        },
      });
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find income.',
      }],
    });
    assert.strictEqual(updateIncomeSpy.callCount, 1);
  });

  it('should return 422 with no amount cents', async function() {
    const res = await chai.request(server)
      .patch(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': null,
            'date': sampleData.incomes.income2.date,
            'description': sampleData.incomes.income2.description,
          },
          'id': user1IncomeUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
          },
          'type': 'incomes',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Amount is required.',
        source: {
          pointer: '/data/attributes/amount-cents',
        },
      }],
    });
    assert.strictEqual(updateIncomeSpy.callCount, 0);
  });

  it('should return 422 with an invalid amount cents', async function() {
    const res = await chai.request(server)
      .patch(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': '12.34',
            'date': sampleData.incomes.income2.date,
            'description': sampleData.incomes.income2.description,
          },
          'id': user1IncomeUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
          },
          'type': 'incomes',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Amount must be an integer.',
        source: {
          pointer: '/data/attributes/amount-cents',
        },
      }],
    });
    assert.strictEqual(updateIncomeSpy.callCount, 0);
  });

  it('should return 422 with no date', async function() {
    const res = await chai.request(server)
      .patch(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.incomes.income2.amount_cents,
            'date': null,
            'description': sampleData.incomes.income2.description,
          },
          'id': user1IncomeUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
          },
          'type': 'incomes',
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
    assert.strictEqual(updateIncomeSpy.callCount, 0);
  });

  it('should return 422 with an invalid date', async function() {
    const res = await chai.request(server)
      .patch(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.incomes.income2.amount_cents,
            'date': 'invalid date',
            'description': sampleData.incomes.income2.description,
          },
          'id': user1IncomeUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
          },
          'type': 'incomes',
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
    assert.strictEqual(updateIncomeSpy.callCount, 0);
  });

  it('should return 422 with no household member UUID', async function() {
    const res = await chai.request(server)
      .patch(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.incomes.income2.amount_cents,
            'date': sampleData.incomes.income2.date,
            'description': sampleData.incomes.income2.description,
          },
          'id': user1IncomeUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': null,
              },
            },
          },
          'type': 'incomes',
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
    assert.strictEqual(updateIncomeSpy.callCount, 0);
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .patch(`/incomes/${user1IncomeUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.incomes.income2.amount_cents,
            'date': sampleData.incomes.income2.date,
            'description': sampleData.incomes.income2.description,
          },
          'id': user1IncomeUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
          },
          'type': 'incomes',
        },
      });
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(
      parseFloat(res.body.data.attributes.amount),
      sampleData.incomes.income2.amount,
    );
    assert.strictEqual(res.body.data.attributes['amount-cents'], sampleData.incomes.income2.amount_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.date, sampleData.incomes.income2.date);
    assert.strictEqual(
      res.body.data.attributes.description,
      sampleData.incomes.income2.description,
    );
    assert.strictEqual(res.body.data.id, user1IncomeUuid);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships['household-member']);
    assert.isOk(res.body.data.relationships['household-member'].data);
    assert.strictEqual(res.body.data.relationships['household-member'].data.id, user1HouseholdMember2Uuid);
    assert.strictEqual(res.body.data.type, 'incomes');

    // Validate IncomeCtrl.updateIncome call.
    assert.strictEqual(updateIncomeSpy.callCount, 1);
    const updateIncomeParams = updateIncomeSpy.getCall(0).args[0];
    assert.strictEqual(updateIncomeParams.amountCents, sampleData.incomes.income2.amount_cents);
    assert.isOk(updateIncomeParams.auditApiCallUuid);
    assert.strictEqual(updateIncomeParams.date, sampleData.incomes.income2.date);
    assert.strictEqual(updateIncomeParams.description, sampleData.incomes.income2.description);
    assert.strictEqual(updateIncomeParams.householdMemberUuid, user1HouseholdMember2Uuid);
    assert.strictEqual(updateIncomeParams.incomeUuid, user1IncomeUuid);

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
        uuid: updateIncomeParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'PATCH');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/incomes/${user1IncomeUuid}`);
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
