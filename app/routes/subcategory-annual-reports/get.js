const Sequelize = require('sequelize');

const Op = Sequelize.Op;

const { CategoryError } = require('../../middleware/error-handler/');

module.exports = (app) => {
  const models = app.get('models');

  return async(req, res, next) => {
    try {
      if (!req.query.subcategory_uuid) {
        throw new CategoryError('Category is required');
      }

      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });

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
          uuid: req.query.subcategory_uuid,
        },
      });
      if (!subcategory) {
        throw new CategoryError('Not found');
      }

      const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

      const budgetYears = (await models.Budget.findAll({
        attributes: [
          [Sequelize.literal('DISTINCT("Budget"."year")'), 'year'],
        ],
        order: [['year', 'ASC']],
        where: {
          subcategory_uuid: subcategory.get('uuid'),
        },
      })).map((budgetYear) => {
        return parseInt(budgetYear.get('year'), 10);
      });
      const expenseYears = (await models.Expense.findAll({
        attributes: [
          [Sequelize.literal('EXTRACT(YEAR FROM "Expense"."date")'), 'year'],
        ],
        group: ['year'],
        order: [[Sequelize.literal('year ASC')]],
        where: {
          subcategory_uuid: subcategory.get('uuid'),
        },
      })).map((expenseYear) => {
        return parseInt(expenseYear.get('year'), 10);
      });
      const years = [...new Set([...budgetYears, ...expenseYears])];

      const yearReports = await Promise.all(years.map(async(year) => {
        const monthReports = await Promise.all(months.map(async(month) => {
          console.log('')
          return {
            budget: await models.Budget.findOne({
              attributes: ['budget_cents'],
              where: {
                month,
                subcategory_uuid: subcategory.get('uuid'),
                year,
              },
            }),
            month,
            expenseSum: await models.Expense.findAll({
              attributes: [
                [Sequelize.fn('sum', Sequelize.col('Expense.amount_cents')), 'amount_cents'],
                [Sequelize.fn('sum', Sequelize.col('Expense.reimbursed_cents')), 'reimbursed_cents'],
              ],
              where: {
                subcategory_uuid: subcategory.get('uuid'),
                [Op.and]: [
                  Sequelize.literal(`EXTRACT(YEAR FROM "Expense"."date") = ${year}`),
                  Sequelize.literal(`EXTRACT(MONTH FROM "Expense"."date") = ${(month + 1)}`),
                ],
              },
            }),
          };
        }));

        return {
          apr_actual_cents: monthReports[3].expenseSum[0].get('amount_cents') - monthReports[3].expenseSum[0].get('reimbursed_cents'),
          apr_budget_cents: monthReports[3].budget ? monthReports[3].budget.get('budget_cents') : 0,
          aug_actual_cents: monthReports[7].expenseSum[0].get('amount_cents') - monthReports[7].expenseSum[0].get('reimbursed_cents'),
          aug_budget_cents: monthReports[7].budget ? monthReports[7].budget.get('budget_cents') : 0,
          dec_actual_cents: monthReports[11].expenseSum[0].get('amount_cents') - monthReports[11].expenseSum[0].get('reimbursed_cents'),
          dec_budget_cents: monthReports[11].budget ? monthReports[11].budget.get('budget_cents') : 0,
          feb_actual_cents: monthReports[1].expenseSum[0].get('amount_cents') - monthReports[1].expenseSum[0].get('reimbursed_cents'),
          feb_budget_cents: monthReports[1].budget ? monthReports[1].budget.get('budget_cents') : 0,
          mar_actual_cents: monthReports[2].expenseSum[0].get('amount_cents') - monthReports[2].expenseSum[0].get('reimbursed_cents'),
          mar_budget_cents: monthReports[2].budget ? monthReports[2].budget.get('budget_cents') : 0,
          may_actual_cents: monthReports[4].expenseSum[0].get('amount_cents') - monthReports[4].expenseSum[0].get('reimbursed_cents'),
          may_budget_cents: monthReports[4].budget ? monthReports[4].budget.get('budget_cents') : 0,
          jan_actual_cents: monthReports[0].expenseSum[0].get('amount_cents') - monthReports[0].expenseSum[0].get('reimbursed_cents'),
          jan_budget_cents: monthReports[0].budget ? monthReports[0].budget.get('budget_cents') : 0,
          jul_actual_cents: monthReports[6].expenseSum[0].get('amount_cents') - monthReports[6].expenseSum[0].get('reimbursed_cents'),
          jul_budget_cents: monthReports[6].budget ? monthReports[6].budget.get('budget_cents') : 0,
          jun_actual_cents: monthReports[5].expenseSum[0].get('amount_cents') - monthReports[5].expenseSum[0].get('reimbursed_cents'),
          jun_budget_cents: monthReports[5].budget ? monthReports[5].budget.get('budget_cents') : 0,
          nov_actual_cents: monthReports[10].expenseSum[0].get('amount_cents') - monthReports[10].expenseSum[0].get('reimbursed_cents'),
          nov_budget_cents: monthReports[10].budget ? monthReports[10].budget.get('budget_cents') : 0,
          oct_actual_cents: monthReports[9].expenseSum[0].get('amount_cents') - monthReports[9].expenseSum[0].get('reimbursed_cents'),
          oct_budget_cents: monthReports[9].budget ? monthReports[9].budget.get('budget_cents') : 0,
          sep_actual_cents: monthReports[8].expenseSum[0].get('amount_cents') - monthReports[8].expenseSum[0].get('reimbursed_cents'),
          sep_budget_cents: monthReports[8].budget ? monthReports[8].budget.get('budget_cents') : 0,
          year,
        };
      }));

      return res.status(200).json({
        'data': yearReports.map((yearReport) => {
          return {
            'attributes': {
              'apr-actual-cents': parseInt(yearReport.apr_actual_cents, 10),
              'apr-budget-cents': parseInt(yearReport.apr_budget_cents, 10),
              'aug-actual-cents': parseInt(yearReport.aug_actual_cents, 10),
              'aug-budget-cents': parseInt(yearReport.aug_budget_cents, 10),
              'dec-actual-cents': parseInt(yearReport.dec_actual_cents, 10),
              'dec-budget-cents': parseInt(yearReport.dec_budget_cents, 10),
              'feb-actual-cents': parseInt(yearReport.feb_actual_cents, 10),
              'feb-budget-cents': parseInt(yearReport.feb_budget_cents, 10),
              'mar-actual-cents': parseInt(yearReport.mar_actual_cents, 10),
              'mar-budget-cents': parseInt(yearReport.mar_budget_cents, 10),
              'may-actual-cents': parseInt(yearReport.may_actual_cents, 10),
              'may-budget-cents': parseInt(yearReport.may_budget_cents, 10),
              'jan-actual-cents': parseInt(yearReport.jan_actual_cents, 10),
              'jan-budget-cents': parseInt(yearReport.jan_budget_cents, 10),
              'jul-actual-cents': parseInt(yearReport.jul_actual_cents, 10),
              'jul-budget-cents': parseInt(yearReport.jul_budget_cents, 10),
              'jun-actual-cents': parseInt(yearReport.jun_actual_cents, 10),
              'jun-budget-cents': parseInt(yearReport.jun_budget_cents, 10),
              'nov-actual-cents': parseInt(yearReport.nov_actual_cents, 10),
              'nov-budget-cents': parseInt(yearReport.nov_budget_cents, 10),
              'oct-actual-cents': parseInt(yearReport.oct_actual_cents, 10),
              'oct-budget-cents': parseInt(yearReport.oct_budget_cents, 10),
              'sep-actual-cents': parseInt(yearReport.sep_actual_cents, 10),
              'sep-budget-cents': parseInt(yearReport.sep_budget_cents, 10),
              'year': yearReport.year,
            },
            'id': `${subcategory.get('uuid')}-${yearReport.year}`,
            'type': 'subcategory-annual-reports',
          };
        }),
      });
    } catch (err) {
      return next(err);
    }
  };
};
