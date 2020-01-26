const Sequelize = require('sequelize');
const _ = require('lodash');

const { IncomeError } = require('../../middleware/error-handler/');

/**
 * @param {integer} amountCents
 * @param {string} auditApiCallUuid
 * @param {string} description
 * @param {string} householdMemberUuid
 * @param {object} incomeCtrl Instance of IncomeCtrl
 * @param {string} incomeUuid
 */
module.exports = async({
  amountCents,
  auditApiCallUuid,
  description,
  householdMemberUuid,
  incomeCtrl,
  incomeUuid,
}) => {
  const controllers = incomeCtrl.parent;
  const models = incomeCtrl.models;
  if (!incomeUuid) {
    throw new IncomeError('Income is required');
  } else if (!householdMemberUuid) {
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

  const income = await models.Income.findOne({
    attributes: [
      'amount_cents',
      'description',
      'household_member_uuid',
      'uuid',
    ],
    include: [{
      attributes: ['uuid'],
      model: models.HouseholdMember,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }],
    where: {
      uuid: incomeUuid,
    },
  });
  if (!income) {
    throw new IncomeError('Not found');
  }

  if (income.get('amount_cents') !== parseInt(amountCents, 10)) {
    income.set('amount_cents', parseInt(amountCents, 10));
  }
  if (income.get('description') !== description) {
    income.set('description', description);
  }

  // Validate household member UUID.
  if (householdMemberUuid !== income.get('household_member_uuid')) {
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
    income.set('household_member_uuid', householdMember.get('uuid'));
  }

  if (income.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [income],
        transaction,
      });
    });
  }
};
