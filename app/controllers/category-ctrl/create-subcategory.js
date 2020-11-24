const Sequelize = require('sequelize');

const { CategoryError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {object} categoryCtrl Instance of CategoryCtrl
 * @param {string} categoryUuid
 * @param {string} name
 */
module.exports = async({
  auditApiCallUuid,
  categoryCtrl,
  categoryUuid,
  name,
}) => {
  const controllers = categoryCtrl.parent;
  const models = categoryCtrl.models;
  if (!categoryUuid) {
    throw new CategoryError('Parent category is required');
  } else if (!name) {
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

  const category = await models.Category.findOne({
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: categoryUuid,
    },
  });
  if (!category) {
    throw new CategoryError('Parent category not found');
  }

  const newSubcategory = models.Subcategory.build({
    category_uuid: category.get('uuid'),
    name,
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await newSubcategory.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [newSubcategory],
      transaction,
    });
  });

  return newSubcategory.get('uuid');
};
