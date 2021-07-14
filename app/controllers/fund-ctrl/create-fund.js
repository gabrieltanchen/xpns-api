const Sequelize = require('sequelize');

const { FundError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {object} fundCtrl Instance of FundCtrl
 * @param {string} name
 */
module.exports = async({
  auditApiCallUuid,
  fundCtrl,
  name,
}) => {
  const controllers = fundCtrl.parent;
  const models = fundCtrl.models;
  if (!name) {
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

  const newFund = models.Fund.build({
    household_uuid: user.get('household_uuid'),
    name,
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await newFund.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [newFund],
      transaction,
    });
  });

  return newFund.get('uuid');
};
