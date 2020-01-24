const AuditError = require('./audit-error');
const BudgetError = require('./budget-error');
const CategoryError = require('./category-error');
const ExpenseError = require('./expense-error');
const HouseholdError = require('./household-error');
const IncomeError = require('./income-error');
const LoginPasswordFailedError = require('./login-password-failed-error');
const UserError = require('./user-error');
const VendorError = require('./vendor-error');

const errorClasses = {
  AuditError,
  BudgetError,
  CategoryError,
  ExpenseError,
  HouseholdError,
  IncomeError,
  LoginPasswordFailedError,
  UserError,
  VendorError,
};

module.exports = {
  ...errorClasses,
  middleware(err, req, res, next) {
    if (err
        && Object.keys(errorClasses).includes(err.name)) {
      const logger = req.app.get('logger');
      logger.error('Error:', err);
      const { message, status } = err.getApiResponse();
      return res.status(status).json({
        errors: [{
          detail: message,
        }],
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({
        errors: [{
          detail: 'Unauthorized',
        }],
      });
    }

    return next(err);
  },
};
