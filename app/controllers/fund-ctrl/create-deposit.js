const moment = require('moment');
const Sequelize = require('sequelize');

const { FundError } = require('../../middleware/error-handler');

/**
 * @param {integer} amount
 * @param {string} auditApiCallUuid
 * @param {string} date
 * @param {object} fundCtrl Instance of FundCtrl
 * @param {string} fundUuid
 */
module.exports = async({
  amount,
  auditApiCallUuid,
  date,
  fundCtrl,
  fundUuid,
}) => {
  const controllers = fundCtrl.parent;
  const models = fundCtrl.models;
  if (!fundUuid) {
    throw new FundError('Fund is required');
  } else if (!moment.utc(date).isValid()) {
    throw new FundError('Invalid date');
  } else if (isNaN(parseInt(amount, 10))) {
    throw new FundError('Invalid amount');
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

  // Validate fund belongs to household.
  const fund = await models.Fund.findOne({
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: fundUuid,
    },
  });
  if (!fund) {
    throw new FundError('Fund not found');
  }

  const newDeposit = models.Deposit.build({
    amount_cents: parseInt(amount, 10),
    date: moment.utc(date).format('YYYY-MM-DD'),
    fund_uuid: fund.get('uuid'),
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    const trackedFund = await models.Fund.findOne({
      attributes: ['balance_cents', 'uuid'],
      transaction,
      where: {
        uuid: newDeposit.get('fund_uuid'),
      },
    });
    trackedFund.set('balance_cents', trackedFund.get('balance_cents') + newDeposit.get('amount_cents'));
    await newDeposit.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      changeList: [trackedFund],
      newList: [newDeposit],
      transaction,
    });
  });

  return newDeposit.get('uuid');
};
