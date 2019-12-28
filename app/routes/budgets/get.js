module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /budgets
   * @apiName BudgetGet
   * @apiGroup Budget
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.budgets
   * @apiSuccess (200) {object} data.budgets[].attributes
   * @apiSuccess (200) {integer} data.budgets[].attributes[budget-cents]
   * @apiSuccess (200) {string} data.budgets[].attributes[created-at]
   * @apiSuccess (200) {integer} data.budgets[].attributes.month
   * @apiSuccess (200) {integer} data.budgets[].attributes.year
   * @apiSuccess (200) {string} data.budgets[].id
   * @apiSuccess (200) {object} data.budgets[].relationships
   * @apiSuccess (200) {object} data.budgets[].relationships.subcategory
   * @apiSuccess (200) {object} data.budgets[].relationships.subcategory.data
   * @apiSuccess (200) {string} data.budgets[].relationships.subcategory.data.id
   * @apiSuccess (200) {string} data.budgets[].type
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
      // Query params
      let limit = 25;
      if (req.query && req.query.limit) {
        limit = parseInt(req.query.limit, 10);
      }
      let offset = 0;
      if (req.query && req.query.page) {
        offset = limit * (parseInt(req.query.page, 10) - 1);
      }

      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
