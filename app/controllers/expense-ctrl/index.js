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
    householdMemberUuid,
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
      householdMemberUuid,
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
    householdMemberUuid,
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
      householdMemberUuid,
      reimbursedCents,
      vendorUuid,
    });
  }
}

module.exports = ExpenseCtrl;
