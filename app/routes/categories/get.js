module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /categories
   * @apiName CategoryGet
   * @apiGroup Category
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.categories
   * @apiSuccess (200) {object} data.categories[].attributes
   * @apiSuccess (200) {string} data.categories[].attributes[created-at]
   * @apiSuccess (200) {string} data.categories[].attributes.name
   * @apiSuccess (200) {string} data.categories[].id
   * @apiSuccess (200) {string} data.categories[].type
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

      const categories = await models.Category.findAndCountAll({
        attributes: ['created_at', 'name', 'uuid'],
        limit,
        offset,
        order: [['name', 'ASC']],
        where: {
          household_uuid: user.get('household_uuid'),
        },
      });

      return res.status(200).json({
        'data': categories.rows.map((category) => {
          return {
            'attributes': {
              'created-at': category.get('created_at'),
              'name': category.get('name'),
            },
            'id': category.get('uuid'),
            'type': 'categories',
          };
        }),
        'meta': {
          'pages': Math.ceil(categories.count / limit),
          'total': categories.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
