const createExpense = require('./create-expense');

class ExpenseCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createExpense({
    amountCents,
    auditApiCallUuid,
    categoryUuid,
    date,
    description,
    reimbursedCents,
    vendorUuid,
  }) {
    return createExpense({
      amountCents,
      auditApiCallUuid,
      categoryUuid,
      date,
      description,
      expenseCtrl: this,
      reimbursedCents,
      vendorUuid,
    });
  }
}

module.exports = ExpenseCtrl;
