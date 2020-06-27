const createBudget = require('./create-budget');
const deleteBudget = require('./delete-budget');
const updateBudget = require('./update-budget');

class BudgetCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createBudget({
    amount,
    auditApiCallUuid,
    month,
    subcategoryUuid,
    year,
  }) {
    return createBudget({
      amount,
      auditApiCallUuid,
      budgetCtrl: this,
      month,
      subcategoryUuid,
      year,
    });
  }

  async deleteBudget({
    auditApiCallUuid,
    budgetUuid,
  }) {
    return deleteBudget({
      auditApiCallUuid,
      budgetCtrl: this,
      budgetUuid,
    });
  }

  async updateBudget({
    amount,
    auditApiCallUuid,
    budgetUuid,
    month,
    subcategoryUuid,
    year,
  }) {
    return updateBudget({
      amount,
      auditApiCallUuid,
      budgetCtrl: this,
      budgetUuid,
      month,
      subcategoryUuid,
      year,
    });
  }
}

module.exports = BudgetCtrl;
