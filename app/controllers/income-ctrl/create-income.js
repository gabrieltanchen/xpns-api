const Sequelize = require('sequelize');
const _ = require('lodash');

const { IncomeError } = require('../../middleware/error-handler/');

/**
 * @param {integer} amountCents
 * @param {string} auditApiCallUuid
 * @param {string} description
 * @param {string} householdMemberUuid
 * @param {object} incomeCtrl Instance of IncomeCtrl
 */
module.exports = async({
  amountCents,
  auditApiCallUuid,
  description,
  householdMemberUuid,
  incomeCtrl,
}) => {
  const controllers = incomeCtrl.parent;
  const models = incomeCtrl.models;
  if (!householdMemberUuid) {
    throw new IncomeError('Household member is required');
  } else if (isNaN(parseInt(amountCents, 10))) {
    throw new IncomeError('Invalid amount');
  } else if (!_.isString(description)) {
    throw new IncomeError('Invalid description');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new IncomeError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new IncomeError('Audit user does not exist');
  }

  // Validate household member belongs to household.
  const householdMember = await models.HouseholdMember.findOne({
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: householdMemberUuid,
    },
  });
  if (!householdMember) {
    throw new IncomeError('Household member not found');
  }

  const newIncome = models.Income.build({
    amount_cents: parseInt(amountCents, 10),
    description,
    household_member_uuid: householdMember.get('uuid'),
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await newIncome.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [newIncome],
      transaction,
    });
  });

  return newIncome.get('uuid');
};
