module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /vendors/:uuid
   * @apiName VendorItemPatch
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
      await controllers.VendorCtrl.updateVendor({
        auditApiCallUuid: req.auditApiCallUuid,
        name: req.body.data.attributes.name,
        vendorUuid: req.params.uuid,
      });

      const vendor = await models.Vendor.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: req.params.uuid,
        },
      });

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
