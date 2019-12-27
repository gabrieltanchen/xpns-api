module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /budgets
   * @apiName BudgetPost
   * @apiGroup Budget
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {integer} data.attributes[budget-cents]
   * @apiParam {integer} data.attributes.month
   * @apiParam {integer} data.attributes.year
   * @apiParam {object} data.relationships
   * @apiParam {object} data.relationships.subcategory
   * @apiParam {object} data.relationships.subcategory.data
   * @apiParam {string} data.relationships.subcategory.data.id
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 422 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "source": {
   *          "pointer": "/data/attributes/budget-cents",
   *        },
   *        "detail": "Budget is required.",
   *      }]
   *    }
   */
  return async(req, res, next) => {
    try {
      const budgetUuid = await controllers.BudgetCtrl.createBudget({
        auditApiCallUuid: req.auditApiCallUuid,
        budgetCents: req.body.data.attributes['budget-cents'],
        month: req.body.data.attributes.month,
        subcategoryUuid: req.body.data.relationships.subcategory.data.id,
        year: req.body.data.attributes.year,
      });

      const budget = await models.Budget.findOne({
        attributes: [
          'budget_cents',
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
          uuid: budgetUuid,
        },
      });

      return res.status(201).json({
        'data': {
          'attributes': {
            'budget-cents': budget.get('budget_cents'),
            'created-at': budget.get('created_at'),
            'month': budget.get('month'),
            'year': budget.get('year'),
          },
          'id': budgetUuid,
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
