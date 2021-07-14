const createExpense = require('./create-expense');
const deleteExpense = require('./delete-expense');
const updateExpense = require('./update-expense');

class ExpenseCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createExpense(params) {
    return createExpense({
      ...params,
      expenseCtrl: this,
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
    amount,
    auditApiCallUuid,
    date,
    description,
    expenseUuid,
    householdMemberUuid,
    reimbursedAmount,
    subcategoryUuid,
    vendorUuid,
  }) {
    return updateExpense({
      amount,
      auditApiCallUuid,
      date,
      description,
      expenseCtrl: this,
      expenseUuid,
      householdMemberUuid,
      reimbursedAmount,
      subcategoryUuid,
      vendorUuid,
    });
  }
}

module.exports = ExpenseCtrl;
