module.exports = (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {delete} /categories/:uuid
   * @apiName CategoryItemDelete
   * @apiGroup Category
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
      await controllers.CategoryCtrl.deleteCategory({
        auditApiCallUuid: req.auditApiCallUuid,
        categoryUuid: req.params.uuid,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
