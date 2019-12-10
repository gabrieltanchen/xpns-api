const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - PATCH /expenses/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let updateExpenseSpy;

  let expenseUuid;
  let user1Subcategory1Uuid;
  let user1Subcategory2Uuid;
  let user1HouseholdMember1Uuid;
  let user1HouseholdMember2Uuid;
  let user1Token;
  let user1Uuid;
  let user1Vendor1Uuid;
  let user1Vendor2Uuid;
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
    updateExpenseSpy = sinon.spy(controllers.ExpenseCtrl, 'updateExpense');
  });

  after('restore sinon spies', function() {
    updateExpenseSpy.restore();
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

  beforeEach('create user 1 vendor 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Vendor1Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });
  });

  beforeEach('create user 1 vendor 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1Vendor2Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor2.name,
    });
  });

  beforeEach('create user 1 household member 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1HouseholdMember1Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user1.firstName,
    });
  });

  beforeEach('create user 1 household member 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    user1HouseholdMember2Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user2.firstName,
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

  beforeEach('create expense', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    expenseUuid = await controllers.ExpenseCtrl.createExpense({
      amountCents: sampleData.expenses.expense1.amount_cents,
      auditApiCallUuid: apiCall.get('uuid'),
      date: sampleData.expenses.expense1.date,
      description: sampleData.expenses.expense1.description,
      householdMemberUuid: user1HouseholdMember1Uuid,
      reimbursedCents: sampleData.expenses.expense1.reimbursed_cents,
      subcategoryUuid: user1Subcategory1Uuid,
      vendorUuid: user1Vendor1Uuid,
    });
  });

  afterEach('reset history for sinon spies', function() {
    updateExpenseSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense2.amount_cents,
            'date': sampleData.expenses.expense2.date,
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': sampleData.expenses.expense2.reimbursed_cents,
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
            'vendor': {
              'data': {
                'id': user1Vendor2Uuid,
              },
            },
          },
          'type': 'expenses',
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(updateExpenseSpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense2.amount_cents,
            'date': sampleData.expenses.expense2.date,
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': sampleData.expenses.expense2.reimbursed_cents,
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
            'vendor': {
              'data': {
                'id': user1Vendor2Uuid,
              },
            },
          },
          'type': 'expenses',
        },
      });
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find expense.',
      }],
    });

    assert.strictEqual(updateExpenseSpy.callCount, 1);
    const updateExpenseParams = updateExpenseSpy.getCall(0).args[0];
    assert.strictEqual(updateExpenseParams.amountCents, sampleData.expenses.expense2.amount_cents);
    assert.isOk(updateExpenseParams.auditApiCallUuid);
    assert.strictEqual(updateExpenseParams.subcategoryUuid, user1Subcategory2Uuid);
    assert.strictEqual(updateExpenseParams.date, sampleData.expenses.expense2.date);
    assert.strictEqual(updateExpenseParams.description, sampleData.expenses.expense2.description);
    assert.strictEqual(updateExpenseParams.householdMemberUuid, user1HouseholdMember2Uuid);
    assert.strictEqual(
      updateExpenseParams.reimbursedCents,
      sampleData.expenses.expense2.reimbursed_cents,
    );
    assert.strictEqual(updateExpenseParams.vendorUuid, user1Vendor2Uuid);
  });

  it('should return 422 with no amount cents', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': null,
            'date': sampleData.expenses.expense2.date,
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': sampleData.expenses.expense2.reimbursed_cents,
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
            'vendor': {
              'data': {
                'id': user1Vendor2Uuid,
              },
            },
          },
          'type': 'expenses',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Amount is required.',
        source: {
          pointer: '/data/attributes/amount-cents',
        },
      }],
    });
    assert.strictEqual(updateExpenseSpy.callCount, 0);
  });

  it('should return 422 with an invalid amount cents', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': '12.34',
            'date': sampleData.expenses.expense2.date,
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': sampleData.expenses.expense2.reimbursed_cents,
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
            'vendor': {
              'data': {
                'id': user1Vendor2Uuid,
              },
            },
          },
          'type': 'expenses',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Amount must be an integer.',
        source: {
          pointer: '/data/attributes/amount-cents',
        },
      }],
    });
    assert.strictEqual(updateExpenseSpy.callCount, 0);
  });

  it('should return 422 with no date', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense2.amount_cents,
            'date': null,
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': sampleData.expenses.expense2.reimbursed_cents,
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
            'vendor': {
              'data': {
                'id': user1Vendor2Uuid,
              },
            },
          },
          'type': 'expenses',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Date is required.',
        source: {
          pointer: '/data/attributes/date',
        },
      }, {
        detail: 'Date must be valid.',
        source: {
          pointer: '/data/attributes/date',
        },
      }],
    });
    assert.strictEqual(updateExpenseSpy.callCount, 0);
  });

  it('should return 422 with an invalid date', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense2.amount_cents,
            'date': 'invalid date',
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': sampleData.expenses.expense2.reimbursed_cents,
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
            'vendor': {
              'data': {
                'id': user1Vendor2Uuid,
              },
            },
          },
          'type': 'expenses',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Date must be valid.',
        source: {
          pointer: '/data/attributes/date',
        },
      }],
    });
    assert.strictEqual(updateExpenseSpy.callCount, 0);
  });

  it('should return 422 with no reimbursed cents', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense2.amount_cents,
            'date': sampleData.expenses.expense2.date,
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': null,
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
            'vendor': {
              'data': {
                'id': user1Vendor2Uuid,
              },
            },
          },
          'type': 'expenses',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Reimbursed amount is required.',
        source: {
          pointer: '/data/attributes/reimbursed-cents',
        },
      }],
    });
    assert.strictEqual(updateExpenseSpy.callCount, 0);
  });

  it('should return 422 with an invalid reimbursed cents', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense2.amount_cents,
            'date': sampleData.expenses.expense2.date,
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': '12.34',
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
            'vendor': {
              'data': {
                'id': user1Vendor2Uuid,
              },
            },
          },
          'type': 'expenses',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Reimbursed amount must be an integer.',
        source: {
          pointer: '/data/attributes/reimbursed-cents',
        },
      }],
    });
    assert.strictEqual(updateExpenseSpy.callCount, 0);
  });

  it('should return 422 with no subcategory uuid', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense2.amount_cents,
            'date': sampleData.expenses.expense2.date,
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': sampleData.expenses.expense2.reimbursed_cents,
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
            'subcategory': {
              'data': {
                'id': null,
              },
            },
            'vendor': {
              'data': {
                'id': user1Vendor2Uuid,
              },
            },
          },
          'type': 'expenses',
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
    assert.strictEqual(updateExpenseSpy.callCount, 0);
  });

  it('should return 422 with no vendor uuid', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense2.amount_cents,
            'date': sampleData.expenses.expense2.date,
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': sampleData.expenses.expense2.reimbursed_cents,
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
            'vendor': {
              'data': {
                'id': null,
              },
            },
          },
          'type': 'expenses',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Vendor is required.',
        source: {
          pointer: '/data/relationships/vendor/data/id',
        },
      }],
    });
    assert.strictEqual(updateExpenseSpy.callCount, 0);
  });

  it('should return 422 with no household member uuid', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense2.amount_cents,
            'date': sampleData.expenses.expense2.date,
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': sampleData.expenses.expense2.reimbursed_cents,
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': null,
              },
            },
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
            'vendor': {
              'data': {
                'id': user1Vendor2Uuid,
              },
            },
          },
          'type': 'expenses',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Member is required.',
        source: {
          pointer: '/data/relationships/household-member/data/id',
        },
      }],
    });
    assert.strictEqual(updateExpenseSpy.callCount, 0);
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .patch(`/expenses/${expenseUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense2.amount_cents,
            'date': sampleData.expenses.expense2.date,
            'description': sampleData.expenses.expense2.description,
            'reimbursed-cents': sampleData.expenses.expense2.reimbursed_cents,
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': user1HouseholdMember2Uuid,
              },
            },
            'subcategory': {
              'data': {
                'id': user1Subcategory2Uuid,
              },
            },
            'vendor': {
              'data': {
                'id': user1Vendor2Uuid,
              },
            },
          },
          'type': 'expenses',
        },
      });
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.strictEqual(res.body.data.attributes.amount, sampleData.expenses.expense2.amount);
    assert.strictEqual(res.body.data.attributes['amount-cents'], sampleData.expenses.expense2.amount_cents);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.date, sampleData.expenses.expense2.date);
    assert.strictEqual(
      res.body.data.attributes.description,
      sampleData.expenses.expense2.description,
    );
    assert.strictEqual(res.body.data.attributes['reimbursed-amount'], sampleData.expenses.expense2.reimbursed_amount);
    assert.strictEqual(res.body.data.attributes['reimbursed-cents'], sampleData.expenses.expense2.reimbursed_cents);
    assert.strictEqual(res.body.data.id, expenseUuid);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships['household-member']);
    assert.isOk(res.body.data.relationships['household-member'].data);
    assert.strictEqual(res.body.data.relationships['household-member'].data.id, user1HouseholdMember2Uuid);
    assert.isOk(res.body.data.relationships.subcategory);
    assert.isOk(res.body.data.relationships.subcategory.data);
    assert.strictEqual(res.body.data.relationships.subcategory.data.id, user1Subcategory2Uuid);
    assert.isOk(res.body.data.relationships.vendor);
    assert.isOk(res.body.data.relationships.vendor.data);
    assert.strictEqual(res.body.data.relationships.vendor.data.id, user1Vendor2Uuid);
    assert.strictEqual(res.body.data.type, 'expenses');

    // Validate ExpenseCtrl.updateExpense call.
    assert.strictEqual(updateExpenseSpy.callCount, 1);
    const updateExpenseParams = updateExpenseSpy.getCall(0).args[0];
    assert.strictEqual(updateExpenseParams.amountCents, sampleData.expenses.expense2.amount_cents);
    assert.isOk(updateExpenseParams.auditApiCallUuid);
    assert.strictEqual(updateExpenseParams.date, sampleData.expenses.expense2.date);
    assert.strictEqual(updateExpenseParams.description, sampleData.expenses.expense2.description);
    assert.strictEqual(updateExpenseParams.householdMemberUuid, user1HouseholdMember2Uuid);
    assert.strictEqual(
      updateExpenseParams.reimbursedCents,
      sampleData.expenses.expense2.reimbursed_cents,
    );
    assert.strictEqual(updateExpenseParams.subcategoryUuid, user1Subcategory2Uuid);
    assert.strictEqual(updateExpenseParams.vendorUuid, user1Vendor2Uuid);

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
        uuid: updateExpenseParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'PATCH');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/expenses/${expenseUuid}`);
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
