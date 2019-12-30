const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /budgets/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1BudgetUuid;
  let user1SubcategoryUuid;
  let user1Token;
  let user1Uuid;
  let user2SubcategoryUuid;
  let user2Token;
  let user2Uuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
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

  beforeEach('create user 1 subcategory', async function() {
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
      auditApiCallUuid: apiCall.get('uuid'),
      budgetCents: sampleData.budgets.budget1.budget_cents,
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

  beforeEach('create user 2 subcategory', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category3.name,
    });
    user2SubcategoryUuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category4.name,
    });
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 404 when the budget is soft deleted', async function() {
    await models.Budget.destroy({
      where: {
        uuid: user1BudgetUuid,
      },
    });
    const res = await chai.request(server)
      .get(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find budget.',
      }],
    });
  });

  it('should return 404 when the budget belongs to a different household', async function() {
    const res = await chai.request(server)
      .get(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find budget.',
      }],
    });
  });

  // This should not happen.
  it('should return 404 when the budget category belongs to a different household', async function() {
    await models.Budget.update({
      subcategory_uuid: user2SubcategoryUuid,
    }, {
      where: {
        uuid: user1BudgetUuid,
      },
    });
    const res = await chai.request(server)
      .get(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find budget.',
      }],
    });
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .get(`/budgets/${user1BudgetUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes.budget, sampleData.budgets.budget1.budget);
    assert.strictEqual(res.body.data.attributes['budget-cents'], sampleData.budgets.budget1.budget_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.month, sampleData.budgets.budget1.month);
    assert.strictEqual(res.body.data.attributes.year, sampleData.budgets.budget1.year);
    assert.strictEqual(res.body.data.id, user1BudgetUuid);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships.subcategory);
    assert.isOk(res.body.data.relationships.subcategory.data);
    assert.strictEqual(res.body.data.relationships.subcategory.data.id, user1SubcategoryUuid);
    assert.strictEqual(res.body.data.type, 'budgets');
  });
});
