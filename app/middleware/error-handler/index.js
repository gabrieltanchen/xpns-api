const CategoryNotFoundError = require('./category-not-found-error');
const LoginPasswordFailedError = require('./login-password-failed-error');

const errorClasses = {
  CategoryNotFoundError,
  LoginPasswordFailedError,
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

    return next(err);
  },
};
