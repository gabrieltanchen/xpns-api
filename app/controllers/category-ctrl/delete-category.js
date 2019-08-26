const Sequelize = require('sequelize');

/**
 * @param {string} auditApiCallUuid
 * @param {object} categoryCtrl Instance of CategoryCtrl
 * @param {string} categoryUuid UUID of the category to delete
 */
module.exports = async({
  auditApiCallUuid,
  categoryCtrl,
  categoryUuid,
}) => {
  const controllers = categoryCtrl.parent;
  const models = categoryCtrl.models;
  if (!categoryUuid) {
    throw new Error('Category is required.');
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

  const category = await models.Category.findOne({
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: categoryUuid,
    },
  });
  if (!category) {
    throw new Error('Not found');
  }

  // Search for any child categories. If any exist, don't allow deletion.
  const childCategoryCount = await models.Category.count({
    where: {
      parent_uuid: category.get('uuid'),
    },
  });
  if (childCategoryCount > 0) {
    throw new Error('Cannot delete a parent category');
  }

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      deleteList: [category],
      transaction,
    });
  });
};
