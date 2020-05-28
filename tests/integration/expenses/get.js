const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

const validateExpense = ({
  expectedExpense,
  expenseUuid,
  householdMemberUuid,
  returnedExpense,
  subcategoryUuid,
  vendorUuid,
}) => {
  assert.isOk(returnedExpense.attributes);
  // assert.strictEqual(returnedExpense.attributes.amount, expectedExpense.amount);
  assert.strictEqual(returnedExpense.attributes['amount-cents'], expectedExpense.amount_cents);
  assert.isOk(returnedExpense.attributes['created-at']);
  assert.strictEqual(returnedExpense.attributes.date, expectedExpense.date);
  assert.strictEqual(returnedExpense.attributes.description, expectedExpense.description);
  // assert.strictEqual(returnedExpense.attributes['reimbursed-amount'], expectedExpense.reimbursed_amount);
  assert.strictEqual(returnedExpense.attributes['reimbursed-cents'], expectedExpense.reimbursed_cents);
  assert.strictEqual(returnedExpense.id, expenseUuid);
  assert.isOk(returnedExpense.relationships);
  assert.isOk(returnedExpense.relationships['household-member']);
  assert.isOk(returnedExpense.relationships['household-member'].data);
  assert.strictEqual(returnedExpense.relationships['household-member'].data.id, householdMemberUuid);
  assert.isOk(returnedExpense.relationships.subcategory);
  assert.isOk(returnedExpense.relationships.subcategory.data);
  assert.strictEqual(returnedExpense.relationships.subcategory.data.id, subcategoryUuid);
  assert.isOk(returnedExpense.relationships.vendor);
  assert.isOk(returnedExpense.relationships.vendor.data);
  assert.strictEqual(returnedExpense.relationships.vendor.data.id, vendorUuid);
  assert.strictEqual(returnedExpense.type, 'expenses');
};

chai.use(chaiHttp);

describe('Integration - GET /expenses', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let expense1Uuid;
  let expense2Uuid;
  let expense3Uuid;
  let expense4Uuid;
  let expense5Uuid;
  let expense6Uuid;
  let expense7Uuid;
  let expense8Uuid;
  let expense9Uuid;
  let expense10Uuid;
  let expense11Uuid;
  let expense12Uuid;
  let expense13Uuid;
  let expense14Uuid;
  let expense15Uuid;
  let expense16Uuid;
  let expense17Uuid;
  let expense18Uuid;
  let expense19Uuid;
  let expense20Uuid;
  let expense21Uuid;
  let expense22Uuid;
  let expense23Uuid;
  let expense24Uuid;
  let expense25Uuid;
  let expense26Uuid;
  let expense27Uuid;
  let expense28Uuid;
  let householdMember1Uuid;
  let householdMember2Uuid;
  let subcategory1Uuid;
  let subcategory2Uuid;
  let user1Token;
  let user1Uuid;
  let user2Token;
  let user2Uuid;
  let vendor1Uuid;
  let vendor2Uuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create user 1', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user1Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });
  });

  before('create user 1 token', async function() {
    user1Token = await controllers.UserCtrl.getToken(user1Uuid);
  });

  before('create user 2', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    user2Uuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user2.email,
      firstName: sampleData.users.user2.firstName,
      lastName: sampleData.users.user2.lastName,
      password: sampleData.users.user2.password,
    });
  });

  before('create user 2 token', async function() {
    user2Token = await controllers.UserCtrl.getToken(user2Uuid);
  });

  before('create subcategory 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
    subcategory1Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category2.name,
    });
  });

  before('create subcategory 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category3.name,
    });
    subcategory2Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category4.name,
    });
  });

  before('create vendor 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor1Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });
  });

  before('create vendor 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor2Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor2.name,
    });
  });

  before('create household member 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    householdMember1Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user1.firstName,
    });
  });

  before('create household member 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    householdMember2Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user2.firstName,
    });
  });

  before('create expense 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense1Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense2Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense2.date,
      description: sampleData.expenses.expense2.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense3Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense3.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense3.date,
      description: sampleData.expenses.expense3.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense3.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense4Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense4.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense4.date,
      description: sampleData.expenses.expense4.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense4.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense5Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense5.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense5.date,
      description: sampleData.expenses.expense5.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense5.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense6Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense6.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense6.date,
      description: sampleData.expenses.expense6.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense6.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense7Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense7.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense7.date,
      description: sampleData.expenses.expense7.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense7.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense8Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense8.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense8.date,
      description: sampleData.expenses.expense8.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense8.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense9Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense9.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense9.date,
      description: sampleData.expenses.expense9.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense9.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense10Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense10.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense10.date,
      description: sampleData.expenses.expense10.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense10.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense11Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense11.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense11.date,
      description: sampleData.expenses.expense11.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense11.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense12Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense12.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense12.date,
      description: sampleData.expenses.expense12.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense12.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense13Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense13.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense13.date,
      description: sampleData.expenses.expense13.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense13.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense14Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense14.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense14.date,
      description: sampleData.expenses.expense14.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense14.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense15Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense15.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense15.date,
      description: sampleData.expenses.expense15.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense15.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense16Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense16.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense16.date,
      description: sampleData.expenses.expense16.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense16.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense17Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense17.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense17.date,
      description: sampleData.expenses.expense17.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense17.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense18Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense18.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense18.date,
      description: sampleData.expenses.expense18.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense18.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense19Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense19.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense19.date,
      description: sampleData.expenses.expense19.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense19.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense20Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense20.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense20.date,
      description: sampleData.expenses.expense20.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense20.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense21Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense21.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense21.date,
      description: sampleData.expenses.expense21.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense21.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense22Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense22.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense22.date,
      description: sampleData.expenses.expense22.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense22.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense23Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense23.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense23.date,
      description: sampleData.expenses.expense23.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense23.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense24Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense24.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense24.date,
      description: sampleData.expenses.expense24.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense24.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense25Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense25.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense25.date,
      description: sampleData.expenses.expense25.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense25.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense26Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense26.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense26.date,
      description: sampleData.expenses.expense26.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense26.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense27Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense27.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense27.date,
      description: sampleData.expenses.expense27.description,
      householdMemberUuid: householdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense27.reimbursed_cents,
      subcategoryUuid: subcategory1Uuid,
      vendorUuid: vendor1Uuid,
    });
  });

  before('create expense 28', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expense28Uuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense28.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense28.date,
      description: sampleData.expenses.expense28.description,
      householdMemberUuid: householdMember2Uuid,
      reimbursedCents: sampleData.expenses.expense28.reimbursed_cents,
      subcategoryUuid: subcategory2Uuid,
      vendorUuid: vendor2Uuid,
    });
  });

  after('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get('/expenses')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 403 with no subcategory id or vendor id', async function() {
    const res = await chai.request(server)
      .get('/expenses')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(403);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Subcategory or vendor ID is required.',
      }],
    });
  });

  describe('when called with the subcategory_uuid query param', function() {
    it('should return 404 when the subcategory does not exist', async function() {
      const res = await chai.request(server)
        .get(`/expenses?subcategory_uuid=${uuidv4()}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find category.',
        }],
      });
    });

    it('should return 404 when the subcategory belongs to a different household', async function() {
      const res = await chai.request(server)
        .get(`/expenses?subcategory_uuid=${subcategory1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user2Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find category.',
        }],
      });
    });

    it('should return 200 and 25 expenses as user 1 with subcategory 1 and no limit or page specified', async function() {
      const res = await chai.request(server)
        .get(`/expenses?subcategory_uuid=${subcategory1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 25);

      // Expense 27
      validateExpense({
        expectedExpense: sampleData.expenses.expense27,
        expenseUuid: expense27Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 26
      validateExpense({
        expectedExpense: sampleData.expenses.expense26,
        expenseUuid: expense26Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 25
      validateExpense({
        expectedExpense: sampleData.expenses.expense25,
        expenseUuid: expense25Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 24
      validateExpense({
        expectedExpense: sampleData.expenses.expense24,
        expenseUuid: expense24Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[3],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 23
      validateExpense({
        expectedExpense: sampleData.expenses.expense23,
        expenseUuid: expense23Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[4],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 22
      validateExpense({
        expectedExpense: sampleData.expenses.expense22,
        expenseUuid: expense22Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[5],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 21
      validateExpense({
        expectedExpense: sampleData.expenses.expense21,
        expenseUuid: expense21Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[6],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 20
      validateExpense({
        expectedExpense: sampleData.expenses.expense20,
        expenseUuid: expense20Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[7],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 19
      validateExpense({
        expectedExpense: sampleData.expenses.expense19,
        expenseUuid: expense19Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[8],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 18
      validateExpense({
        expectedExpense: sampleData.expenses.expense18,
        expenseUuid: expense18Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[9],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 17
      validateExpense({
        expectedExpense: sampleData.expenses.expense17,
        expenseUuid: expense17Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[10],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 16
      validateExpense({
        expectedExpense: sampleData.expenses.expense16,
        expenseUuid: expense16Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[11],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 15
      validateExpense({
        expectedExpense: sampleData.expenses.expense15,
        expenseUuid: expense15Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[12],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 14
      validateExpense({
        expectedExpense: sampleData.expenses.expense14,
        expenseUuid: expense14Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[13],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 13
      validateExpense({
        expectedExpense: sampleData.expenses.expense13,
        expenseUuid: expense13Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[14],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 12
      validateExpense({
        expectedExpense: sampleData.expenses.expense12,
        expenseUuid: expense12Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[15],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 11
      validateExpense({
        expectedExpense: sampleData.expenses.expense11,
        expenseUuid: expense11Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[16],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 10
      validateExpense({
        expectedExpense: sampleData.expenses.expense10,
        expenseUuid: expense10Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[17],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 9
      validateExpense({
        expectedExpense: sampleData.expenses.expense9,
        expenseUuid: expense9Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[18],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 8
      validateExpense({
        expectedExpense: sampleData.expenses.expense8,
        expenseUuid: expense8Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[19],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 7
      validateExpense({
        expectedExpense: sampleData.expenses.expense7,
        expenseUuid: expense7Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[20],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 6
      validateExpense({
        expectedExpense: sampleData.expenses.expense6,
        expenseUuid: expense6Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[21],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 5
      validateExpense({
        expectedExpense: sampleData.expenses.expense5,
        expenseUuid: expense5Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[22],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 4
      validateExpense({
        expectedExpense: sampleData.expenses.expense4,
        expenseUuid: expense4Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[23],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 3
      validateExpense({
        expectedExpense: sampleData.expenses.expense3,
        expenseUuid: expense3Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[24],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user1.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor1Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor1.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 2 expenses as user 1 with subcategory 1 and no limit and page=2', async function() {
      const res = await chai.request(server)
        .get(`/expenses?subcategory_uuid=${subcategory1Uuid}&page=2`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);

      // Expense 2
      validateExpense({
        expectedExpense: sampleData.expenses.expense2,
        expenseUuid: expense2Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 1
      validateExpense({
        expectedExpense: sampleData.expenses.expense1,
        expenseUuid: expense1Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user1.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor1Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor1.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 5 expenses as user 1 with subcategory 1 limit=5 and page=4', async function() {
      const res = await chai.request(server)
        .get(`/expenses?subcategory_uuid=${subcategory1Uuid}&limit=5&page=4`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 5);

      // Expense 12
      validateExpense({
        expectedExpense: sampleData.expenses.expense12,
        expenseUuid: expense12Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 11
      validateExpense({
        expectedExpense: sampleData.expenses.expense11,
        expenseUuid: expense11Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 10
      validateExpense({
        expectedExpense: sampleData.expenses.expense10,
        expenseUuid: expense10Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 9
      validateExpense({
        expectedExpense: sampleData.expenses.expense9,
        expenseUuid: expense9Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[3],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 8
      validateExpense({
        expectedExpense: sampleData.expenses.expense8,
        expenseUuid: expense8Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[4],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user1.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor1Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor1.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 6);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 1 expense as user 1 with subcategory 2', async function() {
      const res = await chai.request(server)
        .get(`/expenses?subcategory_uuid=${subcategory2Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);

      // Expense 28
      validateExpense({
        expectedExpense: sampleData.expenses.expense28,
        expenseUuid: expense28Uuid,
        householdMemberUuid: householdMember2Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory2Uuid,
        vendorUuid: vendor2Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory2Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category4.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember2Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user2.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor2Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor2.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 1);
    });
  });

  describe('when called with the vendor_id query param', function() {
    it('should return 404 when the vendor does not exist', async function() {
      const res = await chai.request(server)
        .get(`/expenses?vendor_id=${uuidv4()}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find vendor.',
        }],
      });
    });

    it('should return 404 when the vendor belongs to a different household', async function() {
      const res = await chai.request(server)
        .get(`/expenses?vendor_id=${vendor1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user2Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find vendor.',
        }],
      });
    });

    it('should return 200 and 25 expenses as user 1 with vendor 1 and no limit or page specified', async function() {
      const res = await chai.request(server)
        .get(`/expenses?vendor_id=${vendor1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 25);

      // Expense 27
      validateExpense({
        expectedExpense: sampleData.expenses.expense27,
        expenseUuid: expense27Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 26
      validateExpense({
        expectedExpense: sampleData.expenses.expense26,
        expenseUuid: expense26Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 25
      validateExpense({
        expectedExpense: sampleData.expenses.expense25,
        expenseUuid: expense25Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 24
      validateExpense({
        expectedExpense: sampleData.expenses.expense24,
        expenseUuid: expense24Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[3],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 23
      validateExpense({
        expectedExpense: sampleData.expenses.expense23,
        expenseUuid: expense23Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[4],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 22
      validateExpense({
        expectedExpense: sampleData.expenses.expense22,
        expenseUuid: expense22Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[5],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 21
      validateExpense({
        expectedExpense: sampleData.expenses.expense21,
        expenseUuid: expense21Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[6],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 20
      validateExpense({
        expectedExpense: sampleData.expenses.expense20,
        expenseUuid: expense20Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[7],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 19
      validateExpense({
        expectedExpense: sampleData.expenses.expense19,
        expenseUuid: expense19Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[8],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 18
      validateExpense({
        expectedExpense: sampleData.expenses.expense18,
        expenseUuid: expense18Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[9],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 17
      validateExpense({
        expectedExpense: sampleData.expenses.expense17,
        expenseUuid: expense17Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[10],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 16
      validateExpense({
        expectedExpense: sampleData.expenses.expense16,
        expenseUuid: expense16Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[11],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 15
      validateExpense({
        expectedExpense: sampleData.expenses.expense15,
        expenseUuid: expense15Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[12],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 14
      validateExpense({
        expectedExpense: sampleData.expenses.expense14,
        expenseUuid: expense14Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[13],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 13
      validateExpense({
        expectedExpense: sampleData.expenses.expense13,
        expenseUuid: expense13Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[14],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 12
      validateExpense({
        expectedExpense: sampleData.expenses.expense12,
        expenseUuid: expense12Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[15],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 11
      validateExpense({
        expectedExpense: sampleData.expenses.expense11,
        expenseUuid: expense11Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[16],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 10
      validateExpense({
        expectedExpense: sampleData.expenses.expense10,
        expenseUuid: expense10Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[17],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 9
      validateExpense({
        expectedExpense: sampleData.expenses.expense9,
        expenseUuid: expense9Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[18],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 8
      validateExpense({
        expectedExpense: sampleData.expenses.expense8,
        expenseUuid: expense8Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[19],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 7
      validateExpense({
        expectedExpense: sampleData.expenses.expense7,
        expenseUuid: expense7Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[20],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 6
      validateExpense({
        expectedExpense: sampleData.expenses.expense6,
        expenseUuid: expense6Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[21],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 5
      validateExpense({
        expectedExpense: sampleData.expenses.expense5,
        expenseUuid: expense5Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[22],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 4
      validateExpense({
        expectedExpense: sampleData.expenses.expense4,
        expenseUuid: expense4Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[23],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 3
      validateExpense({
        expectedExpense: sampleData.expenses.expense3,
        expenseUuid: expense3Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[24],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user1.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor1Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor1.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 2 expenses as user 1 with vendor 1 and no limit and page=2', async function() {
      const res = await chai.request(server)
        .get(`/expenses?vendor_id=${vendor1Uuid}&page=2`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);

      // Expense 2
      validateExpense({
        expectedExpense: sampleData.expenses.expense2,
        expenseUuid: expense2Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 1
      validateExpense({
        expectedExpense: sampleData.expenses.expense1,
        expenseUuid: expense1Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user1.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor1Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor1.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 5 expenses as user 1 with vendor 1 and limit=5 and page=4', async function() {
      const res = await chai.request(server)
        .get(`/expenses?vendor_id=${vendor1Uuid}&limit=5&page=4`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 5);

      // Expense 12
      validateExpense({
        expectedExpense: sampleData.expenses.expense12,
        expenseUuid: expense12Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 11
      validateExpense({
        expectedExpense: sampleData.expenses.expense11,
        expenseUuid: expense11Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 10
      validateExpense({
        expectedExpense: sampleData.expenses.expense10,
        expenseUuid: expense10Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 9
      validateExpense({
        expectedExpense: sampleData.expenses.expense9,
        expenseUuid: expense9Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[3],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 8
      validateExpense({
        expectedExpense: sampleData.expenses.expense8,
        expenseUuid: expense8Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[4],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user1.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor1Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor1.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 6);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 1 expense as user 1 with vendor 2', async function() {
      const res = await chai.request(server)
        .get(`/expenses?vendor_id=${vendor2Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);

      // Expense 28
      validateExpense({
        expectedExpense: sampleData.expenses.expense28,
        expenseUuid: expense28Uuid,
        householdMemberUuid: householdMember2Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory2Uuid,
        vendorUuid: vendor2Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory2Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category4.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember2Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user2.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor2Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor2.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 1);
    });
  });

  describe('when called with the household_member_id query param', function() {
    it('should return 404 when the household member does not exist', async function() {
      const res = await chai.request(server)
        .get(`/expenses?household_member_id=${uuidv4()}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find member.',
        }],
      });
    });

    it('should return 200 and 25 expenses as user 1 with household member 1 with no limit or page specified', async function() {
      const res = await chai.request(server)
        .get(`/expenses?household_member_id=${householdMember1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 25);

      // Expense 27
      validateExpense({
        expectedExpense: sampleData.expenses.expense27,
        expenseUuid: expense27Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 26
      validateExpense({
        expectedExpense: sampleData.expenses.expense26,
        expenseUuid: expense26Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 25
      validateExpense({
        expectedExpense: sampleData.expenses.expense25,
        expenseUuid: expense25Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 24
      validateExpense({
        expectedExpense: sampleData.expenses.expense24,
        expenseUuid: expense24Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[3],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 23
      validateExpense({
        expectedExpense: sampleData.expenses.expense23,
        expenseUuid: expense23Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[4],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 22
      validateExpense({
        expectedExpense: sampleData.expenses.expense22,
        expenseUuid: expense22Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[5],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 21
      validateExpense({
        expectedExpense: sampleData.expenses.expense21,
        expenseUuid: expense21Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[6],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 20
      validateExpense({
        expectedExpense: sampleData.expenses.expense20,
        expenseUuid: expense20Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[7],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 19
      validateExpense({
        expectedExpense: sampleData.expenses.expense19,
        expenseUuid: expense19Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[8],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 18
      validateExpense({
        expectedExpense: sampleData.expenses.expense18,
        expenseUuid: expense18Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[9],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 17
      validateExpense({
        expectedExpense: sampleData.expenses.expense17,
        expenseUuid: expense17Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[10],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 16
      validateExpense({
        expectedExpense: sampleData.expenses.expense16,
        expenseUuid: expense16Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[11],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 15
      validateExpense({
        expectedExpense: sampleData.expenses.expense15,
        expenseUuid: expense15Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[12],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 14
      validateExpense({
        expectedExpense: sampleData.expenses.expense14,
        expenseUuid: expense14Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[13],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 13
      validateExpense({
        expectedExpense: sampleData.expenses.expense13,
        expenseUuid: expense13Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[14],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 12
      validateExpense({
        expectedExpense: sampleData.expenses.expense12,
        expenseUuid: expense12Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[15],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 11
      validateExpense({
        expectedExpense: sampleData.expenses.expense11,
        expenseUuid: expense11Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[16],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 10
      validateExpense({
        expectedExpense: sampleData.expenses.expense10,
        expenseUuid: expense10Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[17],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 9
      validateExpense({
        expectedExpense: sampleData.expenses.expense9,
        expenseUuid: expense9Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[18],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 8
      validateExpense({
        expectedExpense: sampleData.expenses.expense8,
        expenseUuid: expense8Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[19],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 7
      validateExpense({
        expectedExpense: sampleData.expenses.expense7,
        expenseUuid: expense7Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[20],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 6
      validateExpense({
        expectedExpense: sampleData.expenses.expense6,
        expenseUuid: expense6Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[21],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 5
      validateExpense({
        expectedExpense: sampleData.expenses.expense5,
        expenseUuid: expense5Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[22],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 4
      validateExpense({
        expectedExpense: sampleData.expenses.expense4,
        expenseUuid: expense4Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[23],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 3
      validateExpense({
        expectedExpense: sampleData.expenses.expense3,
        expenseUuid: expense3Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[24],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user1.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor1Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor1.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 2 expenses as user 1 with household member 1 and no limit and page=2', async function() {
      const res = await chai.request(server)
        .get(`/expenses?household_member_id=${householdMember1Uuid}&page=2`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);

      // Expense 2
      validateExpense({
        expectedExpense: sampleData.expenses.expense2,
        expenseUuid: expense2Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 1
      validateExpense({
        expectedExpense: sampleData.expenses.expense1,
        expenseUuid: expense1Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user1.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor1Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor1.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 5 expenses as user 1 with household member 1 and limit=5 and page=4', async function() {
      const res = await chai.request(server)
        .get(`/expenses?household_member_id=${householdMember1Uuid}&limit=5&page=4`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 5);

      // Expense 12
      validateExpense({
        expectedExpense: sampleData.expenses.expense12,
        expenseUuid: expense12Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 11
      validateExpense({
        expectedExpense: sampleData.expenses.expense11,
        expenseUuid: expense11Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 10
      validateExpense({
        expectedExpense: sampleData.expenses.expense10,
        expenseUuid: expense10Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 9
      validateExpense({
        expectedExpense: sampleData.expenses.expense9,
        expenseUuid: expense9Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[3],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      // Expense 8
      validateExpense({
        expectedExpense: sampleData.expenses.expense8,
        expenseUuid: expense8Uuid,
        householdMemberUuid: householdMember1Uuid,
        returnedExpense: res.body.data[4],
        subcategoryUuid: subcategory1Uuid,
        vendorUuid: vendor1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember1Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user1.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor1Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor1.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 6);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 1 expense as user 1 with household member 2', async function() {
      const res = await chai.request(server)
        .get(`/expenses?household_member_id=${householdMember2Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);

      // Expense 28
      validateExpense({
        expectedExpense: sampleData.expenses.expense28,
        expenseUuid: expense28Uuid,
        householdMemberUuid: householdMember2Uuid,
        returnedExpense: res.body.data[0],
        subcategoryUuid: subcategory2Uuid,
        vendorUuid: vendor2Uuid,
      });

      assert.isOk(res.body.included);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === subcategory2Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category4.name);
      const householdMemberInclude = _.find(res.body.included, (include) => {
        return include.id === householdMember2Uuid
          && include.type === 'household-members';
      });
      assert.isOk(householdMemberInclude);
      assert.isOk(householdMemberInclude.attributes);
      assert.strictEqual(householdMemberInclude.attributes.name, sampleData.users.user2.firstName);
      const vendorInclude = _.find(res.body.included, (include) => {
        return include.id === vendor2Uuid
          && include.type === 'vendors';
      });
      assert.isOk(vendorInclude);
      assert.isOk(vendorInclude.attributes);
      assert.strictEqual(vendorInclude.attributes.name, sampleData.vendors.vendor2.name);
      assert.strictEqual(res.body.included.length, 3);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 1);
    });
  });
});
