const { CategoryError } = require('../../../middleware/error-handler/');

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /subcategories/:uuid
   * @apiName SubcategoryItemGEt
   * @apiGroup Subcategory
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.name
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {object} data.relationships
   * @apiSuccess (200) {object} data.relationships.category
   * @apiSuccess (200) {object} data.relationships.category.data
   * @apiSuccess (200) {string} data.relationships.category.data.id
   * @apiSuccess (200) {string} data.type
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 401 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "detail": "Unauthorized",
   *      }],
   *    }
   */
  return async(req, res, next) => {
    try {
      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });
      if (!user) {
        throw new Error('Unauthorized');
      }

      const subcategory = await models.Subcategory.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        include: [{
          attributes: ['uuid'],
          model: models.Category,
          required: true,
          where: {
            household_uuid: user.get('household_uuid'),
          },
        }],
        where: {
          uuid: req.params.uuid,
        },
      });
      if (!subcategory) {
        throw new CategoryError('Not found');
      }

      return res.status(200).json({
        'data': {
          'attributes': {
            'created-at': subcategory.get('created_at'),
            'name': subcategory.get('name'),
          },
          'id': subcategory.get('uuid'),
          'relationships': {
            'category': {
              'data': {
                'id': subcategory.Category.get('uuid'),
                'type': 'categories',
              },
            },
          },
          'type': 'subcategories',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
