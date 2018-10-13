const { body } = require('express-validator/check');
const postFn = require('./post');

module.exports = (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  router.route('/')
    .post(
      Authentication.UserAuth.can('access-account'),
      [
        body([['data', 'attributes', 'amount-cents']], 'Amount is required.').not().isEmpty(),
        body([['data', 'attributes', 'amount-cents']], 'Amount must be an integer.').isWhitelisted('0123456789'),
        body([['data', 'attributes', 'date']], 'Date is required.').not().isEmpty(),
        body([['data', 'attributes', 'date']], 'Date must be valid.').isISO8601(),
        body([['data', 'attributes', 'reimbursed-cents']], 'Reimbursed amount is required.').not().isEmpty(),
        body([['data', 'attributes', 'reimbursed-cents']], 'Reimbursed amount must be an integer.').isWhitelisted('0123456789'),
        body([['data', 'relationships', 'category', 'data', 'id']], 'Category is required.').not().isEmpty(),
        body([['data', 'relationships', 'vendor', 'data', 'id']], 'Vendor is required.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      postFn(app),
    );

  return router;
};