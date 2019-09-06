const moment = require('moment');
const Sequelize = require('sequelize');
const _ = require('lodash');

const { ExpenseError } = require('../../middleware/error-handler/');

/**
 * @param {integer} amountCents
 * @param {string} auditApiCallUuid
 * @param {string} categoryUuid
 * @param {string} date
 * @param {string} description
 * @param {object} expenseCtrl Instance of ExpenseCtrl
 * @param {integer} reimbursedCents
 * @param {string} vendorUuid
 */
module.exports = async({
  amountCents,
  auditApiCallUuid,
  categoryUuid,
  date,
  description,
  expenseCtrl,
  reimbursedCents,
  vendorUuid,
}) => {
  const controllers = expenseCtrl.parent;
  const models = expenseCtrl.models;
  if (!categoryUuid) {
    throw new ExpenseError('Category is required');
  } else if (!vendorUuid) {
    throw new ExpenseError('Vendor is required');
  } else if (!moment(date).isValid()) {
    throw new ExpenseError('Invalid date');
  } else if (isNaN(parseInt(amountCents, 10))) {
    throw new ExpenseError('Invalid amount');
  } else if (isNaN(parseInt(reimbursedCents, 10))) {
    throw new ExpenseError('Invalid reimbursed amount');
  } else if (!_.isString(description)) {
    throw new ExpenseError('Invalid description');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new ExpenseError('Missing audit API call');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new ExpenseError('Audit user does not exist');
  }

  // Validate category belongs to household.
  const category = await models.Category.findOne({
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: categoryUuid,
    },
  });
  if (!category) {
    throw new ExpenseError('Category not found');
  }

  // Validate vendor belongs to household.
  const vendor = await models.Vendor.findOne({
    attributes: ['uuid'],
    where: {
      household_uuid: user.get('household_uuid'),
      uuid: vendorUuid,
    },
  });
  if (!vendor) {
    throw new ExpenseError('Vendor not found');
  }

  const newExpense = models.Expense.build({
    amount_cents: parseInt(amountCents, 10),
    category_uuid: category.get('uuid'),
    date: moment(date).format('YYYY-MM-DD'),
    description,
    reimbursed_cents: parseInt(reimbursedCents, 10),
    vendor_uuid: vendor.get('uuid'),
  });

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await newExpense.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [newExpense],
      transaction,
    });
  });

  return newExpense.get('uuid');
};
