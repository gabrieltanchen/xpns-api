require('../../config/');
const App = require('../../app/');
const nconf = require('nconf');

class TestHelper {
  async cleanup() {
    /* istanbul ignore if */
    if (!this.app || !this.server) {
      throw new Error('App not yet initialized.');
    }
    await this.server.close();
  }

  constructor() {
    this.app = null;
    this.server = null;
  }

  async getApp() {
    if (!this.app) {
      await this.setup();
    }
    return this.app;
  }

  async getServer() {
    if (!this.server) {
      await this.setup();
    }
    return this.server;
  }

  async setup() {
    this.app = App.createApp();
    this.server = this.app.listen(nconf.get('NODE_PORT'));
  }
}

module.exports = TestHelper;
