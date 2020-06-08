const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

const validateBudget = ({
  budgetUuid,
  expectedBudget,
  returnedBudget,
  subcategoryUuid,
}) => {
  assert.isOk(returnedBudget.attributes);
  assert.strictEqual(returnedBudget.attributes.amount, expectedBudget.amount_cents);
  assert.isOk(returnedBudget.attributes['created-at']);
  assert.strictEqual(returnedBudget.attributes.month, expectedBudget.month);
  assert.strictEqual(returnedBudget.attributes.year, expectedBudget.year);
  assert.strictEqual(returnedBudget.id, budgetUuid);
  assert.isOk(returnedBudget.relationships);
  assert.isOk(returnedBudget.relationships.subcategory);
  assert.isOk(returnedBudget.relationships.subcategory.data);
  assert.strictEqual(returnedBudget.relationships.subcategory.data.id, subcategoryUuid);
  assert.strictEqual(returnedBudget.type, 'budgets');
};

chai.use(chaiHttp);

describe('Integration - GET /budgets', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let budget1Uuid;
  let budget2Uuid;
  let budget3Uuid;
  let budget4Uuid;
  let budget5Uuid;
  let budget6Uuid;
  let budget7Uuid;
  let budget8Uuid;
  let budget9Uuid;
  let budget10Uuid;
  let budget11Uuid;
  let budget12Uuid;
  let budget13Uuid;
  let budget14Uuid;
  let budget15Uuid;
  let budget16Uuid;
  let budget17Uuid;
  let budget18Uuid;
  let budget19Uuid;
  let budget20Uuid;
  let budget21Uuid;
  let budget22Uuid;
  let budget23Uuid;
  let budget24Uuid;
  let budget25Uuid;
  let budget26Uuid;
  let budget27Uuid;
  let budget28Uuid;
  let subcategory1Uuid;
  let subcategory2Uuid;
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

  before('create budget 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget1Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget1.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget1.year,
    });
  });

  before('create budget 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget2Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget2.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget2.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget2.year,
    });
  });

  before('create budget 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget3Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget3.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget3.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget3.year,
    });
  });

  before('create budget 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget4Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget4.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget4.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget4.year,
    });
  });

  before('create budget 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget5Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget5.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget5.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget5.year,
    });
  });

  before('create budget 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget6Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget6.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget6.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget6.year,
    });
  });

  before('create budget 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget7Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget7.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget7.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget7.year,
    });
  });

  before('create budget 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget8Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget8.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget8.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget8.year,
    });
  });

  before('create budget 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget9Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget9.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget9.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget9.year,
    });
  });

  before('create budget 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget10Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget10.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget10.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget10.year,
    });
  });

  before('create budget 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget11Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget11.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget11.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget11.year,
    });
  });

  before('create budget 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget12Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget12.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget12.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget12.year,
    });
  });

  before('create budget 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget13Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget13.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget13.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget13.year,
    });
  });

  before('create budget 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget14Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget14.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget14.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget14.year,
    });
  });

  before('create budget 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget15Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget15.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget15.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget15.year,
    });
  });

  before('create budget 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget16Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget16.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget16.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget16.year,
    });
  });

  before('create budget 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget17Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget17.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget17.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget17.year,
    });
  });

  before('create budget 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget18Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget18.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget18.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget18.year,
    });
  });

  before('create budget 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget19Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget19.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget19.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget19.year,
    });
  });

  before('create budget 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget20Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget20.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget20.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget20.year,
    });
  });

  before('create budget 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget21Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget21.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget21.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget21.year,
    });
  });

  before('create budget 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget22Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget22.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget22.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget22.year,
    });
  });

  before('create budget 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget23Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget23.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget23.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget23.year,
    });
  });

  before('create budget 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget24Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget24.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget24.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget24.year,
    });
  });


  before('create budget 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget25Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget25.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget25.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget25.year,
    });
  });

  before('create budget 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget26Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget26.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget26.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget26.year,
    });
  });

  before('create budget 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget27Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget27.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget27.month,
      subcategoryUuid: subcategory1Uuid,
      year: sampleData.budgets.budget27.year,
    });
  });

  before('create budget 28', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    budget28Uuid = await controllers.BudgetCtrl.createBudget({
      amount: sampleData.budgets.budget28.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      month: sampleData.budgets.budget28.month,
      subcategoryUuid: subcategory2Uuid,
      year: sampleData.budgets.budget28.year,
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
      .get('/budgets')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  describe('when called with no query params', function() {
    it('should return 200 and 25 budgets as user 1 with no limit or page specified', async function() {
      const res = await chai.request(server)
        .get('/budgets')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 25);

      // Budget 22
      validateBudget({
        budgetUuid: budget22Uuid,
        expectedBudget: sampleData.budgets.budget22,
        returnedBudget: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 15
      validateBudget({
        budgetUuid: budget15Uuid,
        expectedBudget: sampleData.budgets.budget15,
        returnedBudget: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 1
      validateBudget({
        budgetUuid: budget1Uuid,
        expectedBudget: sampleData.budgets.budget1,
        returnedBudget: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 24
      validateBudget({
        budgetUuid: budget24Uuid,
        expectedBudget: sampleData.budgets.budget24,
        returnedBudget: res.body.data[3],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 26
      validateBudget({
        budgetUuid: budget26Uuid,
        expectedBudget: sampleData.budgets.budget26,
        returnedBudget: res.body.data[4],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 11
      validateBudget({
        budgetUuid: budget11Uuid,
        expectedBudget: sampleData.budgets.budget11,
        returnedBudget: res.body.data[5],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 10
      validateBudget({
        budgetUuid: budget10Uuid,
        expectedBudget: sampleData.budgets.budget10,
        returnedBudget: res.body.data[6],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 5
      validateBudget({
        budgetUuid: budget5Uuid,
        expectedBudget: sampleData.budgets.budget5,
        returnedBudget: res.body.data[7],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 7
      validateBudget({
        budgetUuid: budget7Uuid,
        expectedBudget: sampleData.budgets.budget7,
        returnedBudget: res.body.data[8],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 27
      validateBudget({
        budgetUuid: budget27Uuid,
        expectedBudget: sampleData.budgets.budget27,
        returnedBudget: res.body.data[9],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 25
      validateBudget({
        budgetUuid: budget25Uuid,
        expectedBudget: sampleData.budgets.budget25,
        returnedBudget: res.body.data[10],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 23
      validateBudget({
        budgetUuid: budget23Uuid,
        expectedBudget: sampleData.budgets.budget23,
        returnedBudget: res.body.data[11],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 28
      validateBudget({
        budgetUuid: budget28Uuid,
        expectedBudget: sampleData.budgets.budget28,
        returnedBudget: res.body.data[12],
        subcategoryUuid: subcategory2Uuid,
      });

      // Budget 19
      validateBudget({
        budgetUuid: budget19Uuid,
        expectedBudget: sampleData.budgets.budget19,
        returnedBudget: res.body.data[13],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 17
      validateBudget({
        budgetUuid: budget17Uuid,
        expectedBudget: sampleData.budgets.budget17,
        returnedBudget: res.body.data[14],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 2
      validateBudget({
        budgetUuid: budget2Uuid,
        expectedBudget: sampleData.budgets.budget2,
        returnedBudget: res.body.data[15],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 16
      validateBudget({
        budgetUuid: budget16Uuid,
        expectedBudget: sampleData.budgets.budget16,
        returnedBudget: res.body.data[16],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 8
      validateBudget({
        budgetUuid: budget8Uuid,
        expectedBudget: sampleData.budgets.budget8,
        returnedBudget: res.body.data[17],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 6
      validateBudget({
        budgetUuid: budget6Uuid,
        expectedBudget: sampleData.budgets.budget6,
        returnedBudget: res.body.data[18],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 14
      validateBudget({
        budgetUuid: budget14Uuid,
        expectedBudget: sampleData.budgets.budget14,
        returnedBudget: res.body.data[19],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 21
      validateBudget({
        budgetUuid: budget21Uuid,
        expectedBudget: sampleData.budgets.budget21,
        returnedBudget: res.body.data[20],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 13
      validateBudget({
        budgetUuid: budget13Uuid,
        expectedBudget: sampleData.budgets.budget13,
        returnedBudget: res.body.data[21],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 20
      validateBudget({
        budgetUuid: budget20Uuid,
        expectedBudget: sampleData.budgets.budget20,
        returnedBudget: res.body.data[22],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 9
      validateBudget({
        budgetUuid: budget9Uuid,
        expectedBudget: sampleData.budgets.budget9,
        returnedBudget: res.body.data[23],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 4
      validateBudget({
        budgetUuid: budget4Uuid,
        expectedBudget: sampleData.budgets.budget4,
        returnedBudget: res.body.data[24],
        subcategoryUuid: subcategory1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategory1Include = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategory1Include);
      assert.isOk(subcategory1Include.attributes);
      assert.strictEqual(subcategory1Include.attributes.name, sampleData.categories.category2.name);
      const subcategory2Include = _.find(res.body.included, (include) => {
        return include.id === subcategory2Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategory2Include);
      assert.isOk(subcategory2Include.attributes);
      assert.strictEqual(subcategory2Include.attributes.name, sampleData.categories.category4.name);
      assert.strictEqual(res.body.included.length, 2);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 28);
    });

    it('should return 200 and 3 budgets as user 1 with no limit and page=2', async function() {
      const res = await chai.request(server)
        .get('/budgets?page=2')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 3);

      // Budget 3
      validateBudget({
        budgetUuid: budget3Uuid,
        expectedBudget: sampleData.budgets.budget3,
        returnedBudget: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 12
      validateBudget({
        budgetUuid: budget12Uuid,
        expectedBudget: sampleData.budgets.budget12,
        returnedBudget: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 18
      validateBudget({
        budgetUuid: budget18Uuid,
        expectedBudget: sampleData.budgets.budget18,
        returnedBudget: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategory1Include = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategory1Include);
      assert.isOk(subcategory1Include.attributes);
      assert.strictEqual(subcategory1Include.attributes.name, sampleData.categories.category2.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 28);
    });

    it('should return 200 and 5 budgets as user 1 with limit=5 and page=4', async function() {
      const res = await chai.request(server)
        .get('/budgets?limit=5&page=4')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 5);

      // Budget 2
      validateBudget({
        budgetUuid: budget2Uuid,
        expectedBudget: sampleData.budgets.budget2,
        returnedBudget: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 16
      validateBudget({
        budgetUuid: budget16Uuid,
        expectedBudget: sampleData.budgets.budget16,
        returnedBudget: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 8
      validateBudget({
        budgetUuid: budget8Uuid,
        expectedBudget: sampleData.budgets.budget8,
        returnedBudget: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 6
      validateBudget({
        budgetUuid: budget6Uuid,
        expectedBudget: sampleData.budgets.budget6,
        returnedBudget: res.body.data[3],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 14
      validateBudget({
        budgetUuid: budget14Uuid,
        expectedBudget: sampleData.budgets.budget14,
        returnedBudget: res.body.data[4],
        subcategoryUuid: subcategory1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategory1Include = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategory1Include);
      assert.isOk(subcategory1Include.attributes);
      assert.strictEqual(subcategory1Include.attributes.name, sampleData.categories.category2.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 6);
      assert.strictEqual(res.body.meta.total, 28);
    });
  });

  describe('when called with the month query param', function() {
    it('should return 403 with an invalid month (type)', async function() {
      const res = await chai.request(server)
        .get('/budgets?month=helloworld')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(403);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Invalid month provided.',
        }],
      });
    });

    it('should return 403 with an invalid month (too small)', async function() {
      const res = await chai.request(server)
        .get('/budgets?month=-1')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(403);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Invalid month provided.',
        }],
      });
    });

    it('should return 403 with an invalid month (too large)', async function() {
      const res = await chai.request(server)
        .get('/budgets?month=12')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(403);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Invalid month provided.',
        }],
      });
    });

    it('should return 200 and 2 budgets as user 1 with month=0', async function() {
      const res = await chai.request(server)
        .get('/budgets?month=0')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);

      // Budget 2
      validateBudget({
        budgetUuid: budget2Uuid,
        expectedBudget: sampleData.budgets.budget2,
        returnedBudget: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 4
      validateBudget({
        budgetUuid: budget4Uuid,
        expectedBudget: sampleData.budgets.budget4,
        returnedBudget: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategory1Include = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategory1Include);
      assert.isOk(subcategory1Include.attributes);
      assert.strictEqual(subcategory1Include.attributes.name, sampleData.categories.category2.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 2);
    });

    it('should return 200 and 0 budgets as user 1 with month=0 and page=2', async function() {
      const res = await chai.request(server)
        .get('/budgets?month=0&page=2')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 0);

      assert.isOk(res.body.included);
      assert.strictEqual(res.body.included.length, 0);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 2);
    });
  });

  describe('when called with the year query param', function() {
    it('should return 403 with an invalid year (type)', async function() {
      const res = await chai.request(server)
        .get('/budgets?year=helloworld')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(403);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Invalid year provided.',
        }],
      });
    });

    it('should return 403 with an invalid year (too small)', async function() {
      const res = await chai.request(server)
        .get('/budgets?year=1999')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(403);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Invalid year provided.',
        }],
      });
    });

    it('should return 403 with an invalid year (too large)', async function() {
      const res = await chai.request(server)
        .get('/budgets?year=2051')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(403);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Invalid year provided.',
        }],
      });
    });

    it('should return 200 and 3 budgets as user 1 with year=2010', async function() {
      const res = await chai.request(server)
        .get('/budgets?year=2010')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 3);

      // Budget 19
      validateBudget({
        budgetUuid: budget19Uuid,
        expectedBudget: sampleData.budgets.budget19,
        returnedBudget: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 17
      validateBudget({
        budgetUuid: budget17Uuid,
        expectedBudget: sampleData.budgets.budget17,
        returnedBudget: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 2
      validateBudget({
        budgetUuid: budget2Uuid,
        expectedBudget: sampleData.budgets.budget2,
        returnedBudget: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategory1Include = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategory1Include);
      assert.isOk(subcategory1Include.attributes);
      assert.strictEqual(subcategory1Include.attributes.name, sampleData.categories.category2.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 3);
    });

    it('should return 200 and 0 budgets as user 1 with year=200 and page=2', async function() {
      const res = await chai.request(server)
        .get('/budgets?year=2010&page=2')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 0);

      assert.isOk(res.body.included);
      assert.strictEqual(res.body.included.length, 0);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 3);
    });
  });

  describe('when called with the subcategory_id query param', function() {
    it('should return 404 when the subcategory does not exist', async function() {
      const res = await chai.request(server)
        .get(`/budgets?subcategory_id=${uuidv4()}`)
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
        .get(`/budgets?subcategory_id=${subcategory1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user2Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find category.',
        }],
      });
    });

    it('should return 200 and 25 budgets as user 1 with subcategory 1 and no limit or page specified', async function() {
      const res = await chai.request(server)
        .get(`/budgets?subcategory_id=${subcategory1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 25);

      // Budget 22
      validateBudget({
        budgetUuid: budget22Uuid,
        expectedBudget: sampleData.budgets.budget22,
        returnedBudget: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 15
      validateBudget({
        budgetUuid: budget15Uuid,
        expectedBudget: sampleData.budgets.budget15,
        returnedBudget: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 1
      validateBudget({
        budgetUuid: budget1Uuid,
        expectedBudget: sampleData.budgets.budget1,
        returnedBudget: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 24
      validateBudget({
        budgetUuid: budget24Uuid,
        expectedBudget: sampleData.budgets.budget24,
        returnedBudget: res.body.data[3],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 26
      validateBudget({
        budgetUuid: budget26Uuid,
        expectedBudget: sampleData.budgets.budget26,
        returnedBudget: res.body.data[4],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 11
      validateBudget({
        budgetUuid: budget11Uuid,
        expectedBudget: sampleData.budgets.budget11,
        returnedBudget: res.body.data[5],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 10
      validateBudget({
        budgetUuid: budget10Uuid,
        expectedBudget: sampleData.budgets.budget10,
        returnedBudget: res.body.data[6],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 5
      validateBudget({
        budgetUuid: budget5Uuid,
        expectedBudget: sampleData.budgets.budget5,
        returnedBudget: res.body.data[7],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 7
      validateBudget({
        budgetUuid: budget7Uuid,
        expectedBudget: sampleData.budgets.budget7,
        returnedBudget: res.body.data[8],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 27
      validateBudget({
        budgetUuid: budget27Uuid,
        expectedBudget: sampleData.budgets.budget27,
        returnedBudget: res.body.data[9],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 25
      validateBudget({
        budgetUuid: budget25Uuid,
        expectedBudget: sampleData.budgets.budget25,
        returnedBudget: res.body.data[10],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 23
      validateBudget({
        budgetUuid: budget23Uuid,
        expectedBudget: sampleData.budgets.budget23,
        returnedBudget: res.body.data[11],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 19
      validateBudget({
        budgetUuid: budget19Uuid,
        expectedBudget: sampleData.budgets.budget19,
        returnedBudget: res.body.data[12],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 17
      validateBudget({
        budgetUuid: budget17Uuid,
        expectedBudget: sampleData.budgets.budget17,
        returnedBudget: res.body.data[13],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 2
      validateBudget({
        budgetUuid: budget2Uuid,
        expectedBudget: sampleData.budgets.budget2,
        returnedBudget: res.body.data[14],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 16
      validateBudget({
        budgetUuid: budget16Uuid,
        expectedBudget: sampleData.budgets.budget16,
        returnedBudget: res.body.data[15],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 8
      validateBudget({
        budgetUuid: budget8Uuid,
        expectedBudget: sampleData.budgets.budget8,
        returnedBudget: res.body.data[16],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 6
      validateBudget({
        budgetUuid: budget6Uuid,
        expectedBudget: sampleData.budgets.budget6,
        returnedBudget: res.body.data[17],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 14
      validateBudget({
        budgetUuid: budget14Uuid,
        expectedBudget: sampleData.budgets.budget14,
        returnedBudget: res.body.data[18],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 21
      validateBudget({
        budgetUuid: budget21Uuid,
        expectedBudget: sampleData.budgets.budget21,
        returnedBudget: res.body.data[19],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 13
      validateBudget({
        budgetUuid: budget13Uuid,
        expectedBudget: sampleData.budgets.budget13,
        returnedBudget: res.body.data[20],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 20
      validateBudget({
        budgetUuid: budget20Uuid,
        expectedBudget: sampleData.budgets.budget20,
        returnedBudget: res.body.data[21],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 9
      validateBudget({
        budgetUuid: budget9Uuid,
        expectedBudget: sampleData.budgets.budget9,
        returnedBudget: res.body.data[22],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 4
      validateBudget({
        budgetUuid: budget4Uuid,
        expectedBudget: sampleData.budgets.budget4,
        returnedBudget: res.body.data[23],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 3
      validateBudget({
        budgetUuid: budget3Uuid,
        expectedBudget: sampleData.budgets.budget3,
        returnedBudget: res.body.data[24],
        subcategoryUuid: subcategory1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategory1Include = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategory1Include);
      assert.isOk(subcategory1Include.attributes);
      assert.strictEqual(subcategory1Include.attributes.name, sampleData.categories.category2.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 2 budgets as user 1 with subcategory 1 and no limit and page=2', async function() {
      const res = await chai.request(server)
        .get(`/budgets?subcategory_id=${subcategory1Uuid}&page=2`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);

      // Budget 12
      validateBudget({
        budgetUuid: budget12Uuid,
        expectedBudget: sampleData.budgets.budget12,
        returnedBudget: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 18
      validateBudget({
        budgetUuid: budget18Uuid,
        expectedBudget: sampleData.budgets.budget18,
        returnedBudget: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategory1Include = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategory1Include);
      assert.isOk(subcategory1Include.attributes);
      assert.strictEqual(subcategory1Include.attributes.name, sampleData.categories.category2.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 5 budgets as user 1 with subcategory 1 and limit=5 and page=4', async function() {
      const res = await chai.request(server)
        .get(`/budgets?subcategory_id=${subcategory1Uuid}&limit=5&page=4`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 5);

      // Budget 16
      validateBudget({
        budgetUuid: budget16Uuid,
        expectedBudget: sampleData.budgets.budget16,
        returnedBudget: res.body.data[0],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 8
      validateBudget({
        budgetUuid: budget8Uuid,
        expectedBudget: sampleData.budgets.budget8,
        returnedBudget: res.body.data[1],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 6
      validateBudget({
        budgetUuid: budget6Uuid,
        expectedBudget: sampleData.budgets.budget6,
        returnedBudget: res.body.data[2],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 14
      validateBudget({
        budgetUuid: budget14Uuid,
        expectedBudget: sampleData.budgets.budget14,
        returnedBudget: res.body.data[3],
        subcategoryUuid: subcategory1Uuid,
      });

      // Budget 21
      validateBudget({
        budgetUuid: budget21Uuid,
        expectedBudget: sampleData.budgets.budget21,
        returnedBudget: res.body.data[4],
        subcategoryUuid: subcategory1Uuid,
      });

      assert.isOk(res.body.included);
      const subcategory1Include = _.find(res.body.included, (include) => {
        return include.id === subcategory1Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategory1Include);
      assert.isOk(subcategory1Include.attributes);
      assert.strictEqual(subcategory1Include.attributes.name, sampleData.categories.category2.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 6);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 1 budget as user 1 with subcategory 2', async function() {
      const res = await chai.request(server)
        .get(`/budgets?subcategory_id=${subcategory2Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);

      // Budget 28
      validateBudget({
        budgetUuid: budget28Uuid,
        expectedBudget: sampleData.budgets.budget28,
        returnedBudget: res.body.data[0],
        subcategoryUuid: subcategory2Uuid,
      });

      assert.isOk(res.body.included);
      const subcategory2Include = _.find(res.body.included, (include) => {
        return include.id === subcategory2Uuid
          && include.type === 'subcategories';
      });
      assert.isOk(subcategory2Include);
      assert.isOk(subcategory2Include.attributes);
      assert.strictEqual(subcategory2Include.attributes.name, sampleData.categories.category4.name);
      assert.strictEqual(res.body.included.length, 1);

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 1);
    });
  });
});
