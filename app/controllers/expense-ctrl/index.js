const createExpense = require('./create-expense');
const deleteExpense = require('./delete-expense');
const updateExpense = require('./update-expense');

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

  async deleteExpense({
    auditApiCallUuid,
    expenseUuid,
  }) {
    return deleteExpense({
      auditApiCallUuid,
      expenseCtrl: this,
      expenseUuid,
    });
  }

  async updateExpense({
    amountCents,
    auditApiCallUuid,
    categoryUuid,
    date,
    description,
    expenseUuid,
    reimbursedCents,
    vendorUuid,
  }) {
    return updateExpense({
      amountCents,
      auditApiCallUuid,
      categoryUuid,
      date,
      description,
      expenseCtrl: this,
      expenseUuid,
      reimbursedCents,
      vendorUuid,
    });
  }
}

module.exports = ExpenseCtrl;
