module.exports = (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {delete} /deposits/:uuid
   * @apiName DepositItemDelete
   * @apiGroup Deposit
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
      await controllers.FundCtrl.deleteDeposit({
        auditApiCallUuid: req.auditApiCallUuid,
        depositUuid: req.params.uuid,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
