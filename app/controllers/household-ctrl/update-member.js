const Sequelize = require('sequelize');

const { HouseholdError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {object} householdCtrl
 * @param {string} householdMemberUuid
 * @param {string} name
 */
module.exports = async({
  auditApiCallUuid,
  householdCtrl,
  householdMemberUuid,
  name,
}) => {
  const controllers = householdCtrl.parent;
  const models = householdCtrl.models;
  if (!householdMemberUuid) {
    throw new HouseholdError('Household member is required');
  } else if (!name) {
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

  const householdMember = await models.HouseholdMember.findOne({
    attributes: ['name', 'uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: householdMemberUuid,
    },
  });
  if (!householdMember) {
    throw new HouseholdError('Not found');
  }

  if (name !== householdMember.get('name')) {
    householdMember.set('name', name);
  }

  if (householdMember.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [householdMember],
        transaction,
      });
    });
  }
};
