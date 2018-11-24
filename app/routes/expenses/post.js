module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /expenses
   * @apiName ExpensePost
   * @apiGroup Expense
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {integer} data.attributes[amount-cents]
   * @apiParam {string} data.attributes.date
   * @apiParam {string} data.attributes.description
   * @apiParam {integer} data.attributes[reimbursed-cents]
   * @apiParam {object} data.relationships
   * @apiParam {object} data.relationships.category
   * @apiParam {object} data.relationships.category.data
   * @apiParam {string} data.relationships.category.data.id
   * @apiParam {object} data.relationships.vendor
   * @apiParam {object} data.relationships.vendor.data
   * @apiParam {string} data.relationships.vendor.data.id
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 422 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "source": {
   *          "pointer": "/data/attributes/amount-cents",
   *        },
   *        "detail": "Amount is required.",
   *      }]
   *    }
   */
  return async(req, res, next) => {
    try {
      const expenseUuid = await controllers.ExpenseCtrl.createExpense({
        amountCents: req.body.data.attributes['amount-cents'],
        auditApiCallUuid: req.auditApiCallUuid,
        categoryUuid: req.body.data.relationships.category.data.id,
        date: req.body.data.attributes.date,
        description: req.body.data.attributes.description,
        reimbursedCents: req.body.data.attributes['reimbursed-cents'],
        vendorUuid: req.body.data.relationships.vendor.data.id,
      });

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
          attributes: ['name', 'uuid'],
          model: models.Category,
          required: true,
        }, {
          attributes: ['name', 'uuid'],
          model: models.Vendor,
          required: true,
        }],
        where: {
          uuid: expenseUuid,
        },
      });

      return res.status(201).json({
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
          'id': expenseUuid,
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
