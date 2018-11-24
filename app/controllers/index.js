const AuditCtrl = require('./audit-ctrl/');
const CategoryCtrl = require('./category-ctrl/');
const ExpenseCtrl = require('./expense-ctrl/');
const UserCtrl = require('./user-ctrl/');
const VendorCtrl = require('./vendor-ctrl/');

class Controllers {
  constructor(models) {
    this.models = models;

    this.AuditCtrl = new AuditCtrl(this, models);
    this.CategoryCtrl = new CategoryCtrl(this, models);
    this.ExpenseCtrl = new ExpenseCtrl(this, models);
    this.UserCtrl = new UserCtrl(this, models);
    this.VendorCtrl = new VendorCtrl(this, models);
  }
}

module.exports = Controllers;
