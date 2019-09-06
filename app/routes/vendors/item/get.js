const { VendorNotFoundError } = require('../../../middleware/error-handler/');

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /vendors/:uuid
   * @apiName VendorItemGet
   * @apiGroup Vendor
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.name
   * @apiSuccess (200) {string} data.id
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

      const vendor = await models.Vendor.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          household_uuid: user.get('household_uuid'),
          uuid: req.params.uuid,
        },
      });
      if (!vendor) {
        throw new VendorNotFoundError('Not found');
      }

      return res.status(200).json({
        'data': {
          'attributes': {
            'created-at': vendor.get('created_at'),
            'name': vendor.get('name'),
          },
          'id': vendor.get('uuid'),
          'type': 'vendors',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
