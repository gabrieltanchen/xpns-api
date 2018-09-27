/**
 * @param {string} auditApiCallUuid
 * @param {object} categoryCtrl Instance of CategoryCtrl
 * @param {string} categoryUuid UUID of the category to update
 * @param {string} name
 * @param {string} parentUuid
 */
module.exports = async({
  auditApiCallUuid,
  categoryCtrl,
  categoryUuid,
  name,
  parentUuid,
}) => {
  const controllers = categoryCtrl.parent;
  const models = categoryCtrl.models;
  if (!categoryUuid) {
    throw new Error('Category is required.');
  } else if (!name) {
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

  const category = await models.Category.findOne({
    attributes: ['household_uuid', 'name', 'parent_uuid', 'uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: categoryUuid,
    },
  });
  if (!category) {
    throw new Error('Not found');
  }

  if (name !== category.get('name')) {
    category.set('name', name);
  }

  if ((parentUuid)
      && parentUuid !== category.get('parent_uuid')) {
    const parentCategory = await models.Category.findOne({
      attributes: ['uuid'],
      where: {
        household_uuid: user.get('household_uuid'),
        uuid: parentUuid,
      },
    });
    if (!parentCategory) {
      throw new Error('Unauthorized');
    }
    category.set('parent_uuid', parentCategory.get('uuid'));
  } else if (category.get('parent_uuid')
      && !parentUuid) {
    category.set('parent_uuid', null);
  }

  if (category.changed()) {
    await models.sequelize.transaction({
      isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [category],
        transaction,
      });
    });
  }
};
