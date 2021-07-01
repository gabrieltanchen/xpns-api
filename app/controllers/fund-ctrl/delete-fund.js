const Sequelize = require('sequelize');

const { FundError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {object} fundCtrl Instance of FundCtrl
 * @param {string} fundUuid UUID of the fund to delete
 */
module.exports = async({
  auditApiCallUuid,
  fundCtrl,
  fundUuid,
}) => {
  const controllers = fundCtrl.parent;
  const models = fundCtrl.models;
  if (!fundUuid) {
    throw new FundError('Fund is required');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new FundError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new FundError('Audit user does not exist');
  }

  const fund = await models.Fund.findOne({
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: fundUuid,
    },
  });
  if (!fund) {
    throw new FundError('Not found');
  }

  // Search for any deposits. If any exist, don't allow deletion.
  const depositCount = await models.Deposit.count({
    where: {
      fund_uuid: fund.get('uuid'),
    },
  });
  if (depositCount > 0) {
    throw new FundError('Cannot delete with deposits');
  }

  // Search for any expenses. If any exist, don't allow deletion.
  const expenseCount = await models.Expense.count({
    where: {
      fund_uuid: fund.get('uuid'),
    },
  });
  if (expenseCount > 0) {
    throw new FundError('Cannot delete with expenses');
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      deleteList: [fund],
      transaction,
    });
  });
};
