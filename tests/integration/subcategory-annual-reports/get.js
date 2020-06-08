const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /subcategory-annual-reports', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let user1HouseholdMemberUuid;
  let user1Subcategory1Uuid;
  // All subcategory 2 budgets and expenses are created to ensure budgets and
  // expenses from other subcategories are not returned.
  let user1Subcategory2Uuid;
  let user1Token;
  let user1Uuid;
  let user1VendorUuid;
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

  beforeEach('create user 1 subcategory 1 budget 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget1.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 1 budget 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget2.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 1 budget 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget3.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget3.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 1 budget 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget5.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget5.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 1 budget 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget6.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget6.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 1 budget 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget7.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget7.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 1 budget 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget9.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget9.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 1 budget 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget11.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget11.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 1 budget 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget13.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget13.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 1 budget 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget17.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget17.month,
      subcategoryUuid: user1Subcategory1Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 1 expense 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 1 expense 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense4.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense4.date,
      description: sampleData.expenses.expense4.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense4.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 1 expense 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense7.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense7.date,
      description: sampleData.expenses.expense7.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense7.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 1 expense 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense10.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense10.date,
      description: sampleData.expenses.expense10.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense10.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 1 expense 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense13.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense13.date,
      description: sampleData.expenses.expense13.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense13.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 1 expense 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense16.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense16.date,
      description: sampleData.expenses.expense16.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense16.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 1 expense 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense19.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense19.date,
      description: sampleData.expenses.expense19.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense19.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 1 expense 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense22.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense22.date,
      description: sampleData.expenses.expense22.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense22.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 1 expense 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense25.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense25.date,
      description: sampleData.expenses.expense25.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense25.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 1 expense 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense28.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense28.date,
      description: sampleData.expenses.expense28.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense28.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1VendorUuid,
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

  beforeEach('create user 1 subcategory 2 budget 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget4.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget4.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 budget 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget8.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget8.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 budget 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget10.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget10.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 budget 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget14.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget14.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 budget 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget15.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget15.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 budget 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget20.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget20.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 budget 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget21.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget21.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 budget 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget22.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget22.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 budget 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget27.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget27.month,
      subcategoryUuid: user1Subcategory2Uuid,
      year: 2018,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense2.date,
      description: sampleData.expenses.expense2.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense2.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense5.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense5.date,
      description: sampleData.expenses.expense5.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense5.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense8.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense8.date,
      description: sampleData.expenses.expense8.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense8.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense11.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense11.date,
      description: sampleData.expenses.expense11.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense11.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense14.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense14.date,
      description: sampleData.expenses.expense14.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense14.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense17.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense17.date,
      description: sampleData.expenses.expense17.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense17.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense20.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense20.date,
      description: sampleData.expenses.expense20.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense20.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense23.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense23.date,
      description: sampleData.expenses.expense23.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense23.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense26.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense26.date,
      description: sampleData.expenses.expense26.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense26.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
      vendorUuid: user1VendorUuid,
    });
  });

  beforeEach('create user 1 subcategory 2 expense 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    await controllers.ExpenseCtrl.createExpense({
      amount: sampleData.expenses.expense29.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense29.date,
      description: sampleData.expenses.expense29.description,
      householdMemberUuid: user1HouseholdMemberUuid,
      reimbursedAmount: sampleData.expenses.expense29.reimbursed_cents,
      subcategoryUuid: user1Subcategory2Uuid,
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

  beforeEach('create user 2 token', async function() {
    user2Token = await controllers.UserCtrl.getToken(user2Uuid);
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get(`/subcategory-annual-reports?subcategory_uuid=${user1Subcategory1Uuid}`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 403 with no subcategory id', async function() {
    const res = await chai.request(server)
      .get('/subcategory-annual-reports')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(403);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Category ID is required.',
      }],
    });
  });

  it('should return 404 when the subcategory does not exist', async function() {
    const res = await chai.request(server)
      .get(`/subcategory-annual-reports?subcategory_uuid=${uuidv4()}`)
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
      .get(`/subcategory-annual-reports?subcategory_uuid=${user1Subcategory1Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find category.',
      }],
    });
  });

  it('should return 200 and the correct totals for 2018', async function() {
    const res = await chai.request(server)
      .get(`/subcategory-annual-reports?subcategory_uuid=${user1Subcategory1Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);

    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 1);
    assert.isOk(res.body.data[0].attributes);
    assert.strictEqual(res.body.data[0].attributes['apr-actual-cents'], 0);
    assert.strictEqual(res.body.data[0].attributes['apr-budget-cents'], 28617);
    assert.strictEqual(res.body.data[0].attributes['aug-actual-cents'], 44177);
    assert.strictEqual(res.body.data[0].attributes['aug-budget-cents'], 0);
    assert.strictEqual(res.body.data[0].attributes['dec-actual-cents'], 66540);
    assert.strictEqual(res.body.data[0].attributes['dec-budget-cents'], 99763);
    assert.strictEqual(res.body.data[0].attributes['feb-actual-cents'], 0);
    assert.strictEqual(res.body.data[0].attributes['feb-budget-cents'], 90756);
    assert.strictEqual(res.body.data[0].attributes['mar-actual-cents'], 181457);
    assert.strictEqual(res.body.data[0].attributes['mar-budget-cents'], 39746);
    assert.strictEqual(res.body.data[0].attributes['may-actual-cents'], 65709);
    assert.strictEqual(res.body.data[0].attributes['may-budget-cents'], 20839);
    assert.strictEqual(res.body.data[0].attributes['jan-actual-cents'], 60493);
    assert.strictEqual(res.body.data[0].attributes['jan-budget-cents'], 7114);
    assert.strictEqual(res.body.data[0].attributes['jul-actual-cents'], 74918);
    assert.strictEqual(res.body.data[0].attributes['jul-budget-cents'], 78861);
    assert.strictEqual(res.body.data[0].attributes['jun-actual-cents'], 0);
    assert.strictEqual(res.body.data[0].attributes['jun-budget-cents'], 14156);
    assert.strictEqual(res.body.data[0].attributes['nov-actual-cents'], 0);
    assert.strictEqual(res.body.data[0].attributes['nov-budget-cents'], 21742);
    assert.strictEqual(res.body.data[0].attributes['oct-actual-cents'], 149529);
    assert.strictEqual(res.body.data[0].attributes['oct-budget-cents'], 64671);
    assert.strictEqual(res.body.data[0].attributes['sep-actual-cents'], 0);
    assert.strictEqual(res.body.data[0].attributes['sep-budget-cents'], 0);
    assert.strictEqual(res.body.data[0].attributes.year, 2018);
    assert.strictEqual(res.body.data[0].id, `${user1Subcategory1Uuid}-2018`);
    assert.strictEqual(res.body.data[0].type, 'subcategory-annual-reports');
  });

  describe('when there also exists budgets for 2019', function() {
    beforeEach('create user 1 subcategory 1 budget 11', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget4.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: sampleData.budgets.budget4.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 12', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget8.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: sampleData.budgets.budget8.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 13', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget10.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: sampleData.budgets.budget10.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 14', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget14.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: sampleData.budgets.budget14.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 15', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget15.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: sampleData.budgets.budget15.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 16', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget20.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: sampleData.budgets.budget20.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 17', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget21.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: sampleData.budgets.budget21.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 18', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget22.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: sampleData.budgets.budget22.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    beforeEach('create user 1 subcategory 1 budget 19', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.BudgetCtrl.createBudget({
        amount: sampleData.budgets.budget27.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        month: sampleData.budgets.budget27.month,
        subcategoryUuid: user1Subcategory1Uuid,
        year: 2019,
      });
    });

    it('should also return budget data for 2019', async function() {
      const res = await chai.request(server)
        .get(`/subcategory-annual-reports?subcategory_uuid=${user1Subcategory1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);

      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);
      assert.isOk(res.body.data[0].attributes);
      assert.strictEqual(res.body.data[0].attributes['apr-actual-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['apr-budget-cents'], 28617);
      assert.strictEqual(res.body.data[0].attributes['aug-actual-cents'], 44177);
      assert.strictEqual(res.body.data[0].attributes['aug-budget-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['dec-actual-cents'], 66540);
      assert.strictEqual(res.body.data[0].attributes['dec-budget-cents'], 99763);
      assert.strictEqual(res.body.data[0].attributes['feb-actual-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['feb-budget-cents'], 90756);
      assert.strictEqual(res.body.data[0].attributes['mar-actual-cents'], 181457);
      assert.strictEqual(res.body.data[0].attributes['mar-budget-cents'], 39746);
      assert.strictEqual(res.body.data[0].attributes['may-actual-cents'], 65709);
      assert.strictEqual(res.body.data[0].attributes['may-budget-cents'], 20839);
      assert.strictEqual(res.body.data[0].attributes['jan-actual-cents'], 60493);
      assert.strictEqual(res.body.data[0].attributes['jan-budget-cents'], 7114);
      assert.strictEqual(res.body.data[0].attributes['jul-actual-cents'], 74918);
      assert.strictEqual(res.body.data[0].attributes['jul-budget-cents'], 78861);
      assert.strictEqual(res.body.data[0].attributes['jun-actual-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['jun-budget-cents'], 14156);
      assert.strictEqual(res.body.data[0].attributes['nov-actual-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['nov-budget-cents'], 21742);
      assert.strictEqual(res.body.data[0].attributes['oct-actual-cents'], 149529);
      assert.strictEqual(res.body.data[0].attributes['oct-budget-cents'], 64671);
      assert.strictEqual(res.body.data[0].attributes['sep-actual-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['sep-budget-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes.year, 2018);
      assert.strictEqual(res.body.data[0].id, `${user1Subcategory1Uuid}-2018`);
      assert.strictEqual(res.body.data[0].type, 'subcategory-annual-reports');
      assert.isOk(res.body.data[1].attributes);
      assert.strictEqual(res.body.data[1].attributes['apr-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['apr-budget-cents'], 59887);
      assert.strictEqual(res.body.data[1].attributes['aug-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['aug-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['dec-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['dec-budget-cents'], 5702);
      assert.strictEqual(res.body.data[1].attributes['feb-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['feb-budget-cents'], 71135);
      assert.strictEqual(res.body.data[1].attributes['mar-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['mar-budget-cents'], 20064);
      assert.strictEqual(res.body.data[1].attributes['may-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['may-budget-cents'], 75993);
      assert.strictEqual(res.body.data[1].attributes['jan-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['jan-budget-cents'], 2926);
      assert.strictEqual(res.body.data[1].attributes['jul-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['jul-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['jun-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['jun-budget-cents'], 85985);
      assert.strictEqual(res.body.data[1].attributes['nov-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['nov-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['oct-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['oct-budget-cents'], 22502);
      assert.strictEqual(res.body.data[1].attributes['sep-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['sep-budget-cents'], 76914);
      assert.strictEqual(res.body.data[1].attributes.year, 2019);
      assert.strictEqual(res.body.data[1].id, `${user1Subcategory1Uuid}-2019`);
      assert.strictEqual(res.body.data[1].type, 'subcategory-annual-reports');
    });
  });

  describe('when there also exists expenses for 2019', function() {
    beforeEach('create user 1 subcategory 1 expense 11', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense3.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: moment(sampleData.expenses.expense3.date).add(1, 'y').format('YYYY-MM-DD'),
        description: sampleData.expenses.expense3.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense3.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 12', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense6.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: moment(sampleData.expenses.expense6.date).add(1, 'y').format('YYYY-MM-DD'),
        description: sampleData.expenses.expense6.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense6.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 13', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense9.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: moment(sampleData.expenses.expense9.date).add(1, 'y').format('YYYY-MM-DD'),
        description: sampleData.expenses.expense9.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense9.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 14', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense12.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: moment(sampleData.expenses.expense12.date).add(1, 'y').format('YYYY-MM-DD'),
        description: sampleData.expenses.expense12.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense12.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 15', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense15.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: moment(sampleData.expenses.expense15.date).add(1, 'y').format('YYYY-MM-DD'),
        description: sampleData.expenses.expense15.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense15.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 16', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense18.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: moment(sampleData.expenses.expense18.date).add(1, 'y').format('YYYY-MM-DD'),
        description: sampleData.expenses.expense18.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense18.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 17', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense21.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: moment(sampleData.expenses.expense21.date).add(1, 'y').format('YYYY-MM-DD'),
        description: sampleData.expenses.expense21.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense21.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 18', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense24.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: moment(sampleData.expenses.expense24.date).add(1, 'y').format('YYYY-MM-DD'),
        description: sampleData.expenses.expense24.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense24.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 19', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense27.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: moment(sampleData.expenses.expense27.date).add(1, 'y').format('YYYY-MM-DD'),
        description: sampleData.expenses.expense27.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense27.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    beforeEach('create user 1 subcategory 1 expense 20', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      await controllers.ExpenseCtrl.createExpense({
        amount: sampleData.expenses.expense30.amount_cents,
        auditApiCallUuid: apiCall.get('uuid'),
        date: moment(sampleData.expenses.expense30.date).add(1, 'y').format('YYYY-MM-DD'),
        description: sampleData.expenses.expense30.description,
        householdMemberUuid: user1HouseholdMemberUuid,
        reimbursedAmount: sampleData.expenses.expense30.reimbursed_cents,
        subcategoryUuid: user1Subcategory1Uuid,
        vendorUuid: user1VendorUuid,
      });
    });

    it('should also return expense data for 2019', async function() {
      const res = await chai.request(server)
        .get(`/subcategory-annual-reports?subcategory_uuid=${user1Subcategory1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);

      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);
      assert.isOk(res.body.data[0].attributes);
      assert.strictEqual(res.body.data[0].attributes['apr-actual-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['apr-budget-cents'], 28617);
      assert.strictEqual(res.body.data[0].attributes['aug-actual-cents'], 44177);
      assert.strictEqual(res.body.data[0].attributes['aug-budget-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['dec-actual-cents'], 66540);
      assert.strictEqual(res.body.data[0].attributes['dec-budget-cents'], 99763);
      assert.strictEqual(res.body.data[0].attributes['feb-actual-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['feb-budget-cents'], 90756);
      assert.strictEqual(res.body.data[0].attributes['mar-actual-cents'], 181457);
      assert.strictEqual(res.body.data[0].attributes['mar-budget-cents'], 39746);
      assert.strictEqual(res.body.data[0].attributes['may-actual-cents'], 65709);
      assert.strictEqual(res.body.data[0].attributes['may-budget-cents'], 20839);
      assert.strictEqual(res.body.data[0].attributes['jan-actual-cents'], 60493);
      assert.strictEqual(res.body.data[0].attributes['jan-budget-cents'], 7114);
      assert.strictEqual(res.body.data[0].attributes['jul-actual-cents'], 74918);
      assert.strictEqual(res.body.data[0].attributes['jul-budget-cents'], 78861);
      assert.strictEqual(res.body.data[0].attributes['jun-actual-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['jun-budget-cents'], 14156);
      assert.strictEqual(res.body.data[0].attributes['nov-actual-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['nov-budget-cents'], 21742);
      assert.strictEqual(res.body.data[0].attributes['oct-actual-cents'], 149529);
      assert.strictEqual(res.body.data[0].attributes['oct-budget-cents'], 64671);
      assert.strictEqual(res.body.data[0].attributes['sep-actual-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes['sep-budget-cents'], 0);
      assert.strictEqual(res.body.data[0].attributes.year, 2018);
      assert.strictEqual(res.body.data[0].id, `${user1Subcategory1Uuid}-2018`);
      assert.strictEqual(res.body.data[0].type, 'subcategory-annual-reports');
      assert.isOk(res.body.data[1].attributes);
      assert.strictEqual(res.body.data[1].attributes['apr-actual-cents'], 3296);
      assert.strictEqual(res.body.data[1].attributes['apr-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['aug-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['aug-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['dec-actual-cents'], 39638);
      assert.strictEqual(res.body.data[1].attributes['dec-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['feb-actual-cents'], 91128);
      assert.strictEqual(res.body.data[1].attributes['feb-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['mar-actual-cents'], 137462);
      assert.strictEqual(res.body.data[1].attributes['mar-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['may-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['may-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['jan-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['jan-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['jul-actual-cents'], 66607);
      assert.strictEqual(res.body.data[1].attributes['jul-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['jun-actual-cents'], 51316);
      assert.strictEqual(res.body.data[1].attributes['jun-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['nov-actual-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['nov-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['oct-actual-cents'], 113158);
      assert.strictEqual(res.body.data[1].attributes['oct-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes['sep-actual-cents'], 28159);
      assert.strictEqual(res.body.data[1].attributes['sep-budget-cents'], 0);
      assert.strictEqual(res.body.data[1].attributes.year, 2019);
      assert.strictEqual(res.body.data[1].id, `${user1Subcategory1Uuid}-2019`);
      assert.strictEqual(res.body.data[1].type, 'subcategory-annual-reports');
    });
  });
});
