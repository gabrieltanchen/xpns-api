const createMember = require('./create-member');
const deleteMember = require('./delete-member');
const updateMember = require('./update-member');

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

  async deleteMember({
    auditApiCallUuid,
    householdMemberUuid,
  }) {
    return deleteMember({
      auditApiCallUuid,
      householdCtrl: this,
      householdMemberUuid,
    });
  }

  async updateMember({
    auditApiCallUuid,
    householdMemberUuid,
    name,
  }) {
    return updateMember({
      auditApiCallUuid,
      householdCtrl: this,
      householdMemberUuid,
      name,
    });
  }
}

module.exports = HouseholdCtrl;
