const createFund = require('./create-fund');
const deleteFund = require('./delete-fund');
const updateFund = require('./update-fund');

class FundCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createFund({
    auditApiCallUuid,
    name,
  }) {
    return createFund({
      auditApiCallUuid,
      fundCtrl: this,
      name,
    });
  }

  async deleteFund({
    auditApiCallUuid,
    fundUuid,
  }) {
    return deleteFund({
      auditApiCallUuid,
      fundCtrl: this,
      fundUuid,
    });
  }

  async updateFund({
    auditApiCallUuid,
    fundUuid,
    name,
  }) {
    return updateFund({
      auditApiCallUuid,
      fundCtrl: this,
      fundUuid,
      name,
    });
  }
}

module.exports = FundCtrl;
