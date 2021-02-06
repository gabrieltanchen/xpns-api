const Sequelize = require('sequelize');

const { VendorError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {object} vendorCtrl Instance of VendorCtrl
 * @param {string} vendorUuid UUID of the vendor to delete
 */
module.exports = async({
  auditApiCallUuid,
  vendorCtrl,
  vendorUuid,
}) => {
  const controllers = vendorCtrl.parent;
  const models = vendorCtrl.models;
  if (!vendorUuid) {
    throw new VendorError('Vendor is required');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new VendorError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new VendorError('Audit user does not exist');
  }

  const vendor = await models.Vendor.findOne({
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: vendorUuid,
    },
  });
  if (!vendor) {
    throw new VendorError('Not found');
  }

  // Search for any expenses. If any exist, don't allow deletion.
  const expenseCount = await models.Expense.count({
    where: {
      vendor_uuid: vendor.get('uuid'),
    },
  });
  if (expenseCount > 0) {
    throw new VendorError('Cannot delete with expenses');
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      deleteList: [vendor],
      transaction,
    });
  });
};
