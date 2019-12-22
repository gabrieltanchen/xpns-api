const createBudget = require('./create-budget');

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
}

module.exports = BudgetCtrl;
