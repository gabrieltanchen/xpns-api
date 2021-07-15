const Sequelize = require('sequelize');

const { ExpenseError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {object} expenseCtrl Instance of ExpenseCtrl
 * @param {string} expenseUuid UUID of the expense to delete
 */
module.exports = async({
  auditApiCallUuid,
  expenseCtrl,
  expenseUuid,
}) => {
  const controllers = expenseCtrl.parent;
  const models = expenseCtrl.models;
  if (!expenseUuid) {
    throw new ExpenseError('Expense is required');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new ExpenseError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new ExpenseError('Audit user does not exist');
  }

  const expense = await models.Expense.findOne({
    attributes: ['amount_cents', 'fund_uuid', 'reimbursed_cents', 'uuid'],
    include: [{
      attributes: ['uuid'],
      model: models.HouseholdMember,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }, {
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
    }, {
      attributes: ['uuid'],
      model: models.Vendor,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }],
    where: {
      uuid: expenseUuid,
    },
  });
  if (!expense) {
    throw new ExpenseError('Not found');
  }
  if (expense.get('fund_uuid')) {
    const fund = await models.Fund.findOne({
      attributes: ['uuid'],
      where: {
        household_uuid: user.get('household_uuid'),
        uuid: expense.get('fund_uuid'),
      },
    });
    if (!fund) {
      throw new ExpenseError('Not found');
    }
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    const trackChangesParams = {
      auditApiCallUuid,
      deleteList: [expense],
      transaction,
    };
    if (expense.get('fund_uuid')) {
      const trackedFund = await models.Fund.findOne({
        attributes: ['balance_cents', 'uuid'],
        transaction,
        where: {
          uuid: expense.get('fund_uuid'),
        },
      });
      trackedFund.set('balance_cents', trackedFund.get('balance_cents') + (expense.get('amount_cents') - expense.get('reimbursed_cents')));
      trackChangesParams.changeList = [trackedFund];
    }
    await controllers.AuditCtrl.trackChanges(trackChangesParams);
  });
};
