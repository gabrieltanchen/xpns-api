module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /expenses/:uuid
   * @apiName ExpenseItemPatch
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
      await controllers.ExpenseCtrl.updateExpense({
        amountCents: req.body.data.attributes['amount-cents'],
        auditApiCallUuid: req.auditApiCallUuid,
        categoryUuid: req.body.data.relationships.category.data.id,
        date: req.body.data.attributes.date,
        description: req.body.data.attributes.description,
        expenseUuid: req.params.uuid,
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
          uuid: req.params.uuid,
        },
      });

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
