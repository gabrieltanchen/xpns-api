const chai = require('chai');
const chaiHttp = require('chai-http');
const uuidv4 = require('uuid/v4');

const sampleData = require('../../sample-data/');
const TestHelper = require('../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /subcategories', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let category1Uuid;
  let category2Uuid;
  let subcategory1Uuid;
  let subcategory2Uuid;
  let subcategory3Uuid;
  let subcategory4Uuid;
  let subcategory5Uuid;
  let subcategory6Uuid;
  let subcategory7Uuid;
  let subcategory8Uuid;
  let subcategory9Uuid;
  let subcategory10Uuid;
  let subcategory11Uuid;
  let subcategory12Uuid;
  let subcategory13Uuid;
  let subcategory14Uuid;
  let subcategory15Uuid;
  let subcategory16Uuid;
  let subcategory17Uuid;
  let subcategory18Uuid;
  let subcategory19Uuid;
  let subcategory20Uuid;
  let subcategory21Uuid;
  let subcategory22Uuid;
  let subcategory23Uuid;
  let subcategory24Uuid;
  let subcategory25Uuid;
  let subcategory26Uuid;
  let subcategory27Uuid;
  let subcategory28Uuid;
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

  before('create category 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    category1Uuid = await controllers.CategoryCtrl.createCategory({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.categories.category1.name,
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

  before('create subcategory 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory1Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category1.name,
    });
  });

  before('create subcategory 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory2Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category2.name,
    });
  });

  before('create subcategory 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory3Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category3.name,
    });
  });

  before('create subcategory 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory4Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category4.name,
    });
  });

  before('create subcategory 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory5Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category5.name,
    });
  });

  before('create subcategory 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory6Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category6.name,
    });
  });

  before('create subcategory 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory7Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category7.name,
    });
  });

  before('create subcategory 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory8Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category8.name,
    });
  });

  before('create subcategory 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory9Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category9.name,
    });
  });

  before('create subcategory 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory10Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category10.name,
    });
  });

  before('create subcategory 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory11Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category11.name,
    });
  });

  before('create subcategory 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory12Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category12.name,
    });
  });

  before('create subcategory 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory13Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category13.name,
    });
  });

  before('create subcategory 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory14Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category14.name,
    });
  });

  before('create subcategory 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory15Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category15.name,
    });
  });

  before('create subcategory 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory16Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category16.name,
    });
  });

  before('create subcategory 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory17Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category17.name,
    });
  });

  before('create subcategory 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory18Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category18.name,
    });
  });

  before('create subcategory 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory19Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category19.name,
    });
  });

  before('create subcategory 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory20Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category20.name,
    });
  });

  before('create subcategory 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory21Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category21.name,
    });
  });

  before('create subcategory 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory22Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category22.name,
    });
  });

  before('create subcategory 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory23Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category23.name,
    });
  });

  before('create subcategory 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory24Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category24.name,
    });
  });

  before('create subcategory 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory25Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category25.name,
    });
  });

  before('create subcategory 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory26Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category26.name,
    });
  });

  before('create subcategory 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory27Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category1Uuid,
      name: sampleData.categories.category27.name,
    });
  });

  before('create subcategory 28', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    subcategory28Uuid = await controllers.CategoryCtrl.createSubcategory({
      auditApiCallUuid: apiCall.get('uuid'),
      categoryUuid: category2Uuid,
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
      .get('/subcategories')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 403 with no category id', async function() {
    const res = await chai.request(server)
      .get('/subcategories')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(403);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Category ID is required.',
      }],
    });
  });

  describe('when called with the category_uuid query param', function() {
    it('should return 404 when the category does not exist', async function() {
      const res = await chai.request(server)
        .get(`/subcategories?category_uuid=${uuidv4()}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find category.',
        }],
      });
    });

    it('should return 404 when the category belongs to a different household', async function() {
      const res = await chai.request(server)
        .get(`/subcategories?category_uuid=${category1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user2Token}`);
      expect(res).to.have.status(404);
      assert.deepEqual(res.body, {
        errors: [{
          detail: 'Unable to find category.',
        }],
      });
    });

    it('should return 200 and 25 subcategories as user 1 with category 1 and no limit or page specified', async function() {
      const res = await chai.request(server)
        .get(`/subcategories?category_uuid=${category1Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 25);

      // Subcategory 24
      assert.isOk(res.body.data[0].attributes);
      assert.isOk(res.body.data[0].attributes['created-at']);
      assert.strictEqual(res.body.data[0].attributes.name, sampleData.categories.category24.name);
      assert.strictEqual(res.body.data[0].id, subcategory24Uuid);
      assert.strictEqual(res.body.data[0].type, 'subcategories');

      // Subcategory 22
      assert.isOk(res.body.data[1].attributes);
      assert.isOk(res.body.data[1].attributes['created-at']);
      assert.strictEqual(res.body.data[1].attributes.name, sampleData.categories.category22.name);
      assert.strictEqual(res.body.data[1].id, subcategory22Uuid);
      assert.strictEqual(res.body.data[1].type, 'subcategories');

      // Subcategory 20
      assert.isOk(res.body.data[2].attributes);
      assert.isOk(res.body.data[2].attributes['created-at']);
      assert.strictEqual(res.body.data[2].attributes.name, sampleData.categories.category20.name);
      assert.strictEqual(res.body.data[2].id, subcategory20Uuid);
      assert.strictEqual(res.body.data[2].type, 'subcategories');

      // Subcategory 15
      assert.isOk(res.body.data[3].attributes);
      assert.isOk(res.body.data[3].attributes['created-at']);
      assert.strictEqual(res.body.data[3].attributes.name, sampleData.categories.category15.name);
      assert.strictEqual(res.body.data[3].id, subcategory15Uuid);
      assert.strictEqual(res.body.data[3].type, 'subcategories');

      // Subcategory 7
      assert.isOk(res.body.data[4].attributes);
      assert.isOk(res.body.data[4].attributes['created-at']);
      assert.strictEqual(res.body.data[4].attributes.name, sampleData.categories.category7.name);
      assert.strictEqual(res.body.data[4].id, subcategory7Uuid);
      assert.strictEqual(res.body.data[4].type, 'subcategories');

      // Subcategory 8
      assert.isOk(res.body.data[5].attributes);
      assert.isOk(res.body.data[5].attributes['created-at']);
      assert.strictEqual(res.body.data[5].attributes.name, sampleData.categories.category8.name);
      assert.strictEqual(res.body.data[5].id, subcategory8Uuid);
      assert.strictEqual(res.body.data[5].type, 'subcategories');

      // Subcategory 26
      assert.isOk(res.body.data[6].attributes);
      assert.isOk(res.body.data[6].attributes['created-at']);
      assert.strictEqual(res.body.data[6].attributes.name, sampleData.categories.category26.name);
      assert.strictEqual(res.body.data[6].id, subcategory26Uuid);
      assert.strictEqual(res.body.data[6].type, 'subcategories');

      // Subcategory 18
      assert.isOk(res.body.data[7].attributes);
      assert.isOk(res.body.data[7].attributes['created-at']);
      assert.strictEqual(res.body.data[7].attributes.name, sampleData.categories.category18.name);
      assert.strictEqual(res.body.data[7].id, subcategory18Uuid);
      assert.strictEqual(res.body.data[7].type, 'subcategories');

      // Subcategory 19
      assert.isOk(res.body.data[8].attributes);
      assert.isOk(res.body.data[8].attributes['created-at']);
      assert.strictEqual(res.body.data[8].attributes.name, sampleData.categories.category19.name);
      assert.strictEqual(res.body.data[8].id, subcategory19Uuid);
      assert.strictEqual(res.body.data[8].type, 'subcategories');

      // Subcategory 3
      assert.isOk(res.body.data[9].attributes);
      assert.isOk(res.body.data[9].attributes['created-at']);
      assert.strictEqual(res.body.data[9].attributes.name, sampleData.categories.category3.name);
      assert.strictEqual(res.body.data[9].id, subcategory3Uuid);
      assert.strictEqual(res.body.data[9].type, 'subcategories');

      // Subcategory 11
      assert.isOk(res.body.data[10].attributes);
      assert.isOk(res.body.data[10].attributes['created-at']);
      assert.strictEqual(res.body.data[10].attributes.name, sampleData.categories.category11.name);
      assert.strictEqual(res.body.data[10].id, subcategory11Uuid);
      assert.strictEqual(res.body.data[10].type, 'subcategories');

      // Subcategory 21
      assert.isOk(res.body.data[11].attributes);
      assert.isOk(res.body.data[11].attributes['created-at']);
      assert.strictEqual(res.body.data[11].attributes.name, sampleData.categories.category21.name);
      assert.strictEqual(res.body.data[11].id, subcategory21Uuid);
      assert.strictEqual(res.body.data[11].type, 'subcategories');

      // Subcategory 27
      assert.isOk(res.body.data[12].attributes);
      assert.isOk(res.body.data[12].attributes['created-at']);
      assert.strictEqual(res.body.data[12].attributes.name, sampleData.categories.category27.name);
      assert.strictEqual(res.body.data[12].id, subcategory27Uuid);
      assert.strictEqual(res.body.data[12].type, 'subcategories');

      // Subcategory 16
      assert.isOk(res.body.data[13].attributes);
      assert.isOk(res.body.data[13].attributes['created-at']);
      assert.strictEqual(res.body.data[13].attributes.name, sampleData.categories.category16.name);
      assert.strictEqual(res.body.data[13].id, subcategory16Uuid);
      assert.strictEqual(res.body.data[13].type, 'subcategories');

      // Subcategory 14
      assert.isOk(res.body.data[14].attributes);
      assert.isOk(res.body.data[14].attributes['created-at']);
      assert.strictEqual(res.body.data[14].attributes.name, sampleData.categories.category14.name);
      assert.strictEqual(res.body.data[14].id, subcategory14Uuid);
      assert.strictEqual(res.body.data[14].type, 'subcategories');

      // Subcategory 17
      assert.isOk(res.body.data[15].attributes);
      assert.isOk(res.body.data[15].attributes['created-at']);
      assert.strictEqual(res.body.data[15].attributes.name, sampleData.categories.category17.name);
      assert.strictEqual(res.body.data[15].id, subcategory17Uuid);
      assert.strictEqual(res.body.data[15].type, 'subcategories');

      // Subcategory 9
      assert.isOk(res.body.data[16].attributes);
      assert.isOk(res.body.data[16].attributes['created-at']);
      assert.strictEqual(res.body.data[16].attributes.name, sampleData.categories.category9.name);
      assert.strictEqual(res.body.data[16].id, subcategory9Uuid);
      assert.strictEqual(res.body.data[16].type, 'subcategories');

      // Subcategory 13
      assert.isOk(res.body.data[17].attributes);
      assert.isOk(res.body.data[17].attributes['created-at']);
      assert.strictEqual(res.body.data[17].attributes.name, sampleData.categories.category13.name);
      assert.strictEqual(res.body.data[17].id, subcategory13Uuid);
      assert.strictEqual(res.body.data[17].type, 'subcategories');

      // Subcategory 6
      assert.isOk(res.body.data[18].attributes);
      assert.isOk(res.body.data[18].attributes['created-at']);
      assert.strictEqual(res.body.data[18].attributes.name, sampleData.categories.category6.name);
      assert.strictEqual(res.body.data[18].id, subcategory6Uuid);
      assert.strictEqual(res.body.data[18].type, 'subcategories');

      // Subcategory 25
      assert.isOk(res.body.data[19].attributes);
      assert.isOk(res.body.data[19].attributes['created-at']);
      assert.strictEqual(res.body.data[19].attributes.name, sampleData.categories.category25.name);
      assert.strictEqual(res.body.data[19].id, subcategory25Uuid);
      assert.strictEqual(res.body.data[19].type, 'subcategories');

      // Subcategory 1
      assert.isOk(res.body.data[20].attributes);
      assert.isOk(res.body.data[20].attributes['created-at']);
      assert.strictEqual(res.body.data[20].attributes.name, sampleData.categories.category1.name);
      assert.strictEqual(res.body.data[20].id, subcategory1Uuid);
      assert.strictEqual(res.body.data[20].type, 'subcategories');

      // Subcategory 23
      assert.isOk(res.body.data[21].attributes);
      assert.isOk(res.body.data[21].attributes['created-at']);
      assert.strictEqual(res.body.data[21].attributes.name, sampleData.categories.category23.name);
      assert.strictEqual(res.body.data[21].id, subcategory23Uuid);
      assert.strictEqual(res.body.data[21].type, 'subcategories');

      // Subcategory 5
      assert.isOk(res.body.data[22].attributes);
      assert.isOk(res.body.data[22].attributes['created-at']);
      assert.strictEqual(res.body.data[22].attributes.name, sampleData.categories.category5.name);
      assert.strictEqual(res.body.data[22].id, subcategory5Uuid);
      assert.strictEqual(res.body.data[22].type, 'subcategories');

      // Subcategory 12
      assert.isOk(res.body.data[23].attributes);
      assert.isOk(res.body.data[23].attributes['created-at']);
      assert.strictEqual(res.body.data[23].attributes.name, sampleData.categories.category12.name);
      assert.strictEqual(res.body.data[23].id, subcategory12Uuid);
      assert.strictEqual(res.body.data[23].type, 'subcategories');

      // Subcategory 10
      assert.isOk(res.body.data[24].attributes);
      assert.isOk(res.body.data[24].attributes['created-at']);
      assert.strictEqual(res.body.data[24].attributes.name, sampleData.categories.category10.name);
      assert.strictEqual(res.body.data[24].id, subcategory10Uuid);
      assert.strictEqual(res.body.data[24].type, 'subcategories');

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 2 subcategories as user 1 with category 1 and no limit and page=2', async function() {
      const res = await chai.request(server)
        .get(`/subcategories?category_uuid=${category1Uuid}&page=2`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 2);

      // Subcategory 4
      assert.isOk(res.body.data[0].attributes);
      assert.isOk(res.body.data[0].attributes['created-at']);
      assert.strictEqual(res.body.data[0].attributes.name, sampleData.categories.category4.name);
      assert.strictEqual(res.body.data[0].id, subcategory4Uuid);
      assert.strictEqual(res.body.data[0].type, 'subcategories');

      // Subcategory 2
      assert.isOk(res.body.data[1].attributes);
      assert.isOk(res.body.data[1].attributes['created-at']);
      assert.strictEqual(res.body.data[1].attributes.name, sampleData.categories.category2.name);
      assert.strictEqual(res.body.data[1].id, subcategory2Uuid);
      assert.strictEqual(res.body.data[1].type, 'subcategories');

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 2);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 5 subcategories as user 1 with category 1 limit=5 and page=4', async function() {
      const res = await chai.request(server)
        .get(`/subcategories?category_uuid=${category1Uuid}&limit=5&page=4`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 5);

      // Subcategory 17
      assert.isOk(res.body.data[0].attributes);
      assert.isOk(res.body.data[0].attributes['created-at']);
      assert.strictEqual(res.body.data[0].attributes.name, sampleData.categories.category17.name);
      assert.strictEqual(res.body.data[0].id, subcategory17Uuid);
      assert.strictEqual(res.body.data[0].type, 'subcategories');

      // Subcategory 9
      assert.isOk(res.body.data[1].attributes);
      assert.isOk(res.body.data[1].attributes['created-at']);
      assert.strictEqual(res.body.data[1].attributes.name, sampleData.categories.category9.name);
      assert.strictEqual(res.body.data[1].id, subcategory9Uuid);
      assert.strictEqual(res.body.data[1].type, 'subcategories');

      // Subcategory 13
      assert.isOk(res.body.data[2].attributes);
      assert.isOk(res.body.data[2].attributes['created-at']);
      assert.strictEqual(res.body.data[2].attributes.name, sampleData.categories.category13.name);
      assert.strictEqual(res.body.data[2].id, subcategory13Uuid);
      assert.strictEqual(res.body.data[2].type, 'subcategories');

      // Subcategory 6
      assert.isOk(res.body.data[3].attributes);
      assert.isOk(res.body.data[3].attributes['created-at']);
      assert.strictEqual(res.body.data[3].attributes.name, sampleData.categories.category6.name);
      assert.strictEqual(res.body.data[3].id, subcategory6Uuid);
      assert.strictEqual(res.body.data[3].type, 'subcategories');

      // Subcategory 25
      assert.isOk(res.body.data[4].attributes);
      assert.isOk(res.body.data[4].attributes['created-at']);
      assert.strictEqual(res.body.data[4].attributes.name, sampleData.categories.category25.name);
      assert.strictEqual(res.body.data[4].id, subcategory25Uuid);
      assert.strictEqual(res.body.data[4].type, 'subcategories');

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 6);
      assert.strictEqual(res.body.meta.total, 27);
    });

    it('should return 200 and 1 subcategory as user 1 with category 2', async function() {
      const res = await chai.request(server)
        .get(`/subcategories?category_uuid=${category2Uuid}`)
        .set('Content-Type', 'application/vnd.api+json')
        .set('Authorization', `Bearer ${user1Token}`);
      expect(res).to.have.status(200);
      assert.isOk(res.body.data);
      assert.strictEqual(res.body.data.length, 1);

      // Subcategory 28
      assert.isOk(res.body.data[0].attributes);
      assert.isOk(res.body.data[0].attributes['created-at']);
      assert.strictEqual(res.body.data[0].attributes.name, sampleData.categories.category28.name);
      assert.strictEqual(res.body.data[0].id, subcategory28Uuid);
      assert.strictEqual(res.body.data[0].type, 'subcategories');

      assert.isOk(res.body.meta);
      assert.strictEqual(res.body.meta.pages, 1);
      assert.strictEqual(res.body.meta.total, 1);
    });
  });
});
