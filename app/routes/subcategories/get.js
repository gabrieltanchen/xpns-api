const Sequelize = require('sequelize');

const { CategoryError } = require('../../middleware/error-handler');

const Op = Sequelize.Op;

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
      if (req.query && req.query.category_id) {
        const category = await models.Category.findOne({
          attributes: ['uuid'],
          where: {
            household_uuid: user.get('household_uuid'),
            uuid: req.query.category_id,
          },
        });
        if (!category) {
          throw new CategoryError('Not found');
        }
        subcategoryWhere.category_uuid = category.get('uuid');
      } else if (req.query && req.query.search) {
        offset = 0;
        subcategoryWhere.name = {
          [Op.iLike]: `%${req.query.search}%`,
        };
      }

      const subcategories = await models.Subcategory.findAndCountAll({
        attributes: [
          'created_at',
          'name',
          'uuid',
        ],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.Category,
          required: true,
        }],
        limit,
        offset,
        order: [['name', 'ASC']],
        where: subcategoryWhere,
      });

      const included = [];
      const categoryIds = [];
      subcategories.rows.forEach((subcategory) => {
        if (!categoryIds.includes(subcategory.Category.get('uuid'))) {
          categoryIds.push(subcategory.Category.get('uuid'));
          included.push({
            'attributes': {
              'name': subcategory.Category.get('name'),
            },
            'id': subcategory.Category.get('uuid'),
            'type': 'categories',
          });
        }
      });

      return res.status(200).json({
        'data': subcategories.rows.map((subcategory) => {
          return {
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
          };
        }),
        'included': included,
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
