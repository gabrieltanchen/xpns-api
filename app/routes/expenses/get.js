module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /expenses
   * @apiName ExpenseGet
   * @apiGroup Expense
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.expenses
   * @apiSuccess (200) {object} data.expenses[].attributes
   * @apiSuccess (200) {decimal} data.expenses[].attributes.amount
   * @apiSuccess (200) {integer} data.expenses[].attributes[amount-cents]
   * @apiSuccess (200) {string} data.expenses[].attributes[created-at]
   * @apiSuccess (200) {string} data.expenses[].attributes.date
   * @apiSuccess (200) {string} data.expenses[].attributes.description
   * @apiSuccess (200) {decimal} data.expenses[].attributes[reimbursed-amount]
   * @apiSuccess (200) {integer} data.expenses[].attributes[reimbursed-cents]
   * @apiSuccess (200) {string} data.expenses[].id
   * @apiSuccess (200) {object} data.expenses[].relationships
   * @apiSuccess (200) {object} data.expenses[].relationships.category
   * @apiSuccess (200) {object} data.expenses[].relationships.category.data
   * @apiSuccess (200) {string} data.expenses[].relationships.category.data.id
   * @apiSuccess (200) {object} data.expenses[].relationships
   * @apiSuccess (200) {object} data.expenses[].relationships.vendor
   * @apiSuccess (200) {object} data.expenses[].relationships.vendor.data
   * @apiSuccess (200) {string} data.expenses[].relationships.vendor.data.id
   * @apiSuccess (200) {string} data.expenses[].type
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

      const expenseWhere = {};
      if (req.query.category_uuid) {
        const category = await models.Category.findOne({
          attributes: ['uuid'],
          where: {
            household_uuid: user.get('household_uuid'),
            uuid: req.query.category_uuid,
          },
        });
        if (!category) {
          throw new Error('Not found');
        }
        expenseWhere.category_uuid = category.get('uuid');
      } else if (req.query.vendor_id) {
        const vendor = await models.Vendor.findOne({
          attributes: ['uuid'],
          where: {
            household_uuid: user.get('household_uuid'),
            uuid: req.query.vendor_id,
          },
        });
        if (!vendor) {
          throw new Error('Not found');
        }
        expenseWhere.vendor_uuid = vendor.get('uuid');
      } else {
        throw new Error('Category or vendor ID is required.');
      }

      const expenses = await models.Expense.findAndCountAll({
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
        limit,
        offset,
        order: [['date', 'ASC']],
        where: expenseWhere,
      });

      const included = [];
      const categoryIds = [];
      const vendorIds = [];
      expenses.rows.forEach((expense) => {
        if (!categoryIds.includes(expense.Category.get('uuid'))) {
          categoryIds.push(expense.Category.get('uuid'));
          included.push({
            'attributes': {
              'name': expense.Category.get('name'),
            },
            'id': expense.Category.get('uuid'),
            'type': 'categories',
          });
        }
        if (!vendorIds.includes(expense.Vendor.get('uuid'))) {
          vendorIds.push(expense.Vendor.get('uuid'));
          included.push({
            'attributes': {
              'name': expense.Vendor.get('name'),
            },
            'id': expense.Vendor.get('uuid'),
            'type': 'vendors',
          });
        }
      });

      return res.status(200).json({
        'data': expenses.rows.map((expense) => {
          return {
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
          };
        }),
        'included': included,
        'meta': {
          'pages': Math.ceil(expenses.count / limit),
          'total': expenses.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
