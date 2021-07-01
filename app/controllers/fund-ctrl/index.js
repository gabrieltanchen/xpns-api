const createDeposit = require('./create-deposit');
const createFund = require('./create-fund');
const deleteFund = require('./delete-fund');
const updateFund = require('./update-fund');

class FundCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createDeposit(params) {
    return createDeposit({
      ...params,
      fundCtrl: this,
    });
  }

  async createFund(params) {
    return createFund({
      ...params,
      fundCtrl: this,
    });
  }

  async deleteFund(params) {
    return deleteFund({
      ...params,
      fundCtrl: this,
    });
  }

  async updateFund(params) {
    return updateFund({
      ...params,
      fundCtrl: this,
    });
  }
}

module.exports = FundCtrl;
