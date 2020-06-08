const { BudgetError } = require('../../../middleware/error-handler');

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /budgets/:uuid
   * @apiName BudgetItemGet
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
      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });
      if (!user) {
        throw new Error('Unauthorized');
      }

      const budget = await models.Budget.findOne({
        attributes: [
          'amount_cents',
          'created_at',
          'month',
          'uuid',
          'year',
        ],
        include: [{
          attributes: ['uuid'],
          include: [{
            attributes: ['uuid'],
            model: models.Category,
            required: true,
            where: {
              household_uuid: user.get('household_uuid'),
            },
          }],
          model: models.Subcategory,
          required: true,
        }],
        where: {
          uuid: req.params.uuid,
        },
      });
      if (!budget) {
        throw new BudgetError('Not found');
      }

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
