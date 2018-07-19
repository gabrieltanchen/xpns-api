const createCategory = require('./create-category');
const updateCategory = require('./update-category');

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

  async updateCategory({
    auditApiCallUuid,
    categoryUuid,
    name,
    parentUuid,
  }) {
    return updateCategory({
      auditApiCallUuid,
      categoryCtrl: this,
      categoryUuid,
      name,
      parentUuid,
    });
  }
}

module.exports = CategoryCtrl;
