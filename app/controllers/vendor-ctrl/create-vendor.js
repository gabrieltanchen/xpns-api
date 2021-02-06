const Sequelize = require('sequelize');

const { VendorError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {string} name
 * @param {object} vendorCtrl Instance of VendorCtrl
 */
module.exports = async({
  auditApiCallUuid,
  name,
  vendorCtrl,
}) => {
  const controllers = vendorCtrl.parent;
  const models = vendorCtrl.models;
  if (!name) {
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

  const newVendor = models.Vendor.build({
    household_uuid: user.get('household_uuid'),
    name,
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await newVendor.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [newVendor],
      transaction,
    });
  });

  return newVendor.get('uuid');
};
