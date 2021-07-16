const Sequelize = require('sequelize');

const { FundError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {string} depositUuid UUID of the deposit to delete
 * @param {object} fundCtrl Instance of FundCtrl
 */
module.exports = async({
  auditApiCallUuid,
  depositUuid,
  fundCtrl,
}) => {
  const controllers = fundCtrl.parent;
  const models = fundCtrl.models;
  if (!depositUuid) {
    throw new FundError('Deposit is required');
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

  const deposit = await models.Deposit.findOne({
    attributes: ['amount_cents', 'uuid'],
    include: [{
      attributes: ['uuid'],
      model: models.Fund,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }],
    where: {
      uuid: depositUuid,
    },
  });
  if (!deposit) {
    throw new FundError('Deposit not found');
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    const trackedFund = await models.Fund.findOne({
      attributes: ['balance_cents', 'uuid'],
      transaction,
      where: {
        uuid: deposit.Fund.get('uuid'),
      },
    });
    trackedFund.set('balance_cents', trackedFund.get('balance_cents') - deposit.get('amount_cents'));
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      changeList: [trackedFund],
      deleteList: [deposit],
      transaction,
    });
  });
};
