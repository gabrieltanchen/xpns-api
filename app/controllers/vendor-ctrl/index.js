const createVendor = require('./create-vendor');

class VendorCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async createVendor({
    auditApiCallUuid,
    name,
  }) {
    return createVendor({
      auditApiCallUuid,
      name,
      vendorCtrl: this,
    });
  }
}

module.exports = VendorCtrl;
