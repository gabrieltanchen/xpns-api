const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - PATCH /subcategories/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let updateSubcategorySpy;

  let category1Uuid;
  let category2Uuid;
  let subcategoryUuid;
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

  before('create sinon spies', function() {
    updateSubcategorySpy = sinon.spy(controllers.CategoryCtrl, 'updateSubcategory');
  });

  after('restore sinon spies', function() {
    updateSubcategorySpy.restore();
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

  beforeEach('create category 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category1Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
  });

  beforeEach('create category 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category2Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category2.name,
    });
  });

  beforeEach('create subcategory', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategoryUuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category3.name,
    });
  });

  afterEach('reset history for sinon spies', function() {
    updateSubcategorySpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .patch(`/subcategories/${subcategoryUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'name': sampleData.categories.category4.name,
          },
          'id': subcategoryUuid,
          'relationships': {
            'category': {
              'data': {
                'id': category2Uuid,
                'type': 'categories',
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
    assert.strictEqual(updateSubcategorySpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .patch(`/subcategories/${subcategoryUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.categories.category4.name,
          },
          'id': subcategoryUuid,
          'relationships': {
            'category': {
              'data': {
                'id': category2Uuid,
                'type': 'categories',
              },
            },
          },
          'type': 'subcategories',
        },
      });
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unable to find category.',
      }],
    });

    assert.strictEqual(updateSubcategorySpy.callCount, 1);
    const updateSubcategoryParams = updateSubcategorySpy.getCall(0).args[0];
    assert.isOk(updateSubcategoryParams.auditApiCallUuid);
    assert.strictEqual(updateSubcategoryParams.categoryUuid, category2Uuid);
    assert.strictEqual(updateSubcategoryParams.name, sampleData.categories.category4.name);
    assert.strictEqual(updateSubcategoryParams.subcategoryUuid, subcategoryUuid);
  });

  it('should return 422 with no name', async function() {
    const res = await chai.request(server)
      .patch(`/subcategories/${subcategoryUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'name': '',
          },
          'id': subcategoryUuid,
          'relationships': {
            'category': {
              'data': {
                'id': category2Uuid,
                'type': 'categories',
              },
            },
          },
          'type': 'subcategories',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Category name is required.',
        source: {
          pointer: '/data/attributes/name',
        },
      }],
    });
    assert.strictEqual(updateSubcategorySpy.callCount, 0);
  });

  it('should return 422 with no category ID', async function() {
    const res = await chai.request(server)
      .patch(`/subcategories/${subcategoryUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.categories.category4.name,
          },
          'id': subcategoryUuid,
          'relationships': {
            'category': {
              'data': {
                'id': null,
                'type': 'categories',
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
    assert.strictEqual(updateSubcategorySpy.callCount, 0);
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .patch(`/subcategories/${subcategoryUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.categories.category4.name,
          },
          'id': subcategoryUuid,
          'relationships': {
            'category': {
              'data': {
                'id': category2Uuid,
                'type': 'categories',
              },
            },
          },
          'type': 'subcategories',
        },
      });
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.name, sampleData.categories.category4.name);
    assert.strictEqual(res.body.data.id, subcategoryUuid);
    assert.strictEqual(res.body.data.type, 'subcategories');

    // Validate CategoryCtrl.updateSubcategory call.
    assert.strictEqual(updateSubcategorySpy.callCount, 1);
    const updateSubcategoryParams = updateSubcategorySpy.getCall(0).args[0];
    assert.isOk(updateSubcategoryParams.auditApiCallUuid);
    assert.strictEqual(updateSubcategoryParams.categoryUuid, category2Uuid);
    assert.strictEqual(updateSubcategoryParams.name, sampleData.categories.category4.name);
    assert.strictEqual(updateSubcategoryParams.subcategoryUuid, subcategoryUuid);

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
        uuid: updateSubcategoryParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'PATCH');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/subcategories/${subcategoryUuid}`);
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
