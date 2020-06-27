const Sequelize = require('sequelize');

const { BudgetError } = require('../../middleware/error-handler');

module.exports = async({
  auditApiCallUuid,
  budgetCtrl,
  budgetUuid,
}) => {
  const controllers = budgetCtrl.parent;
  const models = budgetCtrl.models;
  if (!budgetUuid) {
    throw new BudgetError('Budget is required');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new BudgetError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new BudgetError('Audit user does not exist');
  }

  const budget = await models.Budget.findOne({
    attributes: ['uuid'],
    include: [{
      attributes: ['uuid'],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
        where: {
          household_uuid: user.get('household_uuid'),
        },
      }],
      model: models.Subcategory,
      required: true,
    }],
    where: {
      uuid: budgetUuid,
    },
  });
  if (!budget) {
    throw new BudgetError('Not found');
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      deleteList: [budget],
      transaction,
    });
  });
};
