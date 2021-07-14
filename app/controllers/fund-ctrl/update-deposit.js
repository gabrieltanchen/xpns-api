const moment = require('moment');
const Sequelize = require('sequelize');

const { FundError } = require('../../middleware/error-handler');

/**
 * @param {integer} amount
 * @param {string} auditApiCallUuid
 * @param {string} date
 * @param {string} depositUuid
 * @param {object} fundCtrl Instance of FundCtrl
 * @param {string} fundUuid
 */
module.exports = async({
  amount,
  auditApiCallUuid,
  date,
  depositUuid,
  fundCtrl,
  fundUuid,
}) => {
  const controllers = fundCtrl.parent;
  const models = fundCtrl.models;
  if (!depositUuid) {
    throw new FundError('Deposit is required');
  } else if (!fundUuid) {
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

  const deposit = await models.Deposit.findOne({
    attributes: [
      'amount_cents',
      'date',
      'fund_uuid',
      'uuid',
    ],
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

  const oldAmount = deposit.get('amount_cents');
  let newAmount = oldAmount;
  if (deposit.get('amount_cents') !== parseInt(amount, 10)) {
    deposit.set('amount_cents', parseInt(amount, 10));
    newAmount = deposit.get('amount_cents');
  }
  if (moment(deposit.get('date')).format('YYYY-MM-DD') !== moment.utc(date).format('YYYY-MM-DD')) {
    deposit.set('date', moment.utc(date).format('YYYY-MM-DD'));
  }

  // Validate fund UUID.
  const oldFundUuid = deposit.get('fund_uuid');
  let newFundUuid = oldFundUuid;
  if (fundUuid !== deposit.get('fund_uuid')) {
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
    deposit.set('fund_uuid', fund.get('uuid'));
    newFundUuid = deposit.get('fund_uuid');
  }

  if (deposit.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      const changeList = [deposit];
      if (deposit.changed('fund_uuid')) {
        // The fund is being changed, so we need to subtract the deposit amount
        // from the old fund and add to the new fund.
        const oldTrackedFund = await models.Fund.findOne({
          attributes: ['balance_cents', 'uuid'],
          transaction,
          where: {
            uuid: oldFundUuid,
          },
        });
        // Use oldAmount because that's the amount that would have been added previously.
        oldTrackedFund.set('balance_cents', oldTrackedFund.get('balance_cents') - oldAmount);
        changeList.push(oldTrackedFund);
        const newTrackedFund = await models.Fund.findOne({
          attributes: ['balance_cents', 'uuid'],
          transaction,
          where: {
            uuid: newFundUuid,
          },
        });
        // Use newAmount in case the amount is also being updated.
        newTrackedFund.set('balance_cents', newTrackedFund.get('balance_cents') + newAmount);
        changeList.push(newTrackedFund);
      } else if (deposit.changed('amount_cents')) {
        // Simply update the fund balance with the difference of the old and
        // new amounts.
        const trackedFund = await models.Fund.findOne({
          attributes: ['balance_cents', 'uuid'],
          transaction,
          where: {
            uuid: oldFundUuid,
          },
        });
        trackedFund.set('balance_cents', trackedFund.get('balance_cents') - (oldAmount - newAmount));
        changeList.push(trackedFund);
      }
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList,
        transaction,
      });
    });
  }
};
