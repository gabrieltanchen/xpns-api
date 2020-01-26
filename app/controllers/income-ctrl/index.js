const createIncome = require('./create-income');
const updateIncome = require('./update-income');

class IncomeCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createIncome({
    amountCents,
    auditApiCallUuid,
    description,
    householdMemberUuid,
  }) {
    return createIncome({
      amountCents,
      auditApiCallUuid,
      description,
      householdMemberUuid,
      incomeCtrl: this,
    });
  }

  async updateIncome({
    amountCents,
    auditApiCallUuid,
    description,
    householdMemberUuid,
    incomeUuid,
  }) {
    return updateIncome({
      amountCents,
      auditApiCallUuid,
      description,
      householdMemberUuid,
      incomeCtrl: this,
      incomeUuid,
    });
  }
}

module.exports = IncomeCtrl;
