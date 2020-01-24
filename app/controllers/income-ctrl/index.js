const createIncome = require('./create-income');

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
}

module.exports = IncomeCtrl;
