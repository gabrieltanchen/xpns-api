const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /subcategories', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let createSubcategorySpy;

  let categoryUuid;
  let userToken;
  let userUuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    createSubcategorySpy = sinon.spy(controllers.CategoryCtrl, 'createSubcategory');
  });

  after('restore sinon spies', function() {
    createSubcategorySpy.restore();
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

  afterEach('reset history for sinon spies', function() {
    createSubcategorySpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .post('/subcategories')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'name': sampleData.categories.category2.name,
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
          },
          'type': 'subcategories',
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(createSubcategorySpy.callCount, 0);
  });

  it('should return 422 with no name', async function() {
    const res = await chai.request(server)
      .post('/subcategories')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'name': '',
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
          },
          'type': 'subcategories',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Subcategory name is required.',
        source: {
          pointer: '/data/attributes/name',
        },
      }],
    });
    assert.strictEqual(createSubcategorySpy.callCount, 0);
  });

  it('should return 422 with no category uuid', async function() {
    const res = await chai.request(server)
      .post('/subcategories')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.categories.category2.name,
          },
          'relationships': {
            'category': {
              'data': {
                'id': null,
              },
            },
          },
          'type': 'subcategories',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Parent category is required.',
        source: {
          pointer: '/data/relationships/category/data/id',
        },
      }],
    });
    assert.strictEqual(createSubcategorySpy.callCount, 0);
  });

  it('should return 201 with valid data', async function() {
    const res = await chai.request(server)
      .post('/subcategories')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.categories.category2.name,
          },
          'relationships': {
            'category': {
              'data': {
                'id': categoryUuid,
              },
            },
          },
          'type': 'subcategories',
        },
      });
    expect(res).to.have.status(201);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.name, sampleData.categories.category2.name);
    assert.isOk(res.body.data.id);
    assert.strictEqual(res.body.data.type, 'subcategories');

    // Validate CategoryCtrl.createSubcategory call.
    assert.strictEqual(createSubcategorySpy.callCount, 1);
    const createSubcategoryParams = createSubcategorySpy.getCall(0).args[0];
    assert.isOk(createSubcategoryParams.auditApiCallUuid);
    assert.strictEqual(createSubcategoryParams.name, sampleData.categories.category2.name);

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
        uuid: createSubcategoryParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'POST');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), '/subcategories');
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), userUuid);
  });
});
