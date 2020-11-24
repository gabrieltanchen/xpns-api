const chai = require('chai');
const chaiHttp = require('chai-http');

const sampleData = require('../../sample-data/');
const TestHelper = require('../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /household-members', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let member1Uuid;
  let member2Uuid;
  let member3Uuid;
  let member4Uuid;
  let member5Uuid;
  let member6Uuid;
  let member7Uuid;
  let member8Uuid;
  let member9Uuid;
  let member10Uuid;
  let member11Uuid;
  let member12Uuid;
  let member13Uuid;
  let member14Uuid;
  let member15Uuid;
  let member16Uuid;
  let member17Uuid;
  let member18Uuid;
  let member19Uuid;
  let member20Uuid;
  let member21Uuid;
  let member22Uuid;
  let member23Uuid;
  let member24Uuid;
  let member25Uuid;
  let member26Uuid;
  let member27Uuid;
  let member28Uuid;
  let user1Token;
  let user1Uuid;
  let user2Token;
  let user2Uuid;

  // User 1 members
  // 18 Carmen
  // 19 Carrie
  // 10 Chris
  // 4 Cody
  // 22 Darrell
  // 6 Devon
  // 14 Drew
  // 11 Duane
  // 3 Freddie
  // 24 Hope
  // 12 Jacob
  // 20 Javier
  // 26 Jill
  // 15 Joann
  // 9 Kerry
  // 2 Lacey
  // 1 Lindsay
  // 25 Lora
  // 21 Louise
  // 16 Luis
  // 23 Lynn
  // 17 Matthew
  // 8 Ollie
  // 13 Patricia
  // 7 Robbie
  // 27 Rodney
  // 5 Sandy

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

  before('create household member 1', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member1Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user1.firstName,
    });
  });

  before('create household member 2', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member2Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user2.firstName,
    });
  });

  before('create household member 3', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member3Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user3.firstName,
    });
  });

  before('create household member 4', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member4Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user4.firstName,
    });
  });

  before('create household member 5', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member5Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user5.firstName,
    });
  });

  before('create household member 6', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member6Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user6.firstName,
    });
  });

  before('create household member 7', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member7Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user7.firstName,
    });
  });

  before('create household member 8', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member8Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user8.firstName,
    });
  });

  before('create household member 9', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member9Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user9.firstName,
    });
  });

  before('create household member 10', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member10Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user10.firstName,
    });
  });

  before('create household member 11', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member11Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user11.firstName,
    });
  });

  before('create household member 12', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member12Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user12.firstName,
    });
  });

  before('create household member 13', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member13Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user13.firstName,
    });
  });

  before('create household member 14', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member14Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user14.firstName,
    });
  });

  before('create household member 15', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member15Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user15.firstName,
    });
  });

  before('create household member 16', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member16Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user16.firstName,
    });
  });

  before('create household member 17', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member17Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user17.firstName,
    });
  });

  before('create household member 18', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member18Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user18.firstName,
    });
  });

  before('create household member 19', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member19Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user19.firstName,
    });
  });

  before('create household member 20', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member20Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user20.firstName,
    });
  });

  before('create household member 21', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member21Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user21.firstName,
    });
  });

  before('create household member 22', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member22Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user22.firstName,
    });
  });

  before('create household member 23', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member23Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user23.firstName,
    });
  });

  before('create household member 24', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member24Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user24.firstName,
    });
  });

  before('create household member 25', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member25Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user25.firstName,
    });
  });

  before('create household member 26', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member26Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user26.firstName,
    });
  });

  before('create household member 27', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    member27Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user27.firstName,
    });
  });

  before('create household member 28', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user2Uuid,
    });
    member28Uuid = await controllers.HouseholdCtrl.createMember({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.users.user28.firstName,
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
      .get('/household-members')
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
  });

  it('should return 200 and 25 members as user 1 with no limit or page specified', async function() {
    const res = await chai.request(server)
      .get('/household-members')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 25);

    // Member 18
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.users.user18.firstName);
    assert.strictEqual(res.body.data[0].id, member18Uuid);
    assert.strictEqual(res.body.data[0].type, 'household-members');

    // Member 19
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.users.user19.firstName);
    assert.strictEqual(res.body.data[1].id, member19Uuid);
    assert.strictEqual(res.body.data[1].type, 'household-members');

    // Member 10
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.users.user10.firstName);
    assert.strictEqual(res.body.data[2].id, member10Uuid);
    assert.strictEqual(res.body.data[2].type, 'household-members');

    // Member 4
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.users.user4.firstName);
    assert.strictEqual(res.body.data[3].id, member4Uuid);
    assert.strictEqual(res.body.data[3].type, 'household-members');

    // Member 22
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.users.user22.firstName);
    assert.strictEqual(res.body.data[4].id, member22Uuid);
    assert.strictEqual(res.body.data[4].type, 'household-members');

    // Member 6
    assert.isOk(res.body.data[5].attributes);
    assert.isOk(res.body.data[5].attributes['created-at']);
    assert.strictEqual(res.body.data[5].attributes.name, sampleData.users.user6.firstName);
    assert.strictEqual(res.body.data[5].id, member6Uuid);
    assert.strictEqual(res.body.data[5].type, 'household-members');

    // Member 14
    assert.isOk(res.body.data[6].attributes);
    assert.isOk(res.body.data[6].attributes['created-at']);
    assert.strictEqual(res.body.data[6].attributes.name, sampleData.users.user14.firstName);
    assert.strictEqual(res.body.data[6].id, member14Uuid);
    assert.strictEqual(res.body.data[6].type, 'household-members');

    // Member 11
    assert.isOk(res.body.data[7].attributes);
    assert.isOk(res.body.data[7].attributes['created-at']);
    assert.strictEqual(res.body.data[7].attributes.name, sampleData.users.user11.firstName);
    assert.strictEqual(res.body.data[7].id, member11Uuid);
    assert.strictEqual(res.body.data[7].type, 'household-members');

    // Member 3
    assert.isOk(res.body.data[8].attributes);
    assert.isOk(res.body.data[8].attributes['created-at']);
    assert.strictEqual(res.body.data[8].attributes.name, sampleData.users.user3.firstName);
    assert.strictEqual(res.body.data[8].id, member3Uuid);
    assert.strictEqual(res.body.data[8].type, 'household-members');

    // Member 24
    assert.isOk(res.body.data[9].attributes);
    assert.isOk(res.body.data[9].attributes['created-at']);
    assert.strictEqual(res.body.data[9].attributes.name, sampleData.users.user24.firstName);
    assert.strictEqual(res.body.data[9].id, member24Uuid);
    assert.strictEqual(res.body.data[9].type, 'household-members');

    // Member 12
    assert.isOk(res.body.data[10].attributes);
    assert.isOk(res.body.data[10].attributes['created-at']);
    assert.strictEqual(res.body.data[10].attributes.name, sampleData.users.user12.firstName);
    assert.strictEqual(res.body.data[10].id, member12Uuid);
    assert.strictEqual(res.body.data[10].type, 'household-members');

    // Member 20
    assert.isOk(res.body.data[11].attributes);
    assert.isOk(res.body.data[11].attributes['created-at']);
    assert.strictEqual(res.body.data[11].attributes.name, sampleData.users.user20.firstName);
    assert.strictEqual(res.body.data[11].id, member20Uuid);
    assert.strictEqual(res.body.data[11].type, 'household-members');

    // Member 26
    assert.isOk(res.body.data[12].attributes);
    assert.isOk(res.body.data[12].attributes['created-at']);
    assert.strictEqual(res.body.data[12].attributes.name, sampleData.users.user26.firstName);
    assert.strictEqual(res.body.data[12].id, member26Uuid);
    assert.strictEqual(res.body.data[12].type, 'household-members');

    // Member 15
    assert.isOk(res.body.data[13].attributes);
    assert.isOk(res.body.data[13].attributes['created-at']);
    assert.strictEqual(res.body.data[13].attributes.name, sampleData.users.user15.firstName);
    assert.strictEqual(res.body.data[13].id, member15Uuid);
    assert.strictEqual(res.body.data[13].type, 'household-members');

    // Member 9
    assert.isOk(res.body.data[14].attributes);
    assert.isOk(res.body.data[14].attributes['created-at']);
    assert.strictEqual(res.body.data[14].attributes.name, sampleData.users.user9.firstName);
    assert.strictEqual(res.body.data[14].id, member9Uuid);
    assert.strictEqual(res.body.data[14].type, 'household-members');

    // Member 2
    assert.isOk(res.body.data[15].attributes);
    assert.isOk(res.body.data[15].attributes['created-at']);
    assert.strictEqual(res.body.data[15].attributes.name, sampleData.users.user2.firstName);
    assert.strictEqual(res.body.data[15].id, member2Uuid);
    assert.strictEqual(res.body.data[15].type, 'household-members');

    // Member 1
    assert.isOk(res.body.data[16].attributes);
    assert.isOk(res.body.data[16].attributes['created-at']);
    assert.strictEqual(res.body.data[16].attributes.name, sampleData.users.user1.firstName);
    assert.strictEqual(res.body.data[16].id, member1Uuid);
    assert.strictEqual(res.body.data[16].type, 'household-members');

    // Member 25
    assert.isOk(res.body.data[17].attributes);
    assert.isOk(res.body.data[17].attributes['created-at']);
    assert.strictEqual(res.body.data[17].attributes.name, sampleData.users.user25.firstName);
    assert.strictEqual(res.body.data[17].id, member25Uuid);
    assert.strictEqual(res.body.data[17].type, 'household-members');

    // Member 21
    assert.isOk(res.body.data[18].attributes);
    assert.isOk(res.body.data[18].attributes['created-at']);
    assert.strictEqual(res.body.data[18].attributes.name, sampleData.users.user21.firstName);
    assert.strictEqual(res.body.data[18].id, member21Uuid);
    assert.strictEqual(res.body.data[18].type, 'household-members');

    // Member 16
    assert.isOk(res.body.data[19].attributes);
    assert.isOk(res.body.data[19].attributes['created-at']);
    assert.strictEqual(res.body.data[19].attributes.name, sampleData.users.user16.firstName);
    assert.strictEqual(res.body.data[19].id, member16Uuid);
    assert.strictEqual(res.body.data[19].type, 'household-members');

    // Member 23
    assert.isOk(res.body.data[20].attributes);
    assert.isOk(res.body.data[20].attributes['created-at']);
    assert.strictEqual(res.body.data[20].attributes.name, sampleData.users.user23.firstName);
    assert.strictEqual(res.body.data[20].id, member23Uuid);
    assert.strictEqual(res.body.data[20].type, 'household-members');

    // Member 17
    assert.isOk(res.body.data[21].attributes);
    assert.isOk(res.body.data[21].attributes['created-at']);
    assert.strictEqual(res.body.data[21].attributes.name, sampleData.users.user17.firstName);
    assert.strictEqual(res.body.data[21].id, member17Uuid);
    assert.strictEqual(res.body.data[21].type, 'household-members');

    // Member 8
    assert.isOk(res.body.data[22].attributes);
    assert.isOk(res.body.data[22].attributes['created-at']);
    assert.strictEqual(res.body.data[22].attributes.name, sampleData.users.user8.firstName);
    assert.strictEqual(res.body.data[22].id, member8Uuid);
    assert.strictEqual(res.body.data[22].type, 'household-members');

    // Member 13
    assert.isOk(res.body.data[23].attributes);
    assert.isOk(res.body.data[23].attributes['created-at']);
    assert.strictEqual(res.body.data[23].attributes.name, sampleData.users.user13.firstName);
    assert.strictEqual(res.body.data[23].id, member13Uuid);
    assert.strictEqual(res.body.data[23].type, 'household-members');

    // Member 7
    assert.isOk(res.body.data[24].attributes);
    assert.isOk(res.body.data[24].attributes['created-at']);
    assert.strictEqual(res.body.data[24].attributes.name, sampleData.users.user7.firstName);
    assert.strictEqual(res.body.data[24].id, member7Uuid);
    assert.strictEqual(res.body.data[24].type, 'household-members');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 2 members as user 1 with no limit and page=2', async function() {
    const res = await chai.request(server)
      .get('/household-members?page=2')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 2);

    // Member 27
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.users.user27.firstName);
    assert.strictEqual(res.body.data[0].id, member27Uuid);
    assert.strictEqual(res.body.data[0].type, 'household-members');

    // Member 5
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.users.user5.firstName);
    assert.strictEqual(res.body.data[1].id, member5Uuid);
    assert.strictEqual(res.body.data[1].type, 'household-members');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 2);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 5 members as user 1 with limit=5 and page=4', async function() {
    const res = await chai.request(server)
      .get('/household-members?limit=5&page=4')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 5);

    // Member 2
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.users.user2.firstName);
    assert.strictEqual(res.body.data[0].id, member2Uuid);
    assert.strictEqual(res.body.data[0].type, 'household-members');

    // Member 1
    assert.isOk(res.body.data[1].attributes);
    assert.isOk(res.body.data[1].attributes['created-at']);
    assert.strictEqual(res.body.data[1].attributes.name, sampleData.users.user1.firstName);
    assert.strictEqual(res.body.data[1].id, member1Uuid);
    assert.strictEqual(res.body.data[1].type, 'household-members');

    // Member 25
    assert.isOk(res.body.data[2].attributes);
    assert.isOk(res.body.data[2].attributes['created-at']);
    assert.strictEqual(res.body.data[2].attributes.name, sampleData.users.user25.firstName);
    assert.strictEqual(res.body.data[2].id, member25Uuid);
    assert.strictEqual(res.body.data[2].type, 'household-members');

    // Member 21
    assert.isOk(res.body.data[3].attributes);
    assert.isOk(res.body.data[3].attributes['created-at']);
    assert.strictEqual(res.body.data[3].attributes.name, sampleData.users.user21.firstName);
    assert.strictEqual(res.body.data[3].id, member21Uuid);
    assert.strictEqual(res.body.data[3].type, 'household-members');

    // Member 16
    assert.isOk(res.body.data[4].attributes);
    assert.isOk(res.body.data[4].attributes['created-at']);
    assert.strictEqual(res.body.data[4].attributes.name, sampleData.users.user16.firstName);
    assert.strictEqual(res.body.data[4].id, member16Uuid);
    assert.strictEqual(res.body.data[4].type, 'household-members');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 6);
    assert.strictEqual(res.body.meta.total, 27);
  });

  it('should return 200 and 1 member as user 2', async function() {
    const res = await chai.request(server)
      .get('/household-members')
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`);
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.strictEqual(res.body.data.length, 1);

    // Member 28
    assert.isOk(res.body.data[0].attributes);
    assert.isOk(res.body.data[0].attributes['created-at']);
    assert.strictEqual(res.body.data[0].attributes.name, sampleData.users.user28.firstName);
    assert.strictEqual(res.body.data[0].id, member28Uuid);
    assert.strictEqual(res.body.data[0].type, 'household-members');

    assert.isOk(res.body.meta);
    assert.strictEqual(res.body.meta.pages, 1);
    assert.strictEqual(res.body.meta.total, 1);
  });

  it('should return 200 and 0 members as user 2 with page=2', async function() {
    const res = await chai.request(server)
      .get('/household-members?page=2')
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
