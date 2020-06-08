const { BudgetError, CategoryError } = require('../../middleware/error-handler');

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

      const budgetWhere = {};
      if (req.query.month) {
        if (isNaN(parseInt(req.query.month, 10))
            || parseInt(req.query.month, 10) < 0
            || parseInt(req.query.month, 10) > 11) {
          throw new BudgetError('Invalid month');
        }
        budgetWhere.month = parseInt(req.query.month, 10);
      }
      if (req.query.year) {
        if (isNaN(parseInt(req.query.year, 10))
            || parseInt(req.query.year, 10) < 2000
            || parseInt(req.query.year, 10) > 2050) {
          throw new BudgetError('Invalid year');
        }
        budgetWhere.year = parseInt(req.query.year, 10);
      }
      if (req.query.subcategory_id) {
        const subcategory = await models.Subcategory.findOne({
          attributes: ['uuid'],
          include: [{
            attributes: ['uuid'],
            model: models.Category,
            required: true,
            where: {
              household_uuid: user.get('household_uuid'),
            },
          }],
          where: {
            uuid: req.query.subcategory_id,
          },
        });
        if (!subcategory) {
          throw new CategoryError('Not found');
        }
        budgetWhere.subcategory_uuid = subcategory.get('uuid');
      }

      const budgets = await models.Budget.findAndCountAll({
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
        limit,
        offset,
        order: [['year', 'DESC'], ['month', 'DESC']],
        where: budgetWhere,
      });

      const included = [];
      const subcategoryIds = [];
      budgets.rows.forEach((budget) => {
        if (!subcategoryIds.includes(budget.Subcategory.get('uuid'))) {
          subcategoryIds.push(budget.Subcategory.get('uuid'));
          included.push({
            'attributes': {
              'name': budget.Subcategory.get('name'),
            },
            'id': budget.Subcategory.get('uuid'),
            'type': 'subcategories',
          });
        }
      });

      return res.status(200).json({
        'data': budgets.rows.map((budget) => {
          return {
            'attributes': {
              'budget': parseFloat(budget.get('budget_cents') / 100),
              'budget-cents': budget.get('budget_cents'),
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
          };
        }),
        'included': included,
        'meta': {
          'pages': Math.ceil(budgets.count / limit),
          'total': budgets.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
