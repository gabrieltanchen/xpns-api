const Sequelize = require('sequelize');

const Op = Sequelize.Op;

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /vendors
   * @apiName VendorGet
   * @apiGroup Vendor
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.vendors
   * @apiSuccess (200) {object} data.vendors[].attributes
   * @apiSuccess (200) {string} data.vendors[].attributes[created-at]
   * @apiSuccess (200) {string} data.vendors[].attributes.name
   * @apiSuccess (200) {string} data.vendors[].id
   * @apiSuccess (200) {string} data.vendors[].type
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

      const vendorWhere = {
        household_uuid: user.get('household_uuid'),
      };

      if (req.query && req.query.search) {
        offset = 0;
        vendorWhere.name = {
          [Op.iLike]: `%${req.query.search}%`,
        };
      }

      const vendors = await models.Vendor.findAndCount({
        attributes: ['created_at', 'name', 'uuid'],
        limit,
        offset,
        order: [['name', 'ASC']],
        where: vendorWhere,
      });

      return res.status(200).json({
        'data': vendors.rows.map((vendor) => {
          return {
            'attributes': {
              'created-at': vendor.get('created_at'),
              'name': vendor.get('name'),
            },
            'id': vendor.get('uuid'),
            'type': 'vendors',
          };
        }),
        'meta': {
          'pages': Math.ceil(vendors.count / limit),
          'total': vendors.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
