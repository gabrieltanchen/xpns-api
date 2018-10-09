module.exports = (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {delete} /vendors/:uuid
   * @apiName VendorItemDelete
   * @apiGroup Vendor
   *
   * @apiSuccess (204)
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
      await controllers.VendorCtrl.deleteVendor({
        auditApiCallUuid: req.auditApiCallUuid,
        vendorUuid: req.params.uuid,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
