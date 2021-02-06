const Sequelize = require('sequelize');

const { CategoryError } = require('../../middleware/error-handler');

/**
 * @param {string} auditApiCallUuid
 * @param {object} categoryCtrl Instance of CategoryCtrl
 * @param {string} categoryUuid
 * @param {string} name
 * @param {string} subcategoryUuid
 */
module.exports = async({
  auditApiCallUuid,
  categoryCtrl,
  categoryUuid,
  name,
  subcategoryUuid,
}) => {
  const controllers = categoryCtrl.parent;
  const models = categoryCtrl.models;
  if (!subcategoryUuid) {
    throw new CategoryError('Subcategory is required');
  } else if (!categoryUuid) {
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

  const subcategory = await models.Subcategory.findOne({
    attributes: ['category_uuid', 'name', 'uuid'],
    include: [{
      attributes: ['uuid'],
      model: models.Category,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }],
    where: {
      uuid: subcategoryUuid,
    },
  });
  if (!subcategory) {
    throw new CategoryError('Not found');
  }

  if (name !== subcategory.get('name')) {
    subcategory.set('name', name);
  }

  if (categoryUuid !== subcategory.get('category_uuid')) {
    const category = await models.Category.findOne({
      attributes: ['uuid'],
      where: {
        household_uuid: user.get('household_uuid'),
        uuid: categoryUuid,
      },
    });
    if (!category) {
      throw new Error('Unauthorized');
    }
    subcategory.set('category_uuid', category.get('uuid'));
  }

  if (subcategory.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [subcategory],
        transaction,
      });
    });
  }
};
