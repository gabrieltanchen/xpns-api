const createCategory = require('./create-category');

class CategoryCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createCategory({
    auditApiCallUuid,
    name,
    parentUuid,
  }) {
    return createCategory({
      auditApiCallUuid,
      categoryCtrl: this,
      name,
      parentUuid,
    });
  }
}

module.exports = CategoryCtrl;
