const updateVendor = require('./update-vendor');

class VendorCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
  }

  async updateVendory({
    auditApiCallUuid,
    name,
    vendorUuid,
  }) {
    return updateVendor({
      auditApiCallUuid,
      name,
      vendorCtrl: this,
      vendorUuid,
    });
  }
}

module.exports = VendorCtrl;
