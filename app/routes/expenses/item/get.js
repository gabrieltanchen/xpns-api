module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /expenses/:uuid
   * @apiName ExpenseItemGet
   * @apiGroup Expense
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {decimal} data.attributes.amount
   * @apiSuccess (200) {integer} data.attributes[amount-cents]
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.date
   * @apiSuccess (200) {string} data.attributes.description
   * @apiSuccess (200) {decimal} data.attributes[reimbursed-amount]
   * @apiSuccess (200) {integer} data.attributes[reimbursed-cents]
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {object} data.relationships
   * @apiSuccess (200) {object} data.relationships.category
   * @apiSuccess (200) {object} data.relationships.category.data
   * @apiSuccess (200) {string} data.relationships.category.data.id
   * @apiSuccess (200) {object} data.relationships
   * @apiSuccess (200) {object} data.relationships.vendor
   * @apiSuccess (200) {object} data.relationships.vendor.data
   * @apiSuccess (200) {string} data.relationships.vendor.data.id
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

      const expense = await models.Expense.findOne({
        attributes: [
          'amount_cents',
          'created_at',
          'date',
          'description',
          'reimbursed_cents',
          'uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.Category,
          required: true,
          where: {
            household_uuid: user.get('household_uuid'),
          },
        }, {
          attributes: ['uuid'],
          model: models.Vendor,
          required: true,
          where: {
            household_uuid: user.get('household_uuid'),
          },
        }],
        where: {
          uuid: req.params.uuid,
        },
      });
      if (!expense) {
        throw new Error('Not found');
      }

      return res.status(200).json({
        'data': {
          'attributes': {
            'amount': parseFloat(expense.get('amount_cents') / 100),
            'amount-cents': expense.get('amount_cents'),
            'created-at': expense.get('created_at'),
            'date': expense.get('date'),
            'description': expense.get('description'),
            'reimbursed-amount': parseFloat(expense.get('reimbursed_cents') / 100),
            'reimbursed-cents': expense.get('reimbursed_cents'),
          },
          'id': expense.get('uuid'),
          'relationships': {
            'category': {
              'data': {
                'id': expense.Category.get('uuid'),
                'type': 'categories',
              },
            },
            'vendor': {
              'data': {
                'id': expense.Vendor.get('uuid'),
                'type': 'vendors',
              },
            },
          },
          'type': 'expenses',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};