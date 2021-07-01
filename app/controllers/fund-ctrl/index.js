const createFund = require('./create-fund');
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
