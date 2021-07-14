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

  async deleteExpense(params) {
    return deleteExpense({
      ...params,
      expenseCtrl: this,
    });
  }

  async updateExpense(params) {
    return updateExpense({
      ...params,
      expenseCtrl: this,
    });
  }
}

module.exports = ExpenseCtrl;
