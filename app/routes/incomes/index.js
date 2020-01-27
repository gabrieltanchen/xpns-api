const { body } = require('express-validator');
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
        body([['data', 'relationships', 'household-member', 'data', 'id']], 'Member is required.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      postFn(app),
    );

  return router;
};
