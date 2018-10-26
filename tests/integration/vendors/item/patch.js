const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');

const sampleData = require('../../../sample-data/');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - PATCH /vendors/:uuid', function() {
  let controllers;
  let models;
  let server;
  const testHelper = new TestHelper();

  let updateVendorSpy;

  let user1Token;
  let user1Uuid;
  let user2Token;
  let user2Uuid;
  let vendorUuid;

  before('get server', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
    server = await testHelper.getServer();
  });

  before('create sinon spies', function() {
    updateVendorSpy = sinon.spy(controllers.VendorCtrl, 'updateVendor');
  });

  after('restore sinon spies', function() {
    updateVendorSpy.restore();
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

  beforeEach('create vendor', async function() {
    const apiCall = await models.Audit.ApiCall.create({
      user_uuid: user1Uuid,
    });
    vendorUuid = await controllers.VendorCtrl.createVendor({
      auditApiCallUuid: apiCall.get('uuid'),
      name: sampleData.vendors.vendor1.name,
    });
  });

  afterEach('reset history for sinon spies', function() {
    updateVendorSpy.resetHistory();
  });

  afterEach('truncate tables', async function() {
    await testHelper.truncateTables();
  });

  it('should return 401 with no auth token', async function() {
    const res = await chai.request(server)
      .patch(`/vendors/${vendorUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .send({
        'data': {
          'attributes': {
            'name': sampleData.vendors.vendor2.name,
          },
          'id': vendorUuid,
          'type': 'vendors',
        },
      });
    expect(res).to.have.status(401);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Unauthorized',
      }],
    });
    assert.strictEqual(updateVendorSpy.callCount, 0);
  });

  it('should return 404 with the wrong auth token', async function() {
    const res = await chai.request(server)
      .patch(`/vendors/${vendorUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.vendors.vendor2.name,
          },
          'id': vendorUuid,
          'type': 'vendors',
        },
      });
    expect(res).to.have.status(404);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Not found',
      }],
    });

    assert.strictEqual(updateVendorSpy.callCount, 1);
    const updateVendorParams = updateVendorSpy.getCall(0).args[0];
    assert.isOk(updateVendorParams.auditApiCallUuid);
    assert.strictEqual(updateVendorParams.name, sampleData.vendors.vendor2.name);
    assert.strictEqual(updateVendorParams.vendorUuid, vendorUuid);
  });

  it('should return 422 with no name', async function() {
    const res = await chai.request(server)
      .patch(`/vendors/${vendorUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'name': '',
          },
          'id': vendorUuid,
          'type': 'vendors',
        },
      });
    expect(res).to.have.status(422);
    assert.deepEqual(res.body, {
      errors: [{
        detail: 'Vendor name is required.',
        source: {
          pointer: '/data/attributes/name',
        },
      }],
    });
    assert.strictEqual(updateVendorSpy.callCount, 0);
  });

  it('should return 200 with the correct auth token', async function() {
    const res = await chai.request(server)
      .patch(`/vendors/${vendorUuid}`)
      .set('Content-Type', 'application/vnd.api+json')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        'data': {
          'attributes': {
            'name': sampleData.vendors.vendor2.name,
          },
          'id': vendorUuid,
          'type': 'vendors',
        },
      });
    expect(res).to.have.status(200);
    assert.isOk(res.body.data);
    assert.isOk(res.body.data.attributes);
    assert.isOk(res.body.data.attributes['created-at']);
    assert.strictEqual(res.body.data.attributes.name, sampleData.vendors.vendor2.name);
    assert.strictEqual(res.body.data.id, vendorUuid);
    assert.strictEqual(res.body.data.type, 'vendors');

    // Validate VendorCtrl.updateVendor call.
    assert.strictEqual(updateVendorSpy.callCount, 1);
    const updateVendorParams = updateVendorSpy.getCall(0).args[0];
    assert.isOk(updateVendorParams.auditApiCallUuid);
    assert.strictEqual(updateVendorParams.name, sampleData.vendors.vendor2.name);
    assert.strictEqual(updateVendorParams.vendorUuid, vendorUuid);

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
        uuid: updateVendorParams.auditApiCallUuid,
      },
    });
    assert.isOk(apiCall);
    assert.strictEqual(apiCall.get('http_method'), 'PATCH');
    assert.isOk(apiCall.get('ip_address'));
    assert.strictEqual(apiCall.get('route'), `/vendors/${vendorUuid}`);
    assert.isOk(apiCall.get('user_agent'));
    assert.strictEqual(apiCall.get('user_uuid'), user1Uuid);
  });
});
