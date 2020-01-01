const Sequelize = require('sequelize');

const { CategoryError } = require('../../middleware/error-handler/');

/**
 * @param {string} auditApiCallUuid
 * @param {object} categoryCtrl Instance of CategoryCtrl
 * @param {string} subcategoryUuid UUID of the subcategory to delete
 */
module.exports = async({
  auditApiCallUuid,
  categoryCtrl,
  subcategoryUuid,
}) => {
  const controllers = categoryCtrl.parent;
  const models = categoryCtrl.models;
  if (!subcategoryUuid) {
    throw new CategoryError('Subcategory is required');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new CategoryError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new CategoryError('Audit user does not exist');
  }

  const subcategory = await models.Subcategory.findOne({
    attributes: ['uuid'],
    include: [{
      attributes: ['uuid'],
      model: models.Category,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }],
    where: {
      uuid: subcategoryUuid,
    },
  });
  if (!subcategory) {
    throw new CategoryError('Not found');
  }

  // Search for any expenses. If any exist, don't allow deletion.
  const expenseCount = await models.Expense.count({
    where: {
      subcategory_uuid: subcategory.get('uuid'),
    },
  });
  if (expenseCount > 0) {
    throw new CategoryError('Cannot delete with expenses');
  }

  // Search for any budgets. If any exist, don't allow deletion.
  const budgetCount = await models.Budget.count({
    where: {
      subcategory_uuid: subcategory.get('uuid'),
    },
  });
  if (budgetCount > 0) {
    throw new CategoryError('Cannot delete with budgets');
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      deleteList: [subcategory],
      transaction,
    });
  });
};
