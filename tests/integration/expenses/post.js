const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../sample-data/');
const TestHelper = require('../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /expenses', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let createExpenseSpy;

  let categoryUuid;
  let userToken;
  let userUuid;
  let vendorUuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    createExpenseSpy = sinon.spy(controllers.ExpenseCtrl, 'createExpense');
  });

  after('restore sinon spies', function() {
    createExpenseSpy.restore();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  beforeEach('create user', async function() {
    const apiCall = await models.Audit.ApiCall.create();
    userUuid = await controllers.UserCtrl.signUp({
      auditApiCallUuid: apiCall.get('uuid'),
      email: sampleData.users.user1.email,
      firstName: sampleData.users.user1.firstName,
      lastName: sampleData.users.user1.lastName,
      password: sampleData.users.user1.password,
    });
  });

  beforeEach('create user token', async function() {
    userToken = await controllers.UserCtrl.getToken(userUuid);
  });

  beforeEach('create category', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    categoryUuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
  });

  beforeEach('create vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: userUuid,
    });
    vendorUuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });
  });

  afterEach('reset history for sinon spies', function() {
    createExpenseSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .post('/expenses')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense1.amount_cents,
            'date': sampleData.expenses.expense1.date,
            'description': sampleData.expenses.expense1.description,
            'reimbursed-cents': sampleData.expenses.expense1.reimbursed_cents,
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
            'vendor': {
              'data': {
                'id': vendorUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(createExpenseSpy.callCount, 0);
  });

  it('should return 422 with no amount cents', async function() {
    const res = await chai.request(server)
      .post('/expenses')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': null,
            'date': sampleData.expenses.expense1.date,
            'description': sampleData.expenses.expense1.description,
            'reimbursed-cents': sampleData.expenses.expense1.reimbursed_cents,
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
            'vendor': {
              'data': {
                'id': vendorUuid,
              },
            },
          },
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
    assert.strictEqual(createExpenseSpy.callCount, 0);
  });

  it('should return 422 with an invalid amount cents', async function() {
    const res = await chai.request(server)
      .post('/expenses')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': '12.34',
            'date': sampleData.expenses.expense1.date,
            'description': sampleData.expenses.expense1.description,
            'reimbursed-cents': sampleData.expenses.expense1.reimbursed_cents,
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
            'vendor': {
              'data': {
                'id': vendorUuid,
              },
            },
          },
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
    assert.strictEqual(createExpenseSpy.callCount, 0);
  });

  it('should return 422 with no date', async function() {
    const res = await chai.request(server)
      .post('/expenses')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense1.amount_cents,
            'date': null,
            'description': sampleData.expenses.expense1.description,
            'reimbursed-cents': sampleData.expenses.expense1.reimbursed_cents,
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
            'vendor': {
              'data': {
                'id': vendorUuid,
              },
            },
          },
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
    assert.strictEqual(createExpenseSpy.callCount, 0);
  });

  it('should return 422 with an invalid date', async function() {
    const res = await chai.request(server)
      .post('/expenses')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense1.amount_cents,
            'date': 'invalid date',
            'description': sampleData.expenses.expense1.description,
            'reimbursed-cents': sampleData.expenses.expense1.reimbursed_cents,
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
            'vendor': {
              'data': {
                'id': vendorUuid,
              },
            },
          },
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
    assert.strictEqual(createExpenseSpy.callCount, 0);
  });

  it('should return 422 with no reimbursed cents', async function() {
    const res = await chai.request(server)
      .post('/expenses')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense1.amount_cents,
            'date': sampleData.expenses.expense1.date,
            'description': sampleData.expenses.expense1.description,
            'reimbursed-cents': null,
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
            'vendor': {
              'data': {
                'id': vendorUuid,
              },
            },
          },
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
    assert.strictEqual(createExpenseSpy.callCount, 0);
  });

  it('should return 422 with an invalid reimbursed cents', async function() {
    const res = await chai.request(server)
      .post('/expenses')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense1.amount_cents,
            'date': sampleData.expenses.expense1.date,
            'description': sampleData.expenses.expense1.description,
            'reimbursed-cents': '12.34',
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
            'vendor': {
              'data': {
                'id': vendorUuid,
              },
            },
          },
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
    assert.strictEqual(createExpenseSpy.callCount, 0);
  });

  it('should return 422 with no category uuid', async function() {
    const res = await chai.request(server)
      .post('/expenses')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense1.amount_cents,
            'date': sampleData.expenses.expense1.date,
            'description': sampleData.expenses.expense1.description,
            'reimbursed-cents': sampleData.expenses.expense1.reimbursed_cents,
          },
          'relationships': {
            'category': {
              'data': {
                'id': null,
              },
            },
            'vendor': {
              'data': {
                'id': vendorUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Category is required.',
        source: {
          pointer: '/data/relationships/category/data/id',
        },
      }],
    });
    assert.strictEqual(createExpenseSpy.callCount, 0);
  });

  it('should return 422 with no vendor uuid', async function() {
    const res = await chai.request(server)
      .post('/expenses')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense1.amount_cents,
            'date': sampleData.expenses.expense1.date,
            'description': sampleData.expenses.expense1.description,
            'reimbursed-cents': sampleData.expenses.expense1.reimbursed_cents,
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
            'vendor': {
              'data': {
                'id': null,
              },
            },
          },
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
    assert.strictEqual(createExpenseSpy.callCount, 0);
  });

  it('should return 201 with valid data', async function() {
    const res = await chai.request(server)
      .post('/expenses')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'amount-cents': sampleData.expenses.expense1.amount_cents,
            'date': sampleData.expenses.expense1.date,
            'description': sampleData.expenses.expense1.description,
            'reimbursed-cents': sampleData.expenses.expense1.reimbursed_cents,
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
            'vendor': {
              'data': {
                'id': vendorUuid,
              },
            },
          },
        },
      });
    expect(res).to.have.status(201);
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
    assert.isOk(res.body.data.id);
    assert.isOk(res.body.data.relationships);
    assert.isOk(res.body.data.relationships.category);
    assert.isOk(res.body.data.relationships.category.data);
    assert.strictEqual(res.body.data.relationships.category.data.id, categoryUuid);
    assert.isOk(res.body.data.relationships.vendor);
    assert.isOk(res.body.data.relationships.vendor.data);
    assert.strictEqual(res.body.data.relationships.vendor.data.id, vendorUuid);
    assert.strictEqual(res.body.data.type, 'expenses');

    // Validate ExpenseCtrl.createExpense call.
    assert.strictEqual(createExpenseSpy.callCount, 1);
    const createExpenseParams = createExpenseSpy.getCall(0).args[0];
    assert.isOk(createExpenseParams.auditApiCallUuid);
    assert.strictEqual(createExpenseParams.amountCents, sampleData.expenses.expense1.amount_cents);
    assert.isOk(createExpenseParams.auditApiCallUuid);
    assert.strictEqual(createExpenseParams.categoryUuid, categoryUuid);
    assert.strictEqual(createExpenseParams.date, sampleData.expenses.expense1.date);
    assert.strictEqual(createExpenseParams.description, sampleData.expenses.expense1.description);
    assert.strictEqual(
      createExpenseParams.reimbursedCents,
      sampleData.expenses.expense1.reimbursed_cents,
    );
    assert.strictEqual(createExpenseParams.vendorUuid, vendorUuid);

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
        uuid: createExpenseParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'POST');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), '/expenses');
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), userUuid);
  });
});
