const CategoryError = require('./category-error');
const ExpenseError = require('./expense-error');
const LoginPasswordFailedError = require('./login-password-failed-error');
const VendorNotFoundError = require('./vendor-not-found-error');

const errorClasses = {
  CategoryError,
  ExpenseError,
  LoginPasswordFailedError,
  VendorNotFoundError,
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
