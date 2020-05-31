const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidv4 } = require('uuid');

const TestHelper = require('../../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - PATCH /budget-reports/:uuid', function() {
  let server;
  const testHelper = new TestHelper();

  before('get server', async function() {
    this.timeout(30000);
    server = await testHelper.getServer();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  it('should return 501', async function() {
    const res = await chai.request(server)
      .patch(`/budget-reports/${uuidv4()}`)
      .set('Content-Type', 'application/vnd.api+json');
    expect(res).to.have.status(501);
    assert.deepEqual(res.body, {});
  });
});
