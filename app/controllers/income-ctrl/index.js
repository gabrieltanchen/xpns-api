const createIncome = require('./create-income');
const deleteIncome = require('./delete-income');
const updateIncome = require('./update-income');

class IncomeCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createIncome({
    amount,
    auditApiCallUuid,
    date,
    description,
    householdMemberUuid,
  }) {
    return createIncome({
      amount,
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
    amount,
    auditApiCallUuid,
    date,
    description,
    householdMemberUuid,
    incomeUuid,
  }) {
    return updateIncome({
      amount,
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
