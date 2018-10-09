module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /vendors
   * @apiName VendorPost
   * @apiGroup Vendor
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {string} data.attributes.name
   * @apiParam {string} data.type
   *
   * @apiSuccess (201) {object} data
   * @apiSuccess (201) {object} data.attributes
   * @apiSuccess (201) {string} data.attributes[created-at]
   * @apiSuccess (201) {string} data.attributes.name
   * @apiSuccess (201) {string} data.id
   * @apiSuccess (201) {string} data.type
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 422 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "source": {
   *          "pointer": "/data/attributes/name",
   *        },
   *        "detail": "Vendor name is required.",
   *      }]
   *    }
   */
  return async(req, res, next) => {
    try {
      const vendorUuid = await controllers.VendorCtrl.createVendor({
        auditApiCallUuid: req.auditApiCallUuid,
        name: req.body.data.attributes.name,
      });

      const vendor = await models.Vendor.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: vendorUuid,
        },
      });

      return res.status(201).json({
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
