require('../../config/');
const App = require('../../app/');

class TestHelper {
  async cleanup() {
    /* istanbul ignore if */
    if (!this.app || !this.server) {
      throw new Error('App not yet initialized.');
    }
    const models = this.app.get('models');
    await models.sequelize.connectionManager.close();
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
    this.server = await App.startServer(this.app);
  }

  async truncateTables() {
    const models = this.app.get('models');
    await models.Household.destroy({
      cascade: true,
      force: true,
      truncate: true,
    });
  }
}

module.exports = TestHelper;
