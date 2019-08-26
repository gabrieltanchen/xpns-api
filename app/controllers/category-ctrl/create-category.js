const Sequelize = require('sequelize');

const { CATEGORY_NOT_FOUND } = require('../../middleware/error-handler/');

/**
 * @param {string} auditApiCallUuid
 * @param {object} categoryCtrl Instance of CategoryCtrl
 * @param {string} name
 * @param {string} parentUuid
 */
module.exports = async({
  auditApiCallUuid,
  categoryCtrl,
  name,
  parentUuid,
}) => {
  const controllers = categoryCtrl.parent;
  const models = categoryCtrl.models;
  if (!name) {
    throw new Error('Name is required.');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new Error('Unauthorized');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new Error('Unauthorized');
  }

  let parentCategory;
  if (parentUuid) {
    parentCategory = await models.Category.findOne({
      attributes: ['uuid'],
      where: {
        household_uuid: user.get('household_uuid'),
        uuid: parentUuid,
      },
    });
    if (!parentCategory) {
      const error = new Error('Not found');
      error.code = CATEGORY_NOT_FOUND;
      throw error;
    }
  }

  const newCategory = models.Category.build({
    household_uuid: user.get('household_uuid'),
    name,
    parent_uuid: (parentCategory) ? parentCategory.get('uuid') : null,
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
