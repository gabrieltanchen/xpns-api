const createFund = require('./create-fund');

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
}

module.exports = FundCtrl;
