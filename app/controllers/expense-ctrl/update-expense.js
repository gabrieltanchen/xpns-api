const moment = require('moment');
const Sequelize = require('sequelize');
const _ = require('lodash');

const { ExpenseError } = require('../../middleware/error-handler');

/**
 * @param {integer} amount
 * @param {string} auditApiCallUuid
 * @param {string} date
 * @param {string} description
 * @param {object} expenseCtrl Instance of ExpenseCtrl
 * @param {string} expenseUuid
 * @param {string} householdMemberUuid
 * @param {integer} reimbursedAmount
 * @param {string} subcategoryUuid
 * @param {string} vendorUuid
 */
module.exports = async({
  amount,
  auditApiCallUuid,
  date,
  description,
  expenseCtrl,
  expenseUuid,
  householdMemberUuid,
  reimbursedAmount,
  subcategoryUuid,
  vendorUuid,
}) => {
  const controllers = expenseCtrl.parent;
  const models = expenseCtrl.models;
  if (!expenseUuid) {
    throw new ExpenseError('Expense is required');
  } else if (!subcategoryUuid) {
    throw new ExpenseError('Category is required');
  } else if (!vendorUuid) {
    throw new ExpenseError('Vendor is required');
  } else if (!householdMemberUuid) {
    throw new ExpenseError('Household member is required');
  } else if (!moment.utc(date).isValid()) {
    throw new ExpenseError('Invalid date');
  } else if (isNaN(parseInt(amount, 10))) {
    throw new ExpenseError('Invalid amount');
  } else if (isNaN(parseInt(reimbursedAmount, 10))) {
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

  const expense = await models.Expense.findOne({
    attributes: [
      'amount_cents',
      'date',
      'description',
      'household_member_uuid',
      'reimbursed_cents',
      'subcategory_uuid',
      'uuid',
      'vendor_uuid',
    ],
    include: [{
      attributes: ['uuid'],
      model: models.HouseholdMember,
      required: true,
      where: {
        household_uuid: user.get('household_uuid'),
      },
    }, {
      attributes: ['uuid'],
      include: [{
        attributes: ['uuid'],
        model: models.Category,
        required: true,
        where: {
          household_uuid: user.get('household_uuid'),
        },
      }],
      model: models.Subcategory,
      required: true,
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

  if (expense.get('amount_cents') !== parseInt(amount, 10)) {
    expense.set('amount_cents', parseInt(amount, 10));
  }
  if (moment(expense.get('date')).format('YYYY-MM-DD') !== moment.utc(date).format('YYYY-MM-DD')) {
    expense.set('date', moment.utc(date).format('YYYY-MM-DD'));
  }
  if (expense.get('description') !== description) {
    expense.set('description', description);
  }
  if (expense.get('reimbursed_cents') !== parseInt(reimbursedAmount, 10)) {
    expense.set('reimbursed_cents', parseInt(reimbursedAmount, 10));
  }

  // Validate subcategory UUID.
  if (subcategoryUuid !== expense.get('subcategory_uuid')) {
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
        uuid: subcategoryUuid,
      },
    });
    if (!subcategory) {
      throw new ExpenseError('Category not found');
    }
    expense.set('subcategory_uuid', subcategory.get('uuid'));
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
      throw new ExpenseError('Vendor not found');
    }
    expense.set('vendor_uuid', vendor.get('uuid'));
  }

  if (householdMemberUuid !== expense.get('household_member_uuid')) {
    const householdMember = await models.HouseholdMember.findOne({
      attributes: ['uuid'],
      where: {
        household_uuid: user.get('household_uuid'),
        uuid: householdMemberUuid,
      },
    });
    if (!householdMember) {
      throw new ExpenseError('Household member not found');
    }
    expense.set('household_member_uuid', householdMember.get('uuid'));
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
