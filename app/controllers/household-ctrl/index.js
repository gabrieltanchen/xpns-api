const createMember = require('./create-member');

class HouseholdCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createMember({
    auditApiCallUuid,
    name,
  }) {
    return createMember({
      auditApiCallUuid,
      householdCtrl: this,
      name,
    });
  }
}

module.exports = HouseholdCtrl;
