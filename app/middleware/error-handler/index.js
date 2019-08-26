const errorCodes = {
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  LOGIN_PASSWORD_FAILED: 'LOGIN_PASSWORD_FAILED',
};
const errorResponses = {
  [errorCodes.CATEGORY_NOT_FOUND]: {
    message: 'Category not found.',
    status: 404,
  },
  [errorCodes.LOGIN_PASSWORD_FAILED]: {
    message: 'Invalid email/password combination.',
    status: 403,
  },
};

module.exports = {
  ...errorCodes,
  middleware(err, req, res, next) {
    if (err
        && err.code
        && Object.keys(errorResponses).includes(err.code)
        && errorResponses[err.code].message
        && errorResponses[err.code].status) {
      const logger = req.app.get('logger');
      logger.error('Error:', err);
      return res.status(errorResponses[err.code].status).json({
        errors: [{
          detail: errorResponses[err.code].message,
        }],
      });
    }

    return next(err);
  },
};
