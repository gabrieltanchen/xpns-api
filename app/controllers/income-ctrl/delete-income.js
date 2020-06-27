const Sequelize = require('sequelize');

const { IncomeError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {object} incomeCtrl Instance of IncomeCtrl
 * @param {string} incomeUuid UUID of the income to delete
 */
module.exports = async({
  auditApiCallUuid,
  incomeCtrl,
  incomeUuid,
}) => {
  const controllers = incomeCtrl.parent;
  const models = incomeCtrl.models;
  if (!incomeUuid) {
    throw new IncomeError('Income is required');
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
    attributes: ['uuid'],
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

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      deleteList: [income],
      transaction,
    });
  });
};
