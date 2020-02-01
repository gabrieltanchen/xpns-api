module.exports = (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {delete} /incomes/:uuid
   * @apiName IncomeItemDelete
   * @apiGroup Income
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
      await controllers.IncomeCtrl.deleteIncome({
        auditApiCallUuid: req.auditApiCallUuid,
        incomeUuid: req.params.uuid,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
