const { CategoryError } = require('../../middleware/error-handler/');

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /subcategories
   * @apiName SubcategoryGet
   * @apiGroup Subcategory
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.subcategories
   * @apiSuccess (200) {object} data.subcategories[].attributes
   * @apiSuccess (200) {string} data.subcategories[].attributes[created-at]
   * @apiSuccess (200) {string} data.subcategories[].attributes.name
   * @apiSuccess (200) {string} data.subcategories[].id
   * @apiSuccess (200) {string} data.subcategories[].type
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
      // Query params
      let limit = 25;
      if (req.query && req.query.limit) {
        limit = parseInt(req.query.limit, 10);
      }
      let offset = 0;
      if (req.query && req.query.page) {
        offset = limit * (parseInt(req.query.page, 10) - 1);
      }

      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });

      const subcategoryWhere = {};
      if (req.query.category_uuid) {
        const category = await models.Category.findOne({
          attributes: ['uuid'],
          where: {
            household_uuid: user.get('household_uuid'),
            uuid: req.query.category_uuid,
          },
        });
        if (!category) {
          throw new CategoryError('Not found');
        }
        subcategoryWhere.category_uuid = category.get('uuid');
      } else {
        throw new CategoryError('No open queries');
      }

      const subcategories = await models.Subcategory.findAndCountAll({
        attributes: [
          'created_at',
          'name',
          'uuid',
        ],
        limit,
        offset,
        order: [['name', 'ASC']],
        where: subcategoryWhere,
      });

      return res.status(200).json({
        'data': subcategories.rows.map((subcategory) => {
          return {
            'attributes': {
              'created-at': subcategory.get('created_at'),
              'name': subcategory.get('name'),
            },
            'id': subcategory.get('uuid'),
            'type': 'subcategories',
          };
        }),
        'meta': {
          'pages': Math.ceil(subcategories.count / limit),
          'total': subcategories.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
