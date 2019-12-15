const Sequelize = require('sequelize');

const { CategoryError } = require('../../middleware/error-handler/');

/**
 * @param {string} auditApiCallUuid
 * @param {object} categoryCtrl Instance of CategoryCtrl
 * @param {string} name
 */
module.exports = async({
  auditApiCallUuid,
  categoryCtrl,
  name,
}) => {
  const controllers = categoryCtrl.parent;
  const models = categoryCtrl.models;
  if (!name) {
    throw new CategoryError('Name is required');
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

  const newCategory = models.Category.build({
    household_uuid: user.get('household_uuid'),
    name,
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await newCategory.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [newCategory],
      transaction,
    });
  });

  return newCategory.get('uuid');
};
