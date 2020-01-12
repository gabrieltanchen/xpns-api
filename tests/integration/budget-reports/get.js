const chai = require('chai');
const chaiHttp = require('chai-http');
const _ = require('lodash');

const sampleData = require('../../sample-data/');
const TestHelper = require('../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /budget-reports', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  // The budgets and expenses defined here are extra and should not be returned.
  // The month being tested is 2019-04.
  let user1CategoryUuid;
  let user1HouseholdMemberUuid;
  let user1SubcategoryUuid;
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

  beforeEach('create user 1 subcategory', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1CategoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
    user1SubcategoryUuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: user1CategoryUuid,
      name: sampleData.categories.category2.name,
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
      subcategoryUuid: user1SubcategoryUuid,
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
      subcategoryUuid: user1SubcategoryUuid,
      year: 2019,
    });
  });

  beforeEach('create user 1 expense for the month before', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: '2019-03-31',
      description: sampleData.expenses.expense1.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1SubcategoryUuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 expense for the month after', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: '2019-05-01',
      description: sampleData.expenses.expense2.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedCents: sampleData.expenses.expense2.reimbursed_cents,
      subcategoryUuid: user1SubcategoryUuid,
      vendorUuid: user1VendorUuid,
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
      name: sampleData.categories.category3.name,
    });
    user2SubcategoryUuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid,
      name: sampleData.categories.category4.name,
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
      amountCents: sampleData.expenses.expense3.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: '2019-04-01',
      description: sampleData.expenses.expense3.description,
      householdMemberUuid: user2HouseholdMemberUuid,
      reimbursedCents: sampleData.expenses.expense3.reimbursed_cents,
      subcategoryUuid: user2SubcategoryUuid,
      vendorUuid: user2VendorUuid,
    });
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get('/budget-reports?year=2019&month=3')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  describe('when there is no budget or expense', function() {
    it('should not return any subcategories', async function() {
      const res = await chai.request(server)
        .get('/budget-reports?year=2019&month=3')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 0);
    });
  });

  describe('when there is a budget but no expense', function() {
    beforeEach('create budget', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: 43689,
        month: 3,
        subcategoryUuid: user1SubcategoryUuid,
        year: 2019,
      });
    });

    it('should return the subcategory with the budget and no actual', async function() {
      const res = await chai.request(server)
        .get('/budget-reports?year=2019&month=3')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);

      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);
      assert.isOk(res.body.data[0].attributes);
      assert.strictEqual(res.body.data[0].attributes.actual, 0);
      assert.strictEqual(res.body.data[0].attributes['actual-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes.budget, 436.89);
      assert.strictEqual(res.body.data[0].attributes['budget-cents'], 43689);
      assert.strictEqual(res.body.data[0].id, `${user1SubcategoryUuid}-2019-3`);
      assert.isOk(res.body.data[0].relationships);
      assert.isOk(res.body.data[0].relationships.category);
      assert.isOk(res.body.data[0].relationships.category.data);
      assert.strictEqual(res.body.data[0].relationships.category.data.id, user1CategoryUuid);
      assert.isOk(res.body.data[0].relationships.subcategory);
      assert.isOk(res.body.data[0].relationships.subcategory.data);
      assert.strictEqual(res.body.data[0].relationships.subcategory.data.id, user1SubcategoryUuid);
      assert.strictEqual(res.body.data[0].type, 'budget-reports');

      assert.isOk(res.body.included);
      const categoryInclude = _.find(res.body.included, (include) => {
        return include.id === user1CategoryUuid
          && include.type === 'categories';
      });
      assert.isOk(categoryInclude);
      assert.isOk(categoryInclude.attributes);
      assert.strictEqual(categoryInclude.attributes.name, sampleData.categories.category1.name);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === user1SubcategoryUuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      assert.strictEqual(res.body.included.length, 2);
    });
  });

  describe('when there are expenses but no budget', function() {
    beforeEach('create expense 1', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: 25694,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-01',
        description: sampleData.expenses.expense4.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedCents: 0,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
    });

    it('should return the subcategory with the actual and no budget', async function() {
      const res = await chai.request(server)
        .get('/budget-reports?year=2019&month=3')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);

      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);
      assert.isOk(res.body.data[0].attributes);
      assert.strictEqual(res.body.data[0].attributes.actual, 256.94);
      assert.strictEqual(res.body.data[0].attributes['actual-cents'], 25694);
      assert.strictEqual(res.body.data[0].attributes.budget, 0);
      assert.strictEqual(res.body.data[0].attributes['budget-cents'], 0);
      assert.strictEqual(res.body.data[0].id, `${user1SubcategoryUuid}-2019-3`);
      assert.isOk(res.body.data[0].relationships);
      assert.isOk(res.body.data[0].relationships.category);
      assert.isOk(res.body.data[0].relationships.category.data);
      assert.strictEqual(res.body.data[0].relationships.category.data.id, user1CategoryUuid);
      assert.isOk(res.body.data[0].relationships.subcategory);
      assert.isOk(res.body.data[0].relationships.subcategory.data);
      assert.strictEqual(res.body.data[0].relationships.subcategory.data.id, user1SubcategoryUuid);
      assert.strictEqual(res.body.data[0].type, 'budget-reports');

      assert.isOk(res.body.included);
      const categoryInclude = _.find(res.body.included, (include) => {
        return include.id === user1CategoryUuid
          && include.type === 'categories';
      });
      assert.isOk(categoryInclude);
      assert.isOk(categoryInclude.attributes);
      assert.strictEqual(categoryInclude.attributes.name, sampleData.categories.category1.name);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === user1SubcategoryUuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      assert.strictEqual(res.body.included.length, 2);
    });

    describe('when there are multiple expenses', function() {
      beforeEach('create expense 2', async function() {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.createExpense({
          amountCents: 6020,
          auditApiCallUuid: apiCall.get('uuid'),
          date: '2019-04-30',
          description: sampleData.expenses.expense5.description,
          householdMemberUuid: user1HouseholdMemberUuid,
          reimbursedCents: 0,
          subcategoryUuid: user1SubcategoryUuid,
          vendorUuid: user1VendorUuid,
        });
      });

      it('should return a sum of the expense amounts as the actual', async function() {
        const res = await chai.request(server)
          .get('/budget-reports?year=2019&month=3')
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);

        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 1);
        assert.isOk(res.body.data[0].attributes);
        assert.strictEqual(res.body.data[0].attributes.actual, 317.14);
        assert.strictEqual(res.body.data[0].attributes['actual-cents'], 31714);
        assert.strictEqual(res.body.data[0].attributes.budget, 0);
        assert.strictEqual(res.body.data[0].attributes['budget-cents'], 0);
        assert.strictEqual(res.body.data[0].id, `${user1SubcategoryUuid}-2019-3`);
        assert.isOk(res.body.data[0].relationships);
        assert.isOk(res.body.data[0].relationships.category);
        assert.isOk(res.body.data[0].relationships.category.data);
        assert.strictEqual(res.body.data[0].relationships.category.data.id, user1CategoryUuid);
        assert.isOk(res.body.data[0].relationships.subcategory);
        assert.isOk(res.body.data[0].relationships.subcategory.data);
        assert.strictEqual(
          res.body.data[0].relationships.subcategory.data.id,
          user1SubcategoryUuid,
        );
        assert.strictEqual(res.body.data[0].type, 'budget-reports');

        assert.isOk(res.body.included);
        const categoryInclude = _.find(res.body.included, (include) => {
          return include.id === user1CategoryUuid
            && include.type === 'categories';
        });
        assert.isOk(categoryInclude);
        assert.isOk(categoryInclude.attributes);
        assert.strictEqual(categoryInclude.attributes.name, sampleData.categories.category1.name);
        const subcategoryInclude = _.find(res.body.included, (include) => {
          return include.id === user1SubcategoryUuid
            && include.type === 'subcategories';
        });
        assert.isOk(subcategoryInclude);
        assert.isOk(subcategoryInclude.attributes);
        assert.strictEqual(
          subcategoryInclude.attributes.name,
          sampleData.categories.category2.name,
        );
        assert.strictEqual(res.body.included.length, 2);
      });
    });

    describe('when there is a reimbursed amount', function() {
      beforeEach('create expense 2', async function() {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.createExpense({
          amountCents: 17968,
          auditApiCallUuid: apiCall.get('uuid'),
          date: '2019-04-15',
          description: sampleData.expenses.expense5.description,
          householdMemberUuid: user1HouseholdMemberUuid,
          reimbursedCents: 5495,
          subcategoryUuid: user1SubcategoryUuid,
          vendorUuid: user1VendorUuid,
        });
      });

      it('should subtract the reimbursed amounts from the actual', async function() {
        const res = await chai.request(server)
          .get('/budget-reports?year=2019&month=3')
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);

        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 1);
        assert.isOk(res.body.data[0].attributes);
        assert.strictEqual(res.body.data[0].attributes.actual, 381.67);
        assert.strictEqual(res.body.data[0].attributes['actual-cents'], 38167);
        assert.strictEqual(res.body.data[0].attributes.budget, 0);
        assert.strictEqual(res.body.data[0].attributes['budget-cents'], 0);
        assert.strictEqual(res.body.data[0].id, `${user1SubcategoryUuid}-2019-3`);
        assert.isOk(res.body.data[0].relationships);
        assert.isOk(res.body.data[0].relationships.category);
        assert.isOk(res.body.data[0].relationships.category.data);
        assert.strictEqual(res.body.data[0].relationships.category.data.id, user1CategoryUuid);
        assert.isOk(res.body.data[0].relationships.subcategory);
        assert.isOk(res.body.data[0].relationships.subcategory.data);
        assert.strictEqual(
          res.body.data[0].relationships.subcategory.data.id,
          user1SubcategoryUuid,
        );
        assert.strictEqual(res.body.data[0].type, 'budget-reports');

        assert.isOk(res.body.included);
        const categoryInclude = _.find(res.body.included, (include) => {
          return include.id === user1CategoryUuid
            && include.type === 'categories';
        });
        assert.isOk(categoryInclude);
        assert.isOk(categoryInclude.attributes);
        assert.strictEqual(categoryInclude.attributes.name, sampleData.categories.category1.name);
        const subcategoryInclude = _.find(res.body.included, (include) => {
          return include.id === user1SubcategoryUuid
            && include.type === 'subcategories';
        });
        assert.isOk(subcategoryInclude);
        assert.isOk(subcategoryInclude.attributes);
        assert.strictEqual(
          subcategoryInclude.attributes.name,
          sampleData.categories.category2.name,
        );
        assert.strictEqual(res.body.included.length, 2);
      });
    });
  });

  describe('when there is a budget and expenses', function() {
    beforeEach('create budget', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: apiCall.get('uuid'),
        budgetCents: 43689,
        month: 3,
        subcategoryUuid: user1SubcategoryUuid,
        year: 2019,
      });
    });

    beforeEach('create expense 1', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amountCents: 25694,
        auditApiCallUuid: apiCall.get('uuid'),
        date: '2019-04-01',
        description: sampleData.expenses.expense4.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedCents: 0,
        subcategoryUuid: user1SubcategoryUuid,
        vendorUuid: user1VendorUuid,
      });
    });

    it('should return the subcategory with the correct budget and actual amounts', async function() {
      const res = await chai.request(server)
        .get('/budget-reports?year=2019&month=3')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);

      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);
      assert.isOk(res.body.data[0].attributes);
      assert.strictEqual(res.body.data[0].attributes.actual, 256.94);
      assert.strictEqual(res.body.data[0].attributes['actual-cents'], 25694);
      assert.strictEqual(res.body.data[0].attributes.budget, 436.89);
      assert.strictEqual(res.body.data[0].attributes['budget-cents'], 43689);
      assert.strictEqual(res.body.data[0].id, `${user1SubcategoryUuid}-2019-3`);
      assert.isOk(res.body.data[0].relationships);
      assert.isOk(res.body.data[0].relationships.category);
      assert.isOk(res.body.data[0].relationships.category.data);
      assert.strictEqual(res.body.data[0].relationships.category.data.id, user1CategoryUuid);
      assert.isOk(res.body.data[0].relationships.subcategory);
      assert.isOk(res.body.data[0].relationships.subcategory.data);
      assert.strictEqual(res.body.data[0].relationships.subcategory.data.id, user1SubcategoryUuid);
      assert.strictEqual(res.body.data[0].type, 'budget-reports');

      assert.isOk(res.body.included);
      const categoryInclude = _.find(res.body.included, (include) => {
        return include.id === user1CategoryUuid
          && include.type === 'categories';
      });
      assert.isOk(categoryInclude);
      assert.isOk(categoryInclude.attributes);
      assert.strictEqual(categoryInclude.attributes.name, sampleData.categories.category1.name);
      const subcategoryInclude = _.find(res.body.included, (include) => {
        return include.id === user1SubcategoryUuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategoryInclude);
      assert.isOk(subcategoryInclude.attributes);
      assert.strictEqual(subcategoryInclude.attributes.name, sampleData.categories.category2.name);
      assert.strictEqual(res.body.included.length, 2);
    });

    describe('when there are multiple expenses', function() {
      beforeEach('create expense 2', async function() {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.createExpense({
          amountCents: 6020,
          auditApiCallUuid: apiCall.get('uuid'),
          date: '2019-04-30',
          description: sampleData.expenses.expense5.description,
          householdMemberUuid: user1HouseholdMemberUuid,
          reimbursedCents: 0,
          subcategoryUuid: user1SubcategoryUuid,
          vendorUuid: user1VendorUuid,
        });
      });

      it('should return a sum of the expense amounts as the actual', async function() {
        const res = await chai.request(server)
          .get('/budget-reports?year=2019&month=3')
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);

        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 1);
        assert.isOk(res.body.data[0].attributes);
        assert.strictEqual(res.body.data[0].attributes.actual, 317.14);
        assert.strictEqual(res.body.data[0].attributes['actual-cents'], 31714);
        assert.strictEqual(res.body.data[0].attributes.budget, 436.89);
        assert.strictEqual(res.body.data[0].attributes['budget-cents'], 43689);
        assert.strictEqual(res.body.data[0].id, `${user1SubcategoryUuid}-2019-3`);
        assert.isOk(res.body.data[0].relationships);
        assert.isOk(res.body.data[0].relationships.category);
        assert.isOk(res.body.data[0].relationships.category.data);
        assert.strictEqual(res.body.data[0].relationships.category.data.id, user1CategoryUuid);
        assert.isOk(res.body.data[0].relationships.subcategory);
        assert.isOk(res.body.data[0].relationships.subcategory.data);
        assert.strictEqual(
          res.body.data[0].relationships.subcategory.data.id,
          user1SubcategoryUuid,
        );
        assert.strictEqual(res.body.data[0].type, 'budget-reports');

        assert.isOk(res.body.included);
        const categoryInclude = _.find(res.body.included, (include) => {
          return include.id === user1CategoryUuid
            && include.type === 'categories';
        });
        assert.isOk(categoryInclude);
        assert.isOk(categoryInclude.attributes);
        assert.strictEqual(categoryInclude.attributes.name, sampleData.categories.category1.name);
        const subcategoryInclude = _.find(res.body.included, (include) => {
          return include.id === user1SubcategoryUuid
            && include.type === 'subcategories';
        });
        assert.isOk(subcategoryInclude);
        assert.isOk(subcategoryInclude.attributes);
        assert.strictEqual(
          subcategoryInclude.attributes.name,
          sampleData.categories.category2.name,
        );
        assert.strictEqual(res.body.included.length, 2);
      });
    });

    describe('when there is a reimbursed amount', function() {
      beforeEach('create expense 2', async function() {
        const apiCall = await models.Audit.ApiCall.create({
          user_uuid: user1Uuid,
        });
        await controllers.ExpenseCtrl.createExpense({
          amountCents: 17968,
          auditApiCallUuid: apiCall.get('uuid'),
          date: '2019-04-15',
          description: sampleData.expenses.expense5.description,
          householdMemberUuid: user1HouseholdMemberUuid,
          reimbursedCents: 5495,
          subcategoryUuid: user1SubcategoryUuid,
          vendorUuid: user1VendorUuid,
        });
      });

      it('should subtract the reimbursed amounts from the actual', async function() {
        const res = await chai.request(server)
          .get('/budget-reports?year=2019&month=3')
          .set('Content-Type', 'application/vnd.api+json')
          .set('Authorization', `Bearer ${user1Token}`);
        expect(res).to.have.status(200);

        assert.isOk(res.body.data);
        assert.strictEqual(res.body.data.length, 1);
        assert.isOk(res.body.data[0].attributes);
        assert.strictEqual(res.body.data[0].attributes.actual, 381.67);
        assert.strictEqual(res.body.data[0].attributes['actual-cents'], 38167);
        assert.strictEqual(res.body.data[0].attributes.budget, 436.89);
        assert.strictEqual(res.body.data[0].attributes['budget-cents'], 43689);
        assert.strictEqual(res.body.data[0].id, `${user1SubcategoryUuid}-2019-3`);
        assert.isOk(res.body.data[0].relationships);
        assert.isOk(res.body.data[0].relationships.category);
        assert.isOk(res.body.data[0].relationships.category.data);
        assert.strictEqual(res.body.data[0].relationships.category.data.id, user1CategoryUuid);
        assert.isOk(res.body.data[0].relationships.subcategory);
        assert.isOk(res.body.data[0].relationships.subcategory.data);
        assert.strictEqual(
          res.body.data[0].relationships.subcategory.data.id,
          user1SubcategoryUuid,
        );
        assert.strictEqual(res.body.data[0].type, 'budget-reports');

        assert.isOk(res.body.included);
        const categoryInclude = _.find(res.body.included, (include) => {
          return include.id === user1CategoryUuid
            && include.type === 'categories';
        });
        assert.isOk(categoryInclude);
        assert.isOk(categoryInclude.attributes);
        assert.strictEqual(categoryInclude.attributes.name, sampleData.categories.category1.name);
        const subcategoryInclude = _.find(res.body.included, (include) => {
          return include.id === user1SubcategoryUuid
            && include.type === 'subcategories';
        });
        assert.isOk(subcategoryInclude);
        assert.isOk(subcategoryInclude.attributes);
        assert.strictEqual(
          subcategoryInclude.attributes.name,
          sampleData.categories.category2.name,
        );
        assert.strictEqual(res.body.included.length, 2);
      });
    });
  });
});
