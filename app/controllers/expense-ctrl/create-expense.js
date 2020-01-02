const moment = require('moment');
const Sequelize = require('sequelize');
const _ = require('lodash');

const { ExpenseError } = require('../../middleware/error-handler/');

/**
 * @param {integer} amountCents
 * @param {string} auditApiCallUuid
 * @param {string} date
 * @param {string} description
 * @param {object} expenseCtrl Instance of ExpenseCtrl
 * @param {string} householdMemberUuid
 * @param {integer} reimbursedCents
 * @param {string} subcategoryUuid
 * @param {string} vendorUuid
 */
module.exports = async({
  amountCents,
  auditApiCallUuid,
  date,
  description,
  expenseCtrl,
  householdMemberUuid,
  reimbursedCents,
  subcategoryUuid,
  vendorUuid,
}) => {
  const controllers = expenseCtrl.parent;
  const models = expenseCtrl.models;
  if (!subcategoryUuid) {
    throw new ExpenseError('Category is required');
  } else if (!vendorUuid) {
    throw new ExpenseError('Vendor is required');
  } else if (!householdMemberUuid) {
    throw new ExpenseError('Household member is required');
  } else if (!moment.utc(date).isValid()) {
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

  // Validate subcategory belongs to household.
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

  // Validate household member belongs to household.
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

  const newExpense = models.Expense.build({
    amount_cents: parseInt(amountCents, 10),
    date: moment.utc(date).format('YYYY-MM-DD'),
    description,
    household_member_uuid: householdMember.get('uuid'),
    reimbursed_cents: parseInt(reimbursedCents, 10),
    subcategory_uuid: subcategory.get('uuid'),
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
