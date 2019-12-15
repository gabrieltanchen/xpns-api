const Sequelize = require('sequelize');

const { CategoryError } = require('../../middleware/error-handler/');

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
    throw new CategoryError('Category is required');
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
    throw new CategoryError('Not found');
  }

  // Search for any subcategories. If any exist, don't allow deletion.
  const subcategoryCount = await models.Subcategory.count({
    where: {
      category_uuid: category.get('uuid'),
    },
  });
  if (subcategoryCount > 0) {
    throw new CategoryError('Cannot delete with subcategories');
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
