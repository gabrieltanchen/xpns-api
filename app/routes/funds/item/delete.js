module.exports = (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {delete} /funds/:uuid
   * @apiName FundItemDelete
   * @apiGroup Fund
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
      await controllers.FundCtrl.deleteFund({
        auditApiCallUuid: req.auditApiCallUuid,
        fundUuid: req.params.uuid,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
