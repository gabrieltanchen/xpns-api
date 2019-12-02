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
    date,
    description,
    householdMemberUuid,
    reimbursedCents,
    subcategoryUuid,
    vendorUuid,
  }) {
    return createExpense({
      amountCents,
      auditApiCallUuid,
      date,
      description,
      expenseCtrl: this,
      householdMemberUuid,
      reimbursedCents,
      subcategoryUuid,
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
    date,
    description,
    expenseUuid,
    householdMemberUuid,
    reimbursedCents,
    subcategoryUuid,
    vendorUuid,
  }) {
    return updateExpense({
      amountCents,
      auditApiCallUuid,
      date,
      description,
      expenseCtrl: this,
      expenseUuid,
      householdMemberUuid,
      reimbursedCents,
      subcategoryUuid,
      vendorUuid,
    });
  }
}

module.exports = ExpenseCtrl;
