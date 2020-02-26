const moment = require('moment');
const Sequelize = require('sequelize');

const Op = Sequelize.Op;

module.exports = (app) => {
  const models = app.get('models');

  return async(req, res, next) => {
    try {
      const [year, month] = req.params.uuid.split('-');
      if (isNaN(parseInt(year, 10))
          || parseInt(year, 10) < 2000
          || parseInt(year, 10) > 2050) {
        return new Error('Invalid year provided');
      }
      if (isNaN(parseInt(month, 10))
          || parseInt(month, 10) < 0
          || parseInt(month, 10) > 11) {
        return new Error('Invalid month provided');
      }

      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });
      if (!user) {
        throw new Error('Unauthorized');
      }

      const fromDate = moment([year, month]);
      const toDate = fromDate.clone().add(1, 'M');

      const [budgetSum, incomeSum, amountSum, reimbursedSum] = await Promise.all([
        models.Budget.sum('budget_cents', {
          where: {
            [Op.and]: [
              {
                month,
                year,
              },
              Sequelize.literal(`
                EXISTS (
                  SELECT *
                    FROM subcategories
                    INNER JOIN categories
                    ON subcategories.category_uuid = categories.uuid
                    AND categories.household_uuid = '${user.get('household_uuid')}'
                    WHERE subcategories.uuid = "Budget"."subcategory_uuid"
                )
              `),
            ],
          },
        }),
        models.Income.sum('amount_cents', {
          where: {
            [Op.and]: [
              {
                date: {
                  [Op.lt]: toDate.format('YYYY-MM-DD'),
                  [Op.gte]: fromDate.format('YYYY-MM-DD'),
                },
              },
              Sequelize.literal(`
                EXISTS (
                  SELECT *
                    FROM household_members
                    WHERE household_members.uuid = "Income"."household_member_uuid"
                    AND household_members.household_uuid = '${user.get('household_uuid')}'
                )
              `),
            ],
          },
        }),
        models.Expense.sum('amount_cents', {
          where: {
            [Op.and]: [
              {
                date: {
                  [Op.lt]: toDate.format('YYYY-MM-DD'),
                  [Op.gte]: fromDate.format('YYYY-MM-DD'),
                },
              },
              Sequelize.literal(`
                EXISTS (
                  SELECT *
                    FROM subcategories
                    INNER JOIN categories
                    ON subcategories.category_uuid = categories.uuid
                    AND categories.household_uuid = '${user.get('household_uuid')}'
                    WHERE subcategories.uuid = "Expense"."subcategory_uuid"
                )
              `),
            ],
          },
        }),
        models.Expense.sum('reimbursed_cents', {
          where: {
            [Op.and]: [
              {
                date: {
                  [Op.lt]: toDate.format('YYYY-MM-DD'),
                  [Op.gte]: fromDate.format('YYYY-MM-DD'),
                },
              },
              Sequelize.literal(`
                EXISTS (
                  SELECT *
                    FROM subcategories
                    INNER JOIN categories
                    ON subcategories.category_uuid = categories.uuid
                    AND categories.household_uuid = '${user.get('household_uuid')}'
                    WHERE subcategories.uuid = "Expense"."subcategory_uuid"
                )
              `),
            ],
          },
        }),
      ]);

      return res.status(200).json({
        'data': {
          'attributes': {
            'actual-cents': amountSum - reimbursedSum,
            'budget-cents': budgetSum,
            'income-cents': incomeSum,
          },
          'id': req.params.uuid,
          'type': 'monthly-reports',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
