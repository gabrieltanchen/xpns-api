const {
  CategoryError,
  ExpenseError,
  HouseholdError,
  VendorError,
} = require('../../middleware/error-handler');

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
   * @apiSuccess (200) {integer} data.expenses[].attributes.amount
   * @apiSuccess (200) {string} data.expenses[].attributes[created-at]
   * @apiSuccess (200) {string} data.expenses[].attributes.date
   * @apiSuccess (200) {string} data.expenses[].attributes.description
   * @apiSuccess (200) {integer} data.expenses[].attributes[reimbursed-amount]
   * @apiSuccess (200) {string} data.expenses[].id
   * @apiSuccess (200) {object} data.expenses[].relationships
   * @apiSuccess (200) {object} data.expenses[].relationships[household-member]
   * @apiSuccess (200) {object} data.expenses[].relationships[household-member].data
   * @apiSuccess (200) {string} data.expenses[].relationships[household-member].data.id
   * @apiSuccess (200) {object} data.expenses[].relationships.subcategory
   * @apiSuccess (200) {object} data.expenses[].relationships.subcategory.data
   * @apiSuccess (200) {string} data.expenses[].relationships.subcategory.data.id
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
        expenseWhere.subcategory_uuid = subcategory.get('uuid');
      } else if (req.query.household_member_id) {
        const householdMember = await models.HouseholdMember.findOne({
          attributes: ['uuid'],
          where: {
            household_uuid: user.get('household_uuid'),
            uuid: req.query.household_member_id,
          },
        });
        if (!householdMember) {
          throw new HouseholdError('Not found');
        }
        expenseWhere.household_member_uuid = householdMember.get('uuid');
      } else if (req.query.vendor_id) {
        const vendor = await models.Vendor.findOne({
          attributes: ['uuid'],
          where: {
            household_uuid: user.get('household_uuid'),
            uuid: req.query.vendor_id,
          },
        });
        if (!vendor) {
          throw new VendorError('Not found');
        }
        expenseWhere.vendor_uuid = vendor.get('uuid');
      } else {
        throw new ExpenseError('No open queries');
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
        limit,
        offset,
        order: [['date', 'DESC']],
        where: expenseWhere,
      });

      const included = [];
      const subcategoryIds = [];
      const householdMemberIds = [];
      const vendorIds = [];
      expenses.rows.forEach((expense) => {
        if (!subcategoryIds.includes(expense.Subcategory.get('uuid'))) {
          subcategoryIds.push(expense.Subcategory.get('uuid'));
          included.push({
            'attributes': {
              'name': expense.Subcategory.get('name'),
            },
            'id': expense.Subcategory.get('uuid'),
            'type': 'subcategories',
          });
        }
        if (!householdMemberIds.includes(expense.HouseholdMember.get('uuid'))) {
          householdMemberIds.push(expense.HouseholdMember.get('uuid'));
          included.push({
            'attributes': {
              'name': expense.HouseholdMember.get('name'),
            },
            'id': expense.HouseholdMember.get('uuid'),
            'type': 'household-members',
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
              'amount': expense.get('amount_cents'),
              'created-at': expense.get('created_at'),
              'date': expense.get('date'),
              'description': expense.get('description'),
              'reimbursed-amount': expense.get('reimbursed_cents'),
            },
            'id': expense.get('uuid'),
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
