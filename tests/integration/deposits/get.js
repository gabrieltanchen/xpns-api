const chai = require('chai');
const chaiHttp = require('chai-http');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

const sampleData = require('../../sample-data');
const TestHelper = require('../../test-helper');

const assert = chai.assert;
const expect = chai.expect;

chai.use(chaiHttp);

describe('Integration - GET /deposits', function() {
  let server;
  const testHelper = new TestHelper();

  before('get server', async function() {
    this.timeout(30000);
    server = await testHelper.getServer();
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });

  it('should return 401 with no auth token');

  it('should return 403 with no fund id');

  describe('when called with the fund_id query param', function() {
    it('should return 404 when the fund does not exist');

    it('should return 404 when the fund belongs to a different household');

    it('should return 200 and 25 deposits as user 1 with fund 1 and no limit or page specified');

    it('should return 200 and 2 deposits as user 1 with fund 1 and no limit and page=2');

    it('should return 200 and 5 deposits as user 1 with fund 1 limit=5 and page=4');

    it('should return 200 and 1 deposit as user 1 with fund 2');
  });
});
