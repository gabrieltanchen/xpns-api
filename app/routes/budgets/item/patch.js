module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /budgets/:uuid
   * @apiName BudgetItemPatch
   * @apiGroup Budget
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {integer} data.attributes.amount
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {integer} data.attributes.month
   * @apiSuccess (200) {integer} data.attributes.year
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {object} data.relationships
   * @apiSuccess (200) {object} data.relationships.subcategory
   * @apiSuccess (200) {object} data.relationships.subcategory.data
   * @apiSuccess (200) {string} data.relatinoships.subcategory.data.id
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
      await controllers.BudgetCtrl.updateBudget({
        amount: req.body.data.attributes.amount,
        auditApiCallUuid: req.auditApiCallUuid,
        budgetUuid: req.params.uuid,
        month: req.body.data.attributes.month,
        subcategoryUuid: req.body.data.relationships.subcategory.data.id,
        year: req.body.data.attributes.year,
      });

      const budget = await models.Budget.findOne({
        attributes: [
          'amount_cents',
          'created_at',
          'month',
          'uuid',
          'year',
        ],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.Subcategory,
          required: true,
        }],
        where: {
          uuid: req.params.uuid,
        },
      });

      return res.status(200).json({
        'data': {
          'attributes': {
            'amount': budget.get('amount_cents'),
            'created-at': budget.get('created_at'),
            'month': budget.get('month'),
            'year': budget.get('year'),
          },
          'id': budget.get('uuid'),
          'relationships': {
            'subcategory': {
              'data': {
                'id': budget.Subcategory.get('uuid'),
                'type': 'subcategories',
              },
            },
          },
          'type': 'budgets',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
