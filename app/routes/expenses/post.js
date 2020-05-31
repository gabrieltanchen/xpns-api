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
   * @apiParam {integer} data.attributes.amount
   * @apiParam {string} data.attributes.date
   * @apiParam {string} data.attributes.description
   * @apiParam {integer} data.attributes[reimbursed-amount]
   * @apiParam {object} data.relationships
   * @apiParam {object} data.relationships[household-member]
   * @apiParam {object} data.relationships[household-member].data
   * @apiParam {string} data.relationships[household-member].data.id
   * @apiParam {object} data.relationships.subcategory
   * @apiParam {object} data.relationships.subcategory.data
   * @apiParam {string} data.relationships.subcategory.data.id
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
        amount: req.body.data.attributes.amount,
        auditApiCallUuid: req.auditApiCallUuid,
        date: req.body.data.attributes.date,
        description: req.body.data.attributes.description,
        householdMemberUuid: req.body.data.relationships['household-member'].data.id,
        reimbursedAmount: req.body.data.attributes['reimbursed-amount'],
        subcategoryUuid: req.body.data.relationships.subcategory.data.id,
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
          model: models.HouseholdMember,
          required: true,
        }, {
          attributes: ['name', 'uuid'],
          model: models.Subcategory,
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
            'amount': expense.get('amount_cents'),
            'created-at': expense.get('created_at'),
            'date': expense.get('date'),
            'description': expense.get('description'),
            'reimbursed-amount': expense.get('reimbursed_cents'),
          },
          'id': expenseUuid,
          'relationships': {
            'household-member': {
              'data': {
                'id': expense.HouseholdMember.get('uuid'),
                'type': 'household-members',
              },
            },
            'subcategory': {
              'data': {
                'id': expense.Subcategory.get('uuid'),
                'type': 'subcategories',
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
