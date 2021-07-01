const Sequelize = require('sequelize');

const { FundError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {object} fundCtrl Instance of FundCtrl
 * @param {string} fundUuid UUID of the fund to update
 * @param {string} name
 */
module.exports = async({
  auditApiCallUuid,
  fundCtrl,
  fundUuid,
  name,
}) => {
  const controllers = fundCtrl.parent;
  const models = fundCtrl.models;
  if (!fundUuid) {
    throw new FundError('Fund is required');
  } else if (!name) {
    throw new FundError('Name is required');
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
    attributes: ['household_uuid', 'name', 'uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: fundUuid,
    },
  });
  if (!fund) {
    throw new FundError('Not found');
  }

  if (!name !== fund.get('name')) {
    fund.set('name', name);
  }

  if (fund.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [fund],
        transaction,
      });
    });
  }
};
