const createVendor = require('./create-vendor');
const deleteVendor = require('./delete-vendor');
const updateVendor = require('./update-vendor');

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

  async deleteVendor({
    auditApiCallUuid,
    vendorUuid,
  }) {
    return deleteVendor({
      auditApiCallUuid,
      vendorCtrl: this,
      vendorUuid,
    });
  }

  async updateVendor({
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
