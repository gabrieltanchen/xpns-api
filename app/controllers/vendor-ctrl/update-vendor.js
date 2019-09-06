const Sequelize = require('sequelize');

const { VendorError } = require('../../middleware/error-handler/');

/**
 * @param {string} auditApiCallUuid
 * @param {string} name
 * @param {object} vendorCtrl
 * @param {string} vendorUuid
 */
module.exports = async({
  auditApiCallUuid,
  name,
  vendorCtrl,
  vendorUuid,
}) => {
  const controllers = vendorCtrl.parent;
  const models = vendorCtrl.models;
  if (!vendorUuid) {
    throw new VendorError('Vendor is required');
  } else if (!name) {
    throw new VendorError('Name is required');
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
    attributes: ['name', 'uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: vendorUuid,
    },
  });
  if (!vendor) {
    throw new VendorError('Not found');
  }

  if (name !== vendor.get('name')) {
    vendor.set('name', name);
  }

  if (vendor.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [vendor],
        transaction,
      });
    });
  }
};
