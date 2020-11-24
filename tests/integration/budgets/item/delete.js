const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - DELETE /budgets/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let deleteBudgetSpy;

  let user1BudgetUuid;
  let user1SubcategoryUuid;
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
    deleteBudgetSpy = sinon.spy(controllers.BudgetCtrl, 'deleteBudget');
  });

  after('restore sinon spies', function() {
    deleteBudgetSpy.restore();
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

  beforeEach('create user 1 category', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
    user1SubcategoryUuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category2.name,
    });
  });

  beforeEach('create user 1 budget', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1BudgetUuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget1.month,
      subcategoryUuid: user1SubcategoryUuid,
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
    deleteBudgetSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .delete(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(deleteBudgetSpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .delete(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find budget.',
      }],
    });

    assert.strictEqual(deleteBudgetSpy.callCount, 1);
    const deleteBudgetParams = deleteBudgetSpy.getCall(0).args[0];
    assert.isOk(deleteBudgetParams.auditApiCallUuid);
    assert.strictEqual(deleteBudgetParams.budgetUuid, user1BudgetUuid);
  });

  it('should return 204 with the correct auth token', async function() {
    const res = await chai.request(server)
      .delete(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(204);
    assert.deepEqual(res.body, {});

    // Validate BudgetCtrl.deleteBudget call.
    assert.strictEqual(deleteBudgetSpy.callCount, 1);
    const deleteBudgetParams = deleteBudgetSpy.getCall(0).args[0];
    assert.isOk(deleteBudgetParams.auditApiCallUuid);
    assert.strictEqual(deleteBudgetParams.budgetUuid, user1BudgetUuid);

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
        uuid: deleteBudgetParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'DELETE');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/budgets/${user1BudgetUuid}`);
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
