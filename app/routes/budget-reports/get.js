const moment = require('moment');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

module.exports = (app) => {
  const models = app.get('models');

  return async(req, res, next) => {
    try {
      let year = moment().year();
      if (req.query && req.query.year && !isNaN(parseInt(req.query.year, 10))) {
        year = parseInt(req.query.year, 10);
      }
      let month = moment().month();
      if (req.query && req.query.month && !isNaN(parseInt(req.query.month, 10))) {
        month = parseInt(req.query.month, 10);
      }
      if (year < 2000 || year > 2050) {
        return new Error('Invalid year provided');
      }
      if (month < 0 || month > 11) {
        return new Error('Invalid month provided');
      }

      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });

      const fromDate = moment([year, month]);
      const toDate = fromDate.clone().add(1, 'M');

      const subcategories = await models.Subcategory.findAll({
        attributes: [
          'name',
          'uuid',
          [Sequelize.fn('sum', Sequelize.col('Expenses.amount_cents')), 'expense_amount_cents'],
          [Sequelize.fn('sum', Sequelize.col('Expenses.reimbursed_cents')), 'reimbursed_cents'],
        ],
        group: ['Subcategory.uuid', 'Category.uuid', 'Budgets.uuid'],
        include: [{
          attributes: ['amount_cents', 'uuid'],
          model: models.Budget,
          required: false,
          where: {
            month,
            year,
          },
        }, {
          attributes: ['name', 'uuid'],
          model: models.Category,
          required: true,
          where: {
            household_uuid: user.get('household_uuid'),
          },
        }, {
          attributes: [],
          model: models.Expense,
          required: false,
          where: {
            date: {
              [Op.lt]: toDate.format('YYYY-MM-DD'),
              [Op.gte]: fromDate.format('YYYY-MM-DD'),
            },
          },
        }],
        order: [
          ['Category', 'name', 'ASC'],
          ['name', 'ASC'],
        ],
        where: {
          [Op.or]: [
            Sequelize.literal('"Expenses"."amount_cents" > 0'),
            Sequelize.literal('"Expenses"."reimbursed_cents" > 0'),
            Sequelize.literal('"Budgets"."amount_cents" > 0'),
          ],
        },
      });

      const included = [];
      const categoryIds = [];
      subcategories.forEach((subcategory) => {
        included.push({
          'attributes': {
            'name': subcategory.get('name'),
          },
          'id': subcategory.get('uuid'),
          'type': 'subcategories',
        });
        if (!categoryIds.includes(subcategory.Category.get('uuid'))) {
          categoryIds.push(subcategory.Category.get('uuid'));
          included.push({
            'attributes': {
              'name': subcategory.Category.get('name'),
            },
            'id': subcategory.Category.get('uuid'),
            'type': 'categories',
          });
        }
      });

      return res.status(200).json({
        'data': subcategories.map((subcategory) => {
          const amountCents = subcategory.get('expense_amount_cents') || 0;
          const reimbursedCents = subcategory.get('reimbursed_cents') || 0;
          const actualCents = amountCents - reimbursedCents;
          const budgetCents = subcategory.Budgets
            && subcategory.Budgets[0]
            && subcategory.Budgets[0].get('amount_cents')
            ? subcategory.Budgets[0].get('amount_cents')
            : 0;
          return {
            'attributes': {
              'actual': actualCents,
              'budget': budgetCents,
            },
            'id': `${subcategory.get('uuid')}-${year}-${month}`,
            'relationships': {
              'category': {
                'data': {
                  'id': subcategory.Category.get('uuid'),
                  'type': 'categories',
                },
              },
              'subcategory': {
                'data': {
                  'id': subcategory.get('uuid'),
                  'type': 'subcategories',
                },
              },
            },
            'type': 'budget-reports',
          };
        }),
        'included': included,
      });
    } catch (err) {
      return next(err);
    }
  };
};
