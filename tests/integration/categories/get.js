const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../sample-data/');
const TestHelper = require('../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /categories', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let category1Uuid;
  let category1Subcategory1Uuid;
  let category1Subcategory2Uuid;
  let category2Uuid;
  let category3Uuid;
  let category4Uuid;
  let category5Uuid;
  let category6Uuid;
  let category7Uuid;
  let category8Uuid;
  let category9Uuid;
  let category10Uuid;
  let category11Uuid;
  let category12Uuid;
  let category13Uuid;
  let category14Uuid;
  let category15Uuid;
  let category16Uuid;
  let category17Uuid;
  let category18Uuid;
  let category19Uuid;
  let category20Uuid;
  let category21Uuid;
  let category22Uuid;
  let category23Uuid;
  let category24Uuid;
  let category25Uuid;
  let category26Uuid;
  let category27Uuid;
  let category28Uuid;
  let user1Token;
  let user1Uuid;
  let user2Token;
  let user2Uuid;

  // 24 Addison
  // 22 Alexis
  // 20 Angel
  // 15 Arlie
  // 7 Austyn
  // 8 Bruno
  // 26 Caelan
  // 18 Cassidy
  // 19 Charlie
  // 3 Garret
  // 11 Gerry
  // 21 Justice
  // 27 Laurie
  // 16 Leith
  // 14 Lindsey
  // 17 Meade
  // 9 Morven
  // 13 Murphy
  // 6 Myles
  // 25 Payton
  // 1 Roland
  // 23 Selby
  // 5 Shayne
  // 12 Taylor
  // 10 Thomas
  // 4 Titus
  // 2 Winfield

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

  before('create category 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category1Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
    });
  });

  before('create category 1 subcategory 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category1Subcategory1Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category29.name,
      parentUuid: category1Uuid,
    });
  });

  before('create category 1 subcategory 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category1Subcategory2Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category30.name,
      parentUuid: category1Uuid,
    });
  });

  before('create category 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category2Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category2.name,
    });
  });

  before('create category 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category3Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category3.name,
    });
  });

  before('create category 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category4Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category4.name,
    });
  });

  before('create category 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category5Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category5.name,
    });
  });

  before('create category 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category6Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category6.name,
    });
  });

  before('create category 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category7Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category7.name,
    });
  });

  before('create category 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category8Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category8.name,
    });
  });

  before('create category 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category9Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category9.name,
    });
  });

  before('create category 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category10Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category10.name,
    });
  });

  before('create category 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category11Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category11.name,
    });
  });

  before('create category 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category12Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category12.name,
    });
  });

  before('create category 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category13Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category13.name,
    });
  });

  before('create category 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category14Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category14.name,
    });
  });

  before('create category 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category15Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category15.name,
    });
  });

  before('create category 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category16Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category16.name,
    });
  });

  before('create category 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category17Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category17.name,
    });
  });

  before('create category 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category18Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category18.name,
    });
  });

  before('create category 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category19Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category19.name,
    });
  });

  before('create category 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category20Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category20.name,
    });
  });

  before('create category 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category21Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category21.name,
    });
  });

  before('create category 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category22Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category22.name,
    });
  });

  before('create category 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category23Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category23.name,
    });
  });

  before('create category 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category24Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category24.name,
    });
  });

  before('create category 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category25Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category25.name,
    });
  });

  before('create category 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category26Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category26.name,
    });
  });

  before('create category 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category27Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category27.name,
    });
  });

  before('create category 28', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    category28Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category28.name,
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
      .get('/categories')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 200 and 25 categories as user 1 with no limit or page specified', async function() {
    const res = await chai.request(server)
      .get('/categories')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 25);

    // Category 24
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.categories.category24.name);
    assert.strictEqual(res.body.data[0].id, category24Uuid);
    assert.strictEqual(res.body.data[0].type, 'categories');

    // Category 22
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.categories.category22.name);
    assert.strictEqual(res.body.data[1].id, category22Uuid);
    assert.strictEqual(res.body.data[1].type, 'categories');

    // Category 20
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.categories.category20.name);
    assert.strictEqual(res.body.data[2].id, category20Uuid);
    assert.strictEqual(res.body.data[2].type, 'categories');

    // Category 15
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.categories.category15.name);
    assert.strictEqual(res.body.data[3].id, category15Uuid);
    assert.strictEqual(res.body.data[3].type, 'categories');

    // Category 7
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.categories.category7.name);
    assert.strictEqual(res.body.data[4].id, category7Uuid);
    assert.strictEqual(res.body.data[4].type, 'categories');

    // Category 8
    assert.isOk(res.body.data[5].attributes);
    assert.isOk(res.body.data[5].attributes['created-at']);
    assert.strictEqual(res.body.data[5].attributes.name, sampleData.categories.category8.name);
    assert.strictEqual(res.body.data[5].id, category8Uuid);
    assert.strictEqual(res.body.data[5].type, 'categories');

    // Category 26
    assert.isOk(res.body.data[6].attributes);
    assert.isOk(res.body.data[6].attributes['created-at']);
    assert.strictEqual(res.body.data[6].attributes.name, sampleData.categories.category26.name);
    assert.strictEqual(res.body.data[6].id, category26Uuid);
    assert.strictEqual(res.body.data[6].type, 'categories');

    // Category 18
    assert.isOk(res.body.data[7].attributes);
    assert.isOk(res.body.data[7].attributes['created-at']);
    assert.strictEqual(res.body.data[7].attributes.name, sampleData.categories.category18.name);
    assert.strictEqual(res.body.data[7].id, category18Uuid);
    assert.strictEqual(res.body.data[7].type, 'categories');

    // Category 19
    assert.isOk(res.body.data[8].attributes);
    assert.isOk(res.body.data[8].attributes['created-at']);
    assert.strictEqual(res.body.data[8].attributes.name, sampleData.categories.category19.name);
    assert.strictEqual(res.body.data[8].id, category19Uuid);
    assert.strictEqual(res.body.data[8].type, 'categories');

    // Category 3
    assert.isOk(res.body.data[9].attributes);
    assert.isOk(res.body.data[9].attributes['created-at']);
    assert.strictEqual(res.body.data[9].attributes.name, sampleData.categories.category3.name);
    assert.strictEqual(res.body.data[9].id, category3Uuid);
    assert.strictEqual(res.body.data[9].type, 'categories');

    // Category 11
    assert.isOk(res.body.data[10].attributes);
    assert.isOk(res.body.data[10].attributes['created-at']);
    assert.strictEqual(res.body.data[10].attributes.name, sampleData.categories.category11.name);
    assert.strictEqual(res.body.data[10].id, category11Uuid);
    assert.strictEqual(res.body.data[10].type, 'categories');

    // Category 21
    assert.isOk(res.body.data[11].attributes);
    assert.isOk(res.body.data[11].attributes['created-at']);
    assert.strictEqual(res.body.data[11].attributes.name, sampleData.categories.category21.name);
    assert.strictEqual(res.body.data[11].id, category21Uuid);
    assert.strictEqual(res.body.data[11].type, 'categories');

    // Category 27
    assert.isOk(res.body.data[12].attributes);
    assert.isOk(res.body.data[12].attributes['created-at']);
    assert.strictEqual(res.body.data[12].attributes.name, sampleData.categories.category27.name);
    assert.strictEqual(res.body.data[12].id, category27Uuid);
    assert.strictEqual(res.body.data[12].type, 'categories');

    // Category 16
    assert.isOk(res.body.data[13].attributes);
    assert.isOk(res.body.data[13].attributes['created-at']);
    assert.strictEqual(res.body.data[13].attributes.name, sampleData.categories.category16.name);
    assert.strictEqual(res.body.data[13].id, category16Uuid);
    assert.strictEqual(res.body.data[13].type, 'categories');

    // Category 14
    assert.isOk(res.body.data[14].attributes);
    assert.isOk(res.body.data[14].attributes['created-at']);
    assert.strictEqual(res.body.data[14].attributes.name, sampleData.categories.category14.name);
    assert.strictEqual(res.body.data[14].id, category14Uuid);
    assert.strictEqual(res.body.data[14].type, 'categories');

    // Category 17
    assert.isOk(res.body.data[15].attributes);
    assert.isOk(res.body.data[15].attributes['created-at']);
    assert.strictEqual(res.body.data[15].attributes.name, sampleData.categories.category17.name);
    assert.strictEqual(res.body.data[15].id, category17Uuid);
    assert.strictEqual(res.body.data[15].type, 'categories');

    // Category 9
    assert.isOk(res.body.data[16].attributes);
    assert.isOk(res.body.data[16].attributes['created-at']);
    assert.strictEqual(res.body.data[16].attributes.name, sampleData.categories.category9.name);
    assert.strictEqual(res.body.data[16].id, category9Uuid);
    assert.strictEqual(res.body.data[16].type, 'categories');

    // Category 13
    assert.isOk(res.body.data[17].attributes);
    assert.isOk(res.body.data[17].attributes['created-at']);
    assert.strictEqual(res.body.data[17].attributes.name, sampleData.categories.category13.name);
    assert.strictEqual(res.body.data[17].id, category13Uuid);
    assert.strictEqual(res.body.data[17].type, 'categories');

    // Category 6
    assert.isOk(res.body.data[18].attributes);
    assert.isOk(res.body.data[18].attributes['created-at']);
    assert.strictEqual(res.body.data[18].attributes.name, sampleData.categories.category6.name);
    assert.strictEqual(res.body.data[18].id, category6Uuid);
    assert.strictEqual(res.body.data[18].type, 'categories');

    // Category 25
    assert.isOk(res.body.data[19].attributes);
    assert.isOk(res.body.data[19].attributes['created-at']);
    assert.strictEqual(res.body.data[19].attributes.name, sampleData.categories.category25.name);
    assert.strictEqual(res.body.data[19].id, category25Uuid);
    assert.strictEqual(res.body.data[19].type, 'categories');

    // Category 1
    assert.isOk(res.body.data[20].attributes);
    assert.isOk(res.body.data[20].attributes['created-at']);
    assert.strictEqual(res.body.data[20].attributes.name, sampleData.categories.category1.name);
    assert.strictEqual(res.body.data[20].id, category1Uuid);
    assert.strictEqual(res.body.data[20].type, 'categories');

    // Category 23
    assert.isOk(res.body.data[21].attributes);
    assert.isOk(res.body.data[21].attributes['created-at']);
    assert.strictEqual(res.body.data[21].attributes.name, sampleData.categories.category23.name);
    assert.strictEqual(res.body.data[21].id, category23Uuid);
    assert.strictEqual(res.body.data[21].type, 'categories');

    // Category 5
    assert.isOk(res.body.data[22].attributes);
    assert.isOk(res.body.data[22].attributes['created-at']);
    assert.strictEqual(res.body.data[22].attributes.name, sampleData.categories.category5.name);
    assert.strictEqual(res.body.data[22].id, category5Uuid);
    assert.strictEqual(res.body.data[22].type, 'categories');

    // Category 12
    assert.isOk(res.body.data[23].attributes);
    assert.isOk(res.body.data[23].attributes['created-at']);
    assert.strictEqual(res.body.data[23].attributes.name, sampleData.categories.category12.name);
    assert.strictEqual(res.body.data[23].id, category12Uuid);
    assert.strictEqual(res.body.data[23].type, 'categories');

    // Category 10
    assert.isOk(res.body.data[24].attributes);
    assert.isOk(res.body.data[24].attributes['created-at']);
    assert.strictEqual(res.body.data[24].attributes.name, sampleData.categories.category10.name);
    assert.strictEqual(res.body.data[24].id, category10Uuid);
    assert.strictEqual(res.body.data[24].type, 'categories');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 2 categories as user 1 with no limit and page=2', async function() {
    const res = await chai.request(server)
      .get('/categories?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 2);

    // Category 4
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.categories.category4.name);
    assert.strictEqual(res.body.data[0].id, category4Uuid);
    assert.strictEqual(res.body.data[0].type, 'categories');

    // Category 2
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.categories.category2.name);
    assert.strictEqual(res.body.data[1].id, category2Uuid);
    assert.strictEqual(res.body.data[1].type, 'categories');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 5 categories as user 1 with limit=5 and page=4', async function() {
    const res = await chai.request(server)
      .get('/categories?limit=5&page=4')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 5);

    // Category 17
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.categories.category17.name);
    assert.strictEqual(res.body.data[0].id, category17Uuid);
    assert.strictEqual(res.body.data[0].type, 'categories');

    // Category 9
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.categories.category9.name);
    assert.strictEqual(res.body.data[1].id, category9Uuid);
    assert.strictEqual(res.body.data[1].type, 'categories');

    // Category 13
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.categories.category13.name);
    assert.strictEqual(res.body.data[2].id, category13Uuid);
    assert.strictEqual(res.body.data[2].type, 'categories');

    // Category 6
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.categories.category6.name);
    assert.strictEqual(res.body.data[3].id, category6Uuid);
    assert.strictEqual(res.body.data[3].type, 'categories');

    // Category 25
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.categories.category25.name);
    assert.strictEqual(res.body.data[4].id, category25Uuid);
    assert.strictEqual(res.body.data[4].type, 'categories');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 6);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 1 category as user 2', async function() {
    const res = await chai.request(server)
      .get('/categories')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 1);

    // Category 28
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.categories.category28.name);
    assert.strictEqual(res.body.data[0].id, category28Uuid);
    assert.strictEqual(res.body.data[0].type, 'categories');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });

  it('should return 200 and 0 categories as user 2 with page=2', async function() {
    const res = await chai.request(server)
      .get('/categories?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 0);
    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });

  it('should return 404 with parent category 1 as user 2', async function() {
    const res = await chai.request(server)
      .get(`/categories?parent_uuid=${category1Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Not found',
      }],
    });
  });

  it('should return 200 and 2 subcategories with parent category 1 as user 1', async function() {
    const res = await chai.request(server)
      .get(`/categories?parent_uuid=${category1Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 2);

    // Category 1 Subcategory 1
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.categories.category29.name);
    assert.strictEqual(res.body.data[0].id, category1Subcategory1Uuid);
    assert.strictEqual(res.body.data[0].type, 'categories');

    // Category 1 Subcategory 2
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.categories.category30.name);
    assert.strictEqual(res.body.data[1].id, category1Subcategory2Uuid);
    assert.strictEqual(res.body.data[1].type, 'categories');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 2);
  });

  it('should return 200 and 0 subcategories with parent category 2 as user 1', async function() {
    const res = await chai.request(server)
      .get(`/categories?parent_uuid=${category2Uuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 0);
    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 0);
    assert.strictEqual(res.body.meta.total, 0);
  });
});
