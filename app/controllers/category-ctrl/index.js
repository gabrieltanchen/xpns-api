const createCategory = require('./create-category');
const createSubcategory = require('./create-subcategory');
const deleteCategory = require('./delete-category');
const deleteSubcategory = require('./delete-subcategory');
const updateCategory = require('./update-category');
const updateSubcategory = require('./update-subcategory');

class CategoryCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createCategory({
    auditApiCallUuid,
    name,
  }) {
    return createCategory({
      auditApiCallUuid,
      categoryCtrl: this,
      name,
    });
  }

  async createSubcategory({
    auditApiCallUuid,
    categoryUuid,
    name,
  }) {
    return createSubcategory({
      auditApiCallUuid,
      categoryCtrl: this,
      categoryUuid,
      name,
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

  async deleteSubcategory({
    auditApiCallUuid,
    subcategoryUuid,
  }) {
    return deleteSubcategory({
      auditApiCallUuid,
      categoryCtrl: this,
      subcategoryUuid,
    });
  }

  async updateCategory({
    auditApiCallUuid,
    categoryUuid,
    name,
  }) {
    return updateCategory({
      auditApiCallUuid,
      categoryCtrl: this,
      categoryUuid,
      name,
    });
  }

  async updateSubcategory({
    auditApiCallUuid,
    categoryUuid,
    name,
    subcategoryUuid,
  }) {
    return updateSubcategory({
      auditApiCallUuid,
      categoryCtrl: this,
      categoryUuid,
      name,
      subcategoryUuid,
    });
  }
}

module.exports = CategoryCtrl;
