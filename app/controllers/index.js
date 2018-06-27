const AuditCtrl = require('./audit-ctrl/');
const UserCtrl = require('./user-ctrl/');

class Controllers {
  constructor(models) {
    this.models = models;

    this.AuditCtrl = new AuditCtrl(this, models);
    this.UserCtrl = new UserCtrl(this, models);
  }
}

module.exports = Controllers;
