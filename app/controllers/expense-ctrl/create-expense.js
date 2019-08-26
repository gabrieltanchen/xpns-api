const moment = require('moment');
const Sequelize = require('sequelize');
const _ = require('lodash');

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
    throw new Error('Category is required.');
  } else if (!vendorUuid) {
    throw new Error('Vendor is required.');
  } else if (!moment(date).isValid()) {
    throw new Error('Invalid date.');
  } else if (isNaN(parseInt(amountCents, 10))) {
    throw new Error('Invalid amount.');
  } else if (isNaN(parseInt(reimbursedCents, 10))) {
    throw new Error('Invalid reimbursed amount.');
  } else if (!_.isString(description)) {
    throw new Error('Invalid description.');
  }

  const apiCall = await models.Audit.ApiCall.findOne({
    attributes: ['user_uuid', 'uuid'],
    where: {
      uuid: auditApiCallUuid,
    },
  });
  if (!apiCall || !apiCall.get('user_uuid')) {
    throw new Error('Unauthorized');
  }

  const user = await models.User.findOne({
    attributes: ['household_uuid', 'uuid'],
    where: {
      uuid: apiCall.get('user_uuid'),
    },
  });
  if (!user) {
    throw new Error('Unauthorized');
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
    throw new Error('Not found');
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
    throw new Error('Not found');
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
