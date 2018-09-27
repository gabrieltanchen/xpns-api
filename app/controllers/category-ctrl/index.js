const createCategory = require('./create-category');
const deleteCategory = require('./delete-category');
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

  async deleteCategory({
    auditApiCallUuid,
    categoryUuid,
  }) {
    return deleteCategory({
      auditApiCallUuid,
      categoryCtrl: this,
      categoryUuid,
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
