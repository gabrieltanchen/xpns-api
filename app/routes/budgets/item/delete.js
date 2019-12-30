module.exports = (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {delete} /budgets/:uuid
   * @apiName BudgetItemDelete
   * @apiGroup Budget
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
      await controllers.BudgetCtrl.deleteBudget({
        auditApiCallUuid: req.auditApiCallUuid,
        budgetUuid: req.params.uuid,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
