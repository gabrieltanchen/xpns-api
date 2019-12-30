const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - PATCH /budgets/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let updateBudgetSpy;

  let user1BudgetUuid;
  let user1Subcategory1Uuid;
  let user1Subcategory2Uuid;
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
    updateBudgetSpy = sinon.spy(controllers.BudgetCtrl, 'updateBudget');
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

  beforeEach('create user 1 subcategory 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
    user1Subcategory1Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category2.name,
    });
  });

  beforeEach('create user 1 subcategory 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category3.name,
    });
    user1Subcategory2Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category4.name,
    });
  });

  beforeEach('create user 1 budget', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1BudgetUuid = await controllers.BudgetCtrl.createBudget({
      auditApiCallUuid: apiCall.get('uuid'),
      budgetCents: sampleData.budgets.budget1.budget_cents,
      month: sampleData.budgets.budget1.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: sampleData.budgets.budget1.year,
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
    updateBudgetSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .patch(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'budget-cents': sampleData.budgets.budget2.budget_cents,
            'month': sampleData.budgets.budget2.month,
            'year': sampleData.budgets.budget2.year,
          },
          'id': user1BudgetUuid,
          'relationships': {
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
          },
          'type': 'budgets',
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(updateBudgetSpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .patch(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        'data': {
          'attributes': {
            'budget-cents': sampleData.budgets.budget2.budget_cents,
            'month': sampleData.budgets.budget2.month,
            'year': sampleData.budgets.budget2.year,
          },
          'id': user1BudgetUuid,
          'relationships': {
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
          },
          'type': 'budgets',
        },
      });
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find budget.',
      }],
    });
    assert.strictEqual(updateBudgetSpy.callCount, 1);
    const updateBudgetParams = updateBudgetSpy.getCall(0).args[0];
    assert.isOk(updateBudgetParams.auditApiCallUuid);
    assert.strictEqual(updateBudgetParams.budgetCents, sampleData.budgets.budget2.budget_cents);
    assert.strictEqual(updateBudgetParams.budgetUuid, user1BudgetUuid);
    assert.strictEqual(updateBudgetParams.month, sampleData.budgets.budget2.month);
    assert.strictEqual(updateBudgetParams.subcategoryUuid, user1Subcategory2Uuid);
    assert.strictEqual(updateBudgetParams.year, sampleData.budgets.budget2.year);
  });

  it('should return 422 with no budget cents', async function() {
    const res = await chai.request(server)
      .patch(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'budget-cents': null,
            'month': sampleData.budgets.budget2.month,
            'year': sampleData.budgets.budget2.year,
          },
          'id': user1BudgetUuid,
          'relationships': {
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
          },
          'type': 'budgets',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Budget is required.',
        source: {
          pointer: '/data/attributes/budget-cents',
        },
      }],
    });
    assert.strictEqual(updateBudgetSpy.callCount, 0);
  });

  it('should return 422 with an invalid budget cents', async function() {
    const res = await chai.request(server)
      .patch(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'budget-cents': sampleData.budgets.budget2.budget,
            'month': sampleData.budgets.budget2.month,
            'year': sampleData.budgets.budget2.year,
          },
          'id': user1BudgetUuid,
          'relationships': {
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
          },
          'type': 'budgets',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Budget must be an integer.',
        source: {
          pointer: '/data/attributes/budget-cents',
        },
      }],
    });
    assert.strictEqual(updateBudgetSpy.callCount, 0);
  });

  it('should return 422 with no month', async function() {
    const res = await chai.request(server)
      .patch(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'budget-cents': sampleData.budgets.budget2.budget_cents,
            'month': null,
            'year': sampleData.budgets.budget2.year,
          },
          'id': user1BudgetUuid,
          'relationships': {
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
          },
          'type': 'budgets',
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
    assert.strictEqual(updateBudgetSpy.callCount, 0);
  });

  it('should retu4n 422 with an invalid month', async function() {
    const res = await chai.request(server)
      .patch(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'budget-cents': sampleData.budgets.budget2.budget_cents,
            'month': '1.0',
            'year': sampleData.budgets.budget2.year,
          },
          'id': user1BudgetUuid,
          'relationships': {
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
          },
          'type': 'budgets',
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
    assert.strictEqual(updateBudgetSpy.callCount, 0);
  });

  it('should return 422 with no year', async function() {
    const res = await chai.request(server)
      .patch(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'budget-cents': sampleData.budgets.budget2.budget_cents,
            'month': sampleData.budgets.budget2.month,
            'year': null,
          },
          'id': user1BudgetUuid,
          'relationships': {
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
          },
          'type': 'budgets',
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
    assert.strictEqual(updateBudgetSpy.callCount, 0);
  });

  it('should return 422 with an invalid year', async function() {
    const res = await chai.request(server)
      .patch(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'budget-cents': sampleData.budgets.budget2.budget_cents,
            'month': sampleData.budgets.budget2.month,
            'year': '1.0',
          },
          'id': user1BudgetUuid,
          'relationships': {
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
          },
          'type': 'budgets',
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
    assert.strictEqual(updateBudgetSpy.callCount, 0);
  });

  it('should return 422 with no subcategory uuid', async function() {
    const res = await chai.request(server)
      .patch(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'budget-cents': sampleData.budgets.budget2.budget_cents,
            'month': sampleData.budgets.budget2.month,
            'year': sampleData.budgets.budget2.year,
          },
          'id': user1BudgetUuid,
          'relationships': {
            'subcategory': {
              'data': {
                'id': null,
              },
            },
          },
          'type': 'budgets',
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
    assert.strictEqual(updateBudgetSpy.callCount, 0);
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .patch(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'budget-cents': sampleData.budgets.budget2.budget_cents,
            'month': sampleData.budgets.budget2.month,
            'year': sampleData.budgets.budget2.year,
          },
          'id': user1BudgetUuid,
          'relationships': {
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
          },
          'type': 'budgets',
        },
      });
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes['budget-cents'], sampleData.budgets.budget2.budget_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.month, sampleData.budgets.budget2.month);
    assert.strictEqual(res.body.data.attributes.year, sampleData.budgets.budget2.year);
    assert.strictEqual(res.body.data.id, user1BudgetUuid);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships.subcategory);
    assert.isOk(res.body.data.relationships.subcategory.data);
    assert.strictEqual(res.body.data.relationships.subcategory.data.id, user1Subcategory2Uuid);
    assert.strictEqual(res.body.data.type, 'budgets');

    // Validate BudgetCtrl.updateBudget call.
    assert.strictEqual(updateBudgetSpy.callCount, 1);
    const updateBudgetParams = updateBudgetSpy.getCall(0).args[0];
    assert.isOk(updateBudgetParams.auditApiCallUuid);
    assert.strictEqual(updateBudgetParams.budgetCents, sampleData.budgets.budget2.budget_cents);
    assert.strictEqual(updateBudgetParams.budgetUuid, user1BudgetUuid);
    assert.strictEqual(updateBudgetParams.month, sampleData.budgets.budget2.month);
    assert.strictEqual(updateBudgetParams.subcategoryUuid, user1Subcategory2Uuid);
    assert.strictEqual(updateBudgetParams.year, sampleData.budgets.budget2.year);

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
        uuid: updateBudgetParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'PATCH');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/budgets/${user1BudgetUuid}`);
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
