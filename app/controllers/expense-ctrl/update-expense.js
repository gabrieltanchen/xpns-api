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
 * @param {string} expenseUuid
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
  expenseUuid,
  reimbursedCents,
  vendorUuid,
}) => {
  const controllers = expenseCtrl.parent;
  const models = expenseCtrl.models;
  if (!expenseUuid) {
    throw new Error('Expense is required.');
  } else if (!categoryUuid) {
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

  const expense = await models.Expense.findOne({
    attributes: [
      'amount_cents',
      'category_uuid',
      'date',
      'description',
      'reimbursed_cents',
      'uuid',
      'vendor_uuid',
    ],
    include: [{
      attributes: ['uuid'],
      model: models.Category,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }, {
      attributes: ['uuid'],
      model: models.Vendor,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }],
    where: {
      uuid: expenseUuid,
    },
  });
  if (!expense) {
    throw new ExpenseError('Not found');
  }

  if (expense.get('amount_cents') !== parseInt(amountCents, 10)) {
    expense.set('amount_cents', parseInt(amountCents, 10));
  }
  if (moment(expense.get('date')).format('YYYY-MM-DD') !== moment(date).format('YYYY-MM-DD')) {
    expense.set('date', moment(date).format('YYYY-MM-DD'));
  }
  if (expense.get('description') !== description) {
    expense.set('description', description);
  }
  if (expense.get('reimbursed_cents') !== parseInt(reimbursedCents, 10)) {
    expense.set('reimbursed_cents', parseInt(reimbursedCents, 10));
  }

  // Validate category UUID.
  if (categoryUuid !== expense.get('category_uuid')) {
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
    expense.set('category_uuid', category.get('uuid'));
  }

  // Validate vendor UUID.
  if (vendorUuid !== expense.get('vendor_uuid')) {
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
    expense.set('vendor_uuid', vendor.get('uuid'));
  }

  if (expense.changed()) {
    await models.sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    }, async(transaction) => {
      await controllers.AuditCtrl.trackChanges({
        auditApiCallUuid,
        changeList: [expense],
        transaction,
      });
    });
  }
};
