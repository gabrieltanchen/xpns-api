const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../sample-data/');
const TestHelper = require('../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /vendors', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let vendor1Uuid;
  let vendor2Uuid;
  let vendor3Uuid;
  let vendor4Uuid;
  let vendor5Uuid;
  let vendor6Uuid;
  let vendor7Uuid;
  let vendor8Uuid;
  let vendor9Uuid;
  let vendor10Uuid;
  let vendor11Uuid;
  let vendor12Uuid;
  let vendor13Uuid;
  let vendor14Uuid;
  let vendor15Uuid;
  let vendor16Uuid;
  let vendor17Uuid;
  let vendor18Uuid;
  let vendor19Uuid;
  let vendor20Uuid;
  let vendor21Uuid;
  let vendor22Uuid;
  let vendor23Uuid;
  let vendor24Uuid;
  let vendor25Uuid;
  let vendor26Uuid;
  let vendor27Uuid;
  let vendor28Uuid;
  let user1Token;
  let user1Uuid;
  let user2Token;
  let user2Uuid;

  // User 1 vendors
  // 9 Cellar & Stone
  // 25 Children & Gake
  // 15 Circle & Stream
  // 27 Country & Clam
  // 8 Earth & Quiet
  // 14 Egg & Argyle
  // 12 Father & Grouse
  // 16 Gaffer & Pine
  // 1 Honey & Gin
  // 4 Jasper & Frost
  // 2 Joy & Shipwright
  // 11 Marlin & Vest
  // 21 Nation & Cold
  // 19 Salt & Wonder
  // 10 Sandstone & Coast
  // 5 Spigot & Knob
  // 26 Stream & Pulley
  // 6 Temper & Ghost
  // 24 Thread & River
  // 18 Tomb & Brother
  // 17 Water & East
  // 13 Weather & Lamp
  // 3 Wharf & Creature
  // 20 Wing & Bacon
  // 23 Woman & Glass
  // 7 Wren & Diamond
  // 22 Zebra & Death

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

  before('create vendor 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor1Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });
  });

  before('create vendor 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor2Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor2.name,
    });
  });

  before('create vendor 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor3Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor3.name,
    });
  });

  before('create vendor 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor4Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor4.name,
    });
  });

  before('create vendor 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor5Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor5.name,
    });
  });

  before('create vendor 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor6Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor6.name,
    });
  });

  before('create vendor 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor7Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor7.name,
    });
  });

  before('create vendor 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor8Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor8.name,
    });
  });

  before('create vendor 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor9Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor9.name,
    });
  });

  before('create vendor 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor10Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor10.name,
    });
  });

  before('create vendor 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor11Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor11.name,
    });
  });

  before('create vendor 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor12Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor12.name,
    });
  });

  before('create vendor 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor13Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor13.name,
    });
  });

  before('create vendor 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor14Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor14.name,
    });
  });

  before('create vendor 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor15Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor15.name,
    });
  });

  before('create vendor 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor16Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor16.name,
    });
  });

  before('create vendor 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor17Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor17.name,
    });
  });

  before('create vendor 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor18Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor18.name,
    });
  });

  before('create vendor 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor19Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor19.name,
    });
  });

  before('create vendor 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor20Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor20.name,
    });
  });

  before('create vendor 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor21Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor21.name,
    });
  });

  before('create vendor 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor22Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor22.name,
    });
  });

  before('create vendor 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor23Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor23.name,
    });
  });

  before('create vendor 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor24Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor24.name,
    });
  });

  before('create vendor 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor25Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor25.name,
    });
  });

  before('create vendor 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor26Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor26.name,
    });
  });

  before('create vendor 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendor27Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor27.name,
    });
  });

  before('create vendor 28', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    vendor28Uuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor28.name,
    });
  });

  after('truncate tables', async function() {
    this.timeout(10000);
    await testHelper.truncateTables();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .get('/vendors')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 200 and 25 vendors as user 1 with no limit or page specified', async function() {
    const res = await chai.request(server)
      .get('/vendors')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 25);

    // Vendor 9
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.vendors.vendor9.name);
    assert.strictEqual(res.body.data[0].id, vendor9Uuid);
    assert.strictEqual(res.body.data[0].type, 'vendors');

    // Vendor 25
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.vendors.vendor25.name);
    assert.strictEqual(res.body.data[1].id, vendor25Uuid);
    assert.strictEqual(res.body.data[1].type, 'vendors');

    // Vendor 15
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.vendors.vendor15.name);
    assert.strictEqual(res.body.data[2].id, vendor15Uuid);
    assert.strictEqual(res.body.data[2].type, 'vendors');

    // Vendor 27
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.vendors.vendor27.name);
    assert.strictEqual(res.body.data[3].id, vendor27Uuid);
    assert.strictEqual(res.body.data[3].type, 'vendors');

    // Vendor 8
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.vendors.vendor8.name);
    assert.strictEqual(res.body.data[4].id, vendor8Uuid);
    assert.strictEqual(res.body.data[4].type, 'vendors');

    // Vendor 14
    assert.isOk(res.body.data[5].attributes);
    assert.isOk(res.body.data[5].attributes['created-at']);
    assert.strictEqual(res.body.data[5].attributes.name, sampleData.vendors.vendor14.name);
    assert.strictEqual(res.body.data[5].id, vendor14Uuid);
    assert.strictEqual(res.body.data[5].type, 'vendors');

    // Vendor 12
    assert.isOk(res.body.data[6].attributes);
    assert.isOk(res.body.data[6].attributes['created-at']);
    assert.strictEqual(res.body.data[6].attributes.name, sampleData.vendors.vendor12.name);
    assert.strictEqual(res.body.data[6].id, vendor12Uuid);
    assert.strictEqual(res.body.data[6].type, 'vendors');

    // Vendor 16
    assert.isOk(res.body.data[7].attributes);
    assert.isOk(res.body.data[7].attributes['created-at']);
    assert.strictEqual(res.body.data[7].attributes.name, sampleData.vendors.vendor16.name);
    assert.strictEqual(res.body.data[7].id, vendor16Uuid);
    assert.strictEqual(res.body.data[7].type, 'vendors');

    // Vendor 1
    assert.isOk(res.body.data[8].attributes);
    assert.isOk(res.body.data[8].attributes['created-at']);
    assert.strictEqual(res.body.data[8].attributes.name, sampleData.vendors.vendor1.name);
    assert.strictEqual(res.body.data[8].id, vendor1Uuid);
    assert.strictEqual(res.body.data[8].type, 'vendors');

    // Vendor 4
    assert.isOk(res.body.data[9].attributes);
    assert.isOk(res.body.data[9].attributes['created-at']);
    assert.strictEqual(res.body.data[9].attributes.name, sampleData.vendors.vendor4.name);
    assert.strictEqual(res.body.data[9].id, vendor4Uuid);
    assert.strictEqual(res.body.data[9].type, 'vendors');

    // Vendor 2
    assert.isOk(res.body.data[10].attributes);
    assert.isOk(res.body.data[10].attributes['created-at']);
    assert.strictEqual(res.body.data[10].attributes.name, sampleData.vendors.vendor2.name);
    assert.strictEqual(res.body.data[10].id, vendor2Uuid);
    assert.strictEqual(res.body.data[10].type, 'vendors');

    // Vendor 11
    assert.isOk(res.body.data[11].attributes);
    assert.isOk(res.body.data[11].attributes['created-at']);
    assert.strictEqual(res.body.data[11].attributes.name, sampleData.vendors.vendor11.name);
    assert.strictEqual(res.body.data[11].id, vendor11Uuid);
    assert.strictEqual(res.body.data[11].type, 'vendors');

    // Vendor 21
    assert.isOk(res.body.data[12].attributes);
    assert.isOk(res.body.data[12].attributes['created-at']);
    assert.strictEqual(res.body.data[12].attributes.name, sampleData.vendors.vendor21.name);
    assert.strictEqual(res.body.data[12].id, vendor21Uuid);
    assert.strictEqual(res.body.data[12].type, 'vendors');

    // Vendor 19
    assert.isOk(res.body.data[13].attributes);
    assert.isOk(res.body.data[13].attributes['created-at']);
    assert.strictEqual(res.body.data[13].attributes.name, sampleData.vendors.vendor19.name);
    assert.strictEqual(res.body.data[13].id, vendor19Uuid);
    assert.strictEqual(res.body.data[13].type, 'vendors');

    // Vendor 10
    assert.isOk(res.body.data[14].attributes);
    assert.isOk(res.body.data[14].attributes['created-at']);
    assert.strictEqual(res.body.data[14].attributes.name, sampleData.vendors.vendor10.name);
    assert.strictEqual(res.body.data[14].id, vendor10Uuid);
    assert.strictEqual(res.body.data[14].type, 'vendors');

    // Vendor 5
    assert.isOk(res.body.data[15].attributes);
    assert.isOk(res.body.data[15].attributes['created-at']);
    assert.strictEqual(res.body.data[15].attributes.name, sampleData.vendors.vendor5.name);
    assert.strictEqual(res.body.data[15].id, vendor5Uuid);
    assert.strictEqual(res.body.data[15].type, 'vendors');

    // Vendor 26
    assert.isOk(res.body.data[16].attributes);
    assert.isOk(res.body.data[16].attributes['created-at']);
    assert.strictEqual(res.body.data[16].attributes.name, sampleData.vendors.vendor26.name);
    assert.strictEqual(res.body.data[16].id, vendor26Uuid);
    assert.strictEqual(res.body.data[16].type, 'vendors');

    // Vendor 6
    assert.isOk(res.body.data[17].attributes);
    assert.isOk(res.body.data[17].attributes['created-at']);
    assert.strictEqual(res.body.data[17].attributes.name, sampleData.vendors.vendor6.name);
    assert.strictEqual(res.body.data[17].id, vendor6Uuid);
    assert.strictEqual(res.body.data[17].type, 'vendors');

    // Vendor 24
    assert.isOk(res.body.data[18].attributes);
    assert.isOk(res.body.data[18].attributes['created-at']);
    assert.strictEqual(res.body.data[18].attributes.name, sampleData.vendors.vendor24.name);
    assert.strictEqual(res.body.data[18].id, vendor24Uuid);
    assert.strictEqual(res.body.data[18].type, 'vendors');

    // Vendor 18
    assert.isOk(res.body.data[19].attributes);
    assert.isOk(res.body.data[19].attributes['created-at']);
    assert.strictEqual(res.body.data[19].attributes.name, sampleData.vendors.vendor18.name);
    assert.strictEqual(res.body.data[19].id, vendor18Uuid);
    assert.strictEqual(res.body.data[19].type, 'vendors');

    // Vendor 17
    assert.isOk(res.body.data[20].attributes);
    assert.isOk(res.body.data[20].attributes['created-at']);
    assert.strictEqual(res.body.data[20].attributes.name, sampleData.vendors.vendor17.name);
    assert.strictEqual(res.body.data[20].id, vendor17Uuid);
    assert.strictEqual(res.body.data[20].type, 'vendors');

    // Vendor 13
    assert.isOk(res.body.data[21].attributes);
    assert.isOk(res.body.data[21].attributes['created-at']);
    assert.strictEqual(res.body.data[21].attributes.name, sampleData.vendors.vendor13.name);
    assert.strictEqual(res.body.data[21].id, vendor13Uuid);
    assert.strictEqual(res.body.data[21].type, 'vendors');

    // Vendor 3
    assert.isOk(res.body.data[22].attributes);
    assert.isOk(res.body.data[22].attributes['created-at']);
    assert.strictEqual(res.body.data[22].attributes.name, sampleData.vendors.vendor3.name);
    assert.strictEqual(res.body.data[22].id, vendor3Uuid);
    assert.strictEqual(res.body.data[22].type, 'vendors');

    // Vendor 20
    assert.isOk(res.body.data[23].attributes);
    assert.isOk(res.body.data[23].attributes['created-at']);
    assert.strictEqual(res.body.data[23].attributes.name, sampleData.vendors.vendor20.name);
    assert.strictEqual(res.body.data[23].id, vendor20Uuid);
    assert.strictEqual(res.body.data[23].type, 'vendors');

    // Vendor 23
    assert.isOk(res.body.data[24].attributes);
    assert.isOk(res.body.data[24].attributes['created-at']);
    assert.strictEqual(res.body.data[24].attributes.name, sampleData.vendors.vendor23.name);
    assert.strictEqual(res.body.data[24].id, vendor23Uuid);
    assert.strictEqual(res.body.data[24].type, 'vendors');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 2 vendors as user 1 with no limit and page=2', async function() {
    const res = await chai.request(server)
      .get('/vendors?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 2);

    // Vendor 7
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.vendors.vendor7.name);
    assert.strictEqual(res.body.data[0].id, vendor7Uuid);
    assert.strictEqual(res.body.data[0].type, 'vendors');

    // Vendor 22
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.vendors.vendor22.name);
    assert.strictEqual(res.body.data[1].id, vendor22Uuid);
    assert.strictEqual(res.body.data[1].type, 'vendors');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 5 vendors as user 1 with limit=5 and page=4', async function() {
    const res = await chai.request(server)
      .get('/vendors?limit=5&page=4')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 5);

    // Vendor 5
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.vendors.vendor5.name);
    assert.strictEqual(res.body.data[0].id, vendor5Uuid);
    assert.strictEqual(res.body.data[0].type, 'vendors');

    // Vendor 26
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.vendors.vendor26.name);
    assert.strictEqual(res.body.data[1].id, vendor26Uuid);
    assert.strictEqual(res.body.data[1].type, 'vendors');

    // Vendor 6
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.vendors.vendor6.name);
    assert.strictEqual(res.body.data[2].id, vendor6Uuid);
    assert.strictEqual(res.body.data[2].type, 'vendors');

    // Vendor 24
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.vendors.vendor24.name);
    assert.strictEqual(res.body.data[3].id, vendor24Uuid);
    assert.strictEqual(res.body.data[3].type, 'vendors');

    // Vendor 18
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.vendors.vendor18.name);
    assert.strictEqual(res.body.data[4].id, vendor18Uuid);
    assert.strictEqual(res.body.data[4].type, 'vendors');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 6);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 1 vendor as user 2', async function() {
    const res = await chai.request(server)
      .get('/vendors')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 1);

    // Vendor 28
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.vendors.vendor28.name);
    assert.strictEqual(res.body.data[0].id, vendor28Uuid);
    assert.strictEqual(res.body.data[0].type, 'vendors');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });

  it('should return 200 and 0 vendors as user 2 with page=2', async function() {
    const res = await chai.request(server)
      .get('/vendors?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 0);
    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });
});
