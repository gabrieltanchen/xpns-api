const Sequelize = require('sequelize');

const { HouseholdError } = require('../../middleware/error-handler/');

/**
 * @param {string} auditApiCallUuid
 * @param {string} name
 * @param {object} vendorCtrl Instance of VendorCtrl
 */
module.exports = async({
  auditApiCallUuid,
  name,
  householdCtrl,
}) => {
  const controllers = householdCtrl.parent;
  const models = householdCtrl.models;
  if (!name) {
    throw new HouseholdError('Name is required');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new HouseholdError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new HouseholdError('Audit user does not exist');
  }

  const newHouseholdMember = models.HouseholdMember.build({
    household_uuid: user.get('household_uuid'),
    name,
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await newHouseholdMember.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [newHouseholdMember],
      transaction,
    });
  });

  return newHouseholdMember.get('uuid');
};
