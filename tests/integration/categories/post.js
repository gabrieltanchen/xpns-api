const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../sample-data/');
const TestHelper = require('../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - POST /categories', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let createCategorySpy;

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
    createCategorySpy = sinon.spy(controllers.CategoryCtrl, 'createCategory');
  });

  after('restore sinon spies', function() {
    createCategorySpy.restore();
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

  afterEach('reset history for sinon spies', function() {
    createCategorySpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .post('/categories')
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'name': sampleData.categories.category1.name,
          },
          'type': 'categories',
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(createCategorySpy.callCount, 0);
  });

  it('should return 422 with no name', async function() {
    const res = await chai.request(server)
      .post('/categories')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'name': '',
          },
          'type': 'categories',
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
    assert.strictEqual(createCategorySpy.callCount, 0);
  });

  it('should return 201 with valid data', async function() {
    const res = await chai.request(server)
      .post('/categories')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.categories.category1.name,
          },
          'type': 'categories',
        },
      });
    expect(res).to.have.status(201);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.name, sampleData.categories.category1.name);
    assert.isOk(res.body.data.id);
    assert.strictEqual(res.body.data.type, 'categories');

    // Validate CategoryCtrl.createCategory call.
    assert.strictEqual(createCategorySpy.callCount, 1);
    const createCategoryParams = createCategorySpy.getCall(0).args[0];
    assert.isOk(createCategoryParams.auditApiCallUuid);
    assert.strictEqual(createCategoryParams.name, sampleData.categories.category1.name);

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
        uuid: createCategoryParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'POST');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), '/categories');
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });

  describe('when creating a subcategory', function() {
    let categoryUuid;

    beforeEach('create parent category', async function() {
      const apiCall = await models.Audit.ApiCall.create({
        user_uuid: user1Uuid,
      });
      categoryUuid = await controllers.CategoryCtrl.createCategory({
        auditApiCallUuid: apiCall.get('uuid'),
        name: sampleData.categories.category1.name,
      });
    });

    beforeEach('reset createCategory spy', function() {
      createCategorySpy.resetHistory();
    });

    it('should return 404 with the wrong auth token', async function() {
      const res = await chai.request(server)
        .post('/categories')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user2Token}`)
        .send({
          'data': {
            'attributes': {
              'name': sampleData.categories.category2.name,
              'parent-uuid': categoryUuid,
            },
            'type': 'categories',
          },
        });
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Not found',
        }],
      });
    });

    it('should return 201 with a valid parent category', async function() {
      const res = await chai.request(server)
        .post('/categories')
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          'data': {
            'attributes': {
              'name': sampleData.categories.category2.name,
              'parent-uuid': categoryUuid,
            },
            'type': 'categories',
          },
        });
      expect(res).to.have.status(201);
      assert.isOk(res.body.data);
      assert.isOk(res.body.data.attributes);
      assert.isOk(res.body.data.attributes['created-at']);
      assert.strictEqual(res.body.data.attributes.name, sampleData.categories.category2.name);
      assert.isOk(res.body.data.id);
      assert.strictEqual(res.body.data.type, 'categories');

      // Validate CategoryCtrl.createCategory call.
      assert.strictEqual(createCategorySpy.callCount, 1);
      const createCategoryParams = createCategorySpy.getCall(0).args[0];
      assert.isOk(createCategoryParams.auditApiCallUuid);
      assert.strictEqual(createCategoryParams.name, sampleData.categories.category2.name);
      assert.strictEqual(createCategoryParams.parentUuid, categoryUuid);

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
          uuid: createCategoryParams.auditApiCallUuid,
        },
      });
      assert.isOk(apiCall);
      assert.strictEqual(apiCall.get('http_method'), 'POST');
      assert.isOk(apiCall.get('ip_address'));
      assert.strictEqual(apiCall.get('route'), '/categories');
      assert.isOk(apiCall.get('user_agent'));
      assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
    });
  });
});
