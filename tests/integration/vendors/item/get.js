const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /vendors/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1Token;
  let user1Uuid;
  let user1Vendor1Uuid;
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

  beforeEach('create user 1 vendor 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Vendor1Uuid = await controllers.VendorCtrl.createVendor({
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

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get(`/vendors/${user1Vendor1Uuid}`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .get(`/vendors/${user1Vendor1Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find vendor.',
      }],
    });
  });

  it('should return 404 when the vendor is soft deleted', async function() {
    await models.Vendor.destroy({
      where: {
        uuid: user1Vendor1Uuid,
      },
    });
    const res = await chai.request(server)
      .get(`/vendors/${user1Vendor1Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find vendor.',
      }],
    });
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .get(`/vendors/${user1Vendor1Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.name, sampleData.vendors.vendor1.name);
    assert.strictEqual(res.body.data.attributes['sum-amount'], 0);
    assert.strictEqual(res.body.data.attributes['sum-reimbursed'], 0);
    assert.strictEqual(res.body.data.id, user1Vendor1Uuid);
    assert.strictEqual(res.body.data.type, 'vendors');
  });

  describe('when the vendor has income and expense data', async function() {
    let user1HouseholdMemberUuid;
    let user1SubcategoryUuid;
    let user1Vendor2Uuid;

    beforeEach('create user 1 vendor 2', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      user1Vendor2Uuid = await controllers.VendorCtrl.createVendor({
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.vendors.vendor2.name,
      });
    });

    beforeEach('create user 1 household member', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      user1HouseholdMemberUuid = await controllers.HouseholdCtrl.createMember({
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.users.user1.firstName,
      });
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

    beforeEach('create user 1 expense 1', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense1.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense1.date,
        description: sampleData.expenses.expense1.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1Vendor1Uuid,
      });
    });

    beforeEach('create user 1 expense 2', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense2.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense2.date,
        description: sampleData.expenses.expense2.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1Vendor1Uuid,
      });
    });

    beforeEach('create user 1 expense 3', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: sampleData.expenses.expense3.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: sampleData.expenses.expense3.date,
        description: sampleData.expenses.expense3.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1Vendor2Uuid,
      });
    });

    it('should return 200 with the correct sums for the vendor', async function() {
      const res = await chai.request(server)
        .get(`/vendors/${user1Vendor1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.isOk(res.body.data.attributes['created-at']);
      assert.strictEqual(res.body.data.attributes.name, sampleData.vendors.vendor1.name);
      assert.strictEqual(res.body.data.attributes['sum-amount'], 110376);
      assert.strictEqual(res.body.data.attributes['sum-reimbursed'], 332);
      assert.strictEqual(res.body.data.id, user1Vendor1Uuid);
      assert.strictEqual(res.body.data.type, 'vendors');
    });
  });
});
