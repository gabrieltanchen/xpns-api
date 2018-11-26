const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /expenses/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let expenseUuid;
  let user1CategoryUuid;
  let user1Token;
  let user1Uuid;
  let user1VendorUuid;
  let user2CategoryUuid;
  let user2Token;
  let user2Uuid;
  let user2VendorUuid;

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

  beforeEach('create user 1 category', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1CategoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
  });

  beforeEach('create user 1 vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1VendorUuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
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

  beforeEach('create user 2 category', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    user2CategoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
  });

  beforeEach('create user 2 vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    user2VendorUuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });
  });

  beforeEach('create expense', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expenseUuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: user1CategoryUuid,
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
      vendorUuid: user1VendorUuid,
    });
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 404 when the expense is soft deleted', async function() {
    await models.Expense.destroy({
      where: {
        uuid: expenseUuid,
      },
    });
    const res = await chai.request(server)
      .get(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Not found',
      }],
    });
  });

  it('should return 404 when the expense belongs to a different household', async function() {
    const res = await chai.request(server)
      .get(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Not found',
      }],
    });
  });

  // This should not happen.
  it('should return 404 when the expense category belongs to a different household', async function() {
    await models.Expense.update({
      category_uuid: user2CategoryUuid,
    }, {
      where: {
        uuid: expenseUuid,
      },
    });
    const res = await chai.request(server)
      .get(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Not found',
      }],
    });
  });

  // This should not happen.
  it('should return 404 when the expense vendor belongs to a different household', async function() {
    await models.Expense.update({
      vendor_uuid: user2VendorUuid,
    }, {
      where: {
        uuid: expenseUuid,
      },
    });
    const res = await chai.request(server)
      .get(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Not found',
      }],
    });
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .get(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes.amount, sampleData.expenses.expense1.amount);
    assert.strictEqual(res.body.data.attributes['amount-cents'], sampleData.expenses.expense1.amount_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.date, sampleData.expenses.expense1.date);
    assert.strictEqual(
      res.body.data.attributes.description,
      sampleData.expenses.expense1.description,
    );
    assert.strictEqual(res.body.data.attributes['reimbursed-amount'], sampleData.expenses.expense1.reimbursed_amount);
    assert.strictEqual(res.body.data.attributes['reimbursed-cents'], sampleData.expenses.expense1.reimbursed_cents);
    assert.strictEqual(res.body.data.id, expenseUuid);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships.category);
    assert.isOk(res.body.data.relationships.category.data);
    assert.strictEqual(res.body.data.relationships.category.data.id, user1CategoryUuid);
    assert.isOk(res.body.data.relationships.vendor);
    assert.isOk(res.body.data.relationships.vendor.data);
    assert.strictEqual(res.body.data.relationships.vendor.data.id, user1VendorUuid);
    assert.strictEqual(res.body.data.type, 'expenses');
  });
});