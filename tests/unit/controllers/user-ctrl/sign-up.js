const chai = require('chai');
const TestHelper = require('../../../test-helper/');

const assert = chai.assert;

describe('Unit:Controllers - UserCtrl.signUp', function() {
  let controllers;
  let models;
  const testHelper = new TestHelper();

  before('get app', async function() {
    this.timeout(30000);
    const app = await testHelper.getApp();
    controllers = app.get('controllers');
    models = app.get('models');
  });

  after('cleanup', async function() {
    await testHelper.cleanup();
  });
});
