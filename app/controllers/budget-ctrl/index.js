const createBudget = require('./create-budget');
const deleteBudget = require('./delete-budget');
const updateBudget = require('./update-budget');

class BudgetCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createBudget({
    auditApiCallUuid,
    budgetCents,
    month,
    subcategoryUuid,
    year,
  }) {
    return createBudget({
      auditApiCallUuid,
      budgetCents,
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
    auditApiCallUuid,
    budgetCents,
    budgetUuid,
    month,
    subcategoryUuid,
    year,
  }) {
    return updateBudget({
      auditApiCallUuid,
      budgetCents,
      budgetCtrl: this,
      budgetUuid,
      month,
      subcategoryUuid,
      year,
    });
  }
}

module.exports = BudgetCtrl;
