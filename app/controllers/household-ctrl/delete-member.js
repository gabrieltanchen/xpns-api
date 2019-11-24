const Sequelize = require('sequelize');

const { HouseholdError } = require('../../middleware/error-handler/');

/**
 * @param {string} auditApiCallUuid
 * @param {object} householdCtrl Instance of HouseholdCtrl
 * @param {string} householdMemberUuid UUID of the household member to delete
 */
module.exports = async({
  auditApiCallUuid,
  householdCtrl,
  householdMemberUuid,
}) => {
  const controllers = householdCtrl.parent;
  const models = householdCtrl.models;
  if (!householdMemberUuid) {
    throw new HouseholdError('Household member is required');
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

  const householdMember = await models.HouseholdMember.findOne({
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: householdMemberUuid,
    },
  });
  if (!householdMember) {
    throw new HouseholdError('Not found');
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      deleteList: [householdMember],
      transaction,
    });
  });
};
