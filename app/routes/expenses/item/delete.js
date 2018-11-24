module.exports = (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {delete} /expenses/:uuid
   * @apiName ExpenseItemDelete
   * @apiGroup Expense
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
      await controllers.ExpenseCtrl.deleteExpense({
        auditApiCallUuid: req.auditApiCallUuid,
        expenseUuid: req.params.uuid,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
