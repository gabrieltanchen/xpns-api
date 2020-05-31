const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../../sample-data');
const TestHelper = require('../../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /monthly-reports/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1HouseholdMemberUuid;
  let user1Subcategory1Uuid;
  let user1Subcategory2Uuid;
  let user1Subcategory3Uuid;
  let user1Token;
  let user1Uuid;
  let user1VendorUuid;
  let user2HouseholdMemberUuid;
  let user2SubcategoryUuid;
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

  beforeEach('create user 1 subcategory 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category5.name,
    });
    user1Subcategory3Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category6.name,
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

  beforeEach('create user 1 vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1VendorUuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });
  });

  beforeEach('create user 1 budget for the month before', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      auditApiCallUuid: apiCall.get('uuid'),
      budgetCents: sampleData.budgets.budget1.budget_cents,
      month: 2,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2019,
    });
  });

  beforeEach('create user 1 budget for the month after', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      auditApiCallUuid: apiCall.get('uuid'),
      budgetCents: sampleData.budgets.budget2.budget_cents,
      month: 4,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2019,
    });
  });

  beforeEach('create user 1 expense for the month before', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: '2019-03-31',
      description: sampleData.expenses.expense1.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 expense for the month after', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: '2019-05-01',
      description: sampleData.expenses.expense2.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 income for the month before', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: '2019-03-31',
      description: sampleData.incomes.income1.description,
      householdMemberUuid: user1HouseholdMemberUuid,
    });
  });

  beforeEach('create user 1 income for the month after', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: '2019-05-01',
      description: sampleData.incomes.income2.description,
      householdMemberUuid: user1HouseholdMemberUuid,
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

  beforeEach('create user 2 subcategory', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    const categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category7.name,
    });
    user2SubcategoryUuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category8.name,
    });
  });

  beforeEach('create user 2 household member', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    user2HouseholdMemberUuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user2.firstName,
    });
  });

  beforeEach('create user 2 vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    user2VendorUuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor2.name,
    });
  });

  beforeEach('create user 2 budget', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      auditApiCallUuid: apiCall.get('uuid'),
      budgetCents: sampleData.budgets.budget3.budget_cents,
      month: 3,
      subcategoryUuid: user2SubcategoryUuid,
      year: 2019,
    });
  });

  beforeEach('create user 2 expense', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense3.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: '2019-04-01',
      description: sampleData.expenses.expense3.description,
      householdMemberUuid: user2HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense3.reimbursed_cents,
      subcategoryUuid: user2SubcategoryUuid,
      vendorUuid: user2VendorUuid,
    });
  });

  beforeEach('create user 2 income', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    await controllers.IncomeCtrl.createIncome({
      amount: sampleData.incomes.income3.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: '2019-04-01',
      description: sampleData.incomes.income3.description,
      householdMemberUuid: user2HouseholdMemberUuid,
    });
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get('/monthly-reports/2019-3')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  describe('when there is no budget, expense or income', function() {
    it('should return 0 for all values', async function() {
      const res = await chai.request(server)
        .get('/monthly-reports/2019-3')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.strictEqual(res.body.data.attributes['actual-cents'], 0);
      assert.strictEqual(res.body.data.attributes['budget-cents'], 0);
      assert.strictEqual(res.body.data.attributes['income-cents'], 0);
      assert.strictEqual(res.body.data.id, '2019-3');
      assert.strictEqual(res.body.data.type, 'monthly-reports');
    });
  });

  describe('when budgets exist', function() {
    beforeEach('create budget 1', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget4.budget_cents,
        month: 3,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    beforeEach('create budget 2', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget5.budget_cents,
        month: 3,
        subcategoryUuid: user1Subcategory2Uuid,
        year: 2019,
      });
    });

    beforeEach('create budget 3', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget6.budget_cents,
        month: 3,
        subcategoryUuid: user1Subcategory3Uuid,
        year: 2019,
      });
    });

    it('should return the sum of the budgets', async function() {
      const res = await chai.request(server)
        .get('/monthly-reports/2019-3')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.strictEqual(res.body.data.attributes['actual-cents'], 0);
      assert.strictEqual(res.body.data.attributes['budget-cents'], 96214);
      assert.strictEqual(res.body.data.attributes['income-cents'], 0);
      assert.strictEqual(res.body.data.id, '2019-3');
      assert.strictEqual(res.body.data.type, 'monthly-reports');
    });
  });

  describe('when expenses exist', function() {
    beforeEach('create expense 1', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense4.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-01',
        description: sampleData.expenses.expense4.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense4.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create expense 2', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense5.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-15',
        description: sampleData.expenses.expense5.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense5.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create expense 3', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense6.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-30',
        description: sampleData.expenses.expense6.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense6.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    it('should return the sum of the actual spent', async function() {
      const res = await chai.request(server)
        .get('/monthly-reports/2019-3')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.strictEqual(res.body.data.attributes['actual-cents'], 180829);
      assert.strictEqual(res.body.data.attributes['budget-cents'], 0);
      assert.strictEqual(res.body.data.attributes['income-cents'], 0);
      assert.strictEqual(res.body.data.id, '2019-3');
      assert.strictEqual(res.body.data.type, 'monthly-reports');
    });
  });

  describe('when incomes exist', function() {
    beforeEach('create income 1', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income4.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-01',
        description: sampleData.incomes.income4.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
    });

    beforeEach('create income 2', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income5.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-15',
        description: sampleData.incomes.income5.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
    });

    beforeEach('create income 3', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income6.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-30',
        description: sampleData.incomes.income6.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
    });

    it('should return the sum of the incomes', async function() {
      const res = await chai.request(server)
        .get('/monthly-reports/2019-3')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.strictEqual(res.body.data.attributes['actual-cents'], 0);
      assert.strictEqual(res.body.data.attributes['budget-cents'], 0);
      assert.strictEqual(res.body.data.attributes['income-cents'], 1473374);
      assert.strictEqual(res.body.data.id, '2019-3');
      assert.strictEqual(res.body.data.type, 'monthly-reports');
    });
  });

  describe('when budgets, expenses and incomes exist', function() {
    beforeEach('create budget 1', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget7.budget_cents,
        month: 3,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    beforeEach('create budget 2', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget8.budget_cents,
        month: 3,
        subcategoryUuid: user1Subcategory2Uuid,
        year: 2019,
      });
    });

    beforeEach('create budget 3', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: sampleData.budgets.budget9.budget_cents,
        month: 3,
        subcategoryUuid: user1Subcategory3Uuid,
        year: 2019,
      });
    });

    beforeEach('create expense 1', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense7.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-01',
        description: sampleData.expenses.expense7.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense7.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create expense 2', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense8.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-15',
        description: sampleData.expenses.expense8.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense8.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create expense 3', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense9.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-30',
        description: sampleData.expenses.expense9.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense9.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create income 1', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income7.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-01',
        description: sampleData.incomes.income7.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
    });

    beforeEach('create income 2', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income8.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-15',
        description: sampleData.incomes.income8.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
    });

    beforeEach('create income 3', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.IncomeCtrl.createIncome({
        amount: sampleData.incomes.income9.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-30',
        description: sampleData.incomes.income9.description,
        householdMemberUuid: user1HouseholdMemberUuid,
      });
    });

    it('should return all sums', async function() {
      const res = await chai.request(server)
        .get('/monthly-reports/2019-3')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.strictEqual(res.body.data.attributes['actual-cents'], 165435);
      assert.strictEqual(res.body.data.attributes['budget-cents'], 83990);
      assert.strictEqual(res.body.data.attributes['income-cents'], 2477454);
      assert.strictEqual(res.body.data.id, '2019-3');
      assert.strictEqual(res.body.data.type, 'monthly-reports');
    });
  });
});
