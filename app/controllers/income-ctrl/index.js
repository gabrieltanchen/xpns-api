const createIncome = require('./create-income');
const deleteIncome = require('./delete-income');
const updateIncome = require('./update-income');

class IncomeCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createIncome({
    amountCents,
    auditApiCallUuid,
    date,
    description,
    householdMemberUuid,
  }) {
    return createIncome({
      amountCents,
      auditApiCallUuid,
      date,
      description,
      householdMemberUuid,
      incomeCtrl: this,
    });
  }

  async deleteIncome({
    auditApiCallUuid,
    incomeUuid,
  }) {
    return deleteIncome({
      auditApiCallUuid,
      incomeCtrl: this,
      incomeUuid,
    });
  }

  async updateIncome({
    amountCents,
    auditApiCallUuid,
    date,
    description,
    householdMemberUuid,
    incomeUuid,
  }) {
    return updateIncome({
      amountCents,
      auditApiCallUuid,
      date,
      description,
      householdMemberUuid,
      incomeCtrl: this,
      incomeUuid,
    });
  }
}

module.exports = IncomeCtrl;
