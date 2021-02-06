const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /budgets', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let createBudgetSpy;

  let subcategoryUuid;
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
    createBudgetSpy = sinon.spy(controllers.BudgetCtrl, 'createBudget');
  });

  after('restore sinon spies', function() {
    createBudgetSpy.restore();
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

  beforeEach('create category', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
    subcategoryUuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category2.name,
    });
  });

  afterEach('reset history for sinon spies', function() {
    createBudgetSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .post('/budgets')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.budgets.budget1.amount_cents,
            'month': sampleData.budgets.budget1.month,
            'year': sampleData.budgets.budget1.year,
          },
          'relationships': {
            'subcategory': {
              'data': {
                'id': subcategoryUuid,
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
    assert.strictEqual(createBudgetSpy.callCount, 0);
  });

  it('should return 422 with no amount', async function() {
    const res = await chai.request(server)
      .post('/budgets')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': null,
            'month': sampleData.budgets.budget1.month,
            'year': sampleData.budgets.budget1.year,
          },
          'relationships': {
            'subcategory': {
              'data': {
                'id': subcategoryUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Budget is required.',
        source: {
          pointer: '/data/attributes/amount',
        },
      }],
    });
    assert.strictEqual(createBudgetSpy.callCount, 0);
  });

  it('should return 422 with an invalid amount', async function() {
    const res = await chai.request(server)
      .post('/budgets')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': '12.34',
            'month': sampleData.budgets.budget1.month,
            'year': sampleData.budgets.budget1.year,
          },
          'relationships': {
            'subcategory': {
              'data': {
                'id': subcategoryUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Budget must be an integer.',
        source: {
          pointer: '/data/attributes/amount',
        },
      }],
    });
    assert.strictEqual(createBudgetSpy.callCount, 0);
  });

  it('should return 422 with no month', async function() {
    const res = await chai.request(server)
      .post('/budgets')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.budgets.budget1.amount_cents,
            'month': null,
            'year': sampleData.budgets.budget1.year,
          },
          'relationships': {
            'subcategory': {
              'data': {
                'id': subcategoryUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Month is required.',
        source: {
          pointer: '/data/attributes/month',
        },
      }],
    });
    assert.strictEqual(createBudgetSpy.callCount, 0);
  });

  it('should return 422 with an invalid month', async function() {
    const res = await chai.request(server)
      .post('/budgets')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.budgets.budget1.amount_cents,
            'month': '1.0',
            'year': sampleData.budgets.budget1.year,
          },
          'relationships': {
            'subcategory': {
              'data': {
                'id': subcategoryUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Month must be an integer.',
        source: {
          pointer: '/data/attributes/month',
        },
      }],
    });
    assert.strictEqual(createBudgetSpy.callCount, 0);
  });

  it('should return 422 with no year', async function() {
    const res = await chai.request(server)
      .post('/budgets')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.budgets.budget1.amount_cents,
            'month': sampleData.budgets.budget1.month,
            'year': null,
          },
          'relationships': {
            'subcategory': {
              'data': {
                'id': subcategoryUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Year is required.',
        source: {
          pointer: '/data/attributes/year',
        },
      }],
    });
    assert.strictEqual(createBudgetSpy.callCount, 0);
  });

  it('should return 422 with an invalid year', async function() {
    const res = await chai.request(server)
      .post('/budgets')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.budgets.budget1.amount_cents,
            'month': sampleData.budgets.budget1.month,
            'year': '1.0',
          },
          'relationships': {
            'subcategory': {
              'data': {
                'id': subcategoryUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Year must be an integer.',
        source: {
          pointer: '/data/attributes/year',
        },
      }],
    });
    assert.strictEqual(createBudgetSpy.callCount, 0);
  });

  it('should return 422 with no subcategory uuid', async function() {
    const res = await chai.request(server)
      .post('/budgets')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.budgets.budget1.amount_cents,
            'month': sampleData.budgets.budget1.month,
            'year': sampleData.budgets.budget1.year,
          },
          'relationships': {
            'subcategory': {
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
        detail: 'Subcategory is required.',
        source: {
          pointer: '/data/relationships/subcategory/data/id',
        },
      }],
    });
    assert.strictEqual(createBudgetSpy.callCount, 0);
  });

  it('should return 201 with valid data', async function() {
    const res = await chai.request(server)
      .post('/budgets')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount': sampleData.budgets.budget1.amount_cents,
            'month': sampleData.budgets.budget1.month,
            'year': sampleData.budgets.budget1.year,
          },
          'relationships': {
            'subcategory': {
              'data': {
                'id': subcategoryUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(201);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes.amount, sampleData.budgets.budget1.amount_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.month, sampleData.budgets.budget1.month);
    assert.strictEqual(res.body.data.attributes.year, sampleData.budgets.budget1.year);
    assert.isOk(res.body.data.id);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships.subcategory);
    assert.isOk(res.body.data.relationships.subcategory.data);
    assert.strictEqual(res.body.data.relationships.subcategory.data.id, subcategoryUuid);
    assert.strictEqual(res.body.data.type, 'budgets');

    // Validate BudgetCtrl.createBudget call.
    assert.strictEqual(createBudgetSpy.callCount, 1);
    const createBudgetParams = createBudgetSpy.getCall(0).args[0];
    assert.strictEqual(createBudgetParams.amount, sampleData.budgets.budget1.amount_cents);
    assert.isOk(createBudgetParams.auditApiCallUuid);
    assert.strictEqual(createBudgetParams.month, sampleData.budgets.budget1.month);
    assert.strictEqual(createBudgetParams.subcategoryUuid, subcategoryUuid);
    assert.strictEqual(createBudgetParams.year, sampleData.budgets.budget1.year);

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
        uuid: createBudgetParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'POST');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), '/budgets');
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), userUuid);
  });
});
