const { body } = require('express-validator');
const getFn = require('./get');
const postFn = require('./post');
const routeItem = require('./item');

module.exports = (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  router.route('/')
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    )
    .post(
      Authentication.UserAuth.can('access-account'),
      [
        body([['data', 'attributes', 'amount']], 'Budget is required.').not().isEmpty(),
        body([['data', 'attributes', 'amount']], 'Budget must be an integer.').isWhitelisted('0123456789'),
        body([['data', 'attributes', 'month']], 'Month is required.').not().isEmpty(),
        body([['data', 'attributes', 'month']], 'Month must be an integer.').isWhitelisted('0123456789'),
        body([['data', 'attributes', 'year']], 'Year is required.').not().isEmpty(),
        body([['data', 'attributes', 'year']], 'Year must be an integer.').isWhitelisted('0123456789'),
        body([['data', 'relationships', 'subcategory', 'data', 'id']], 'Subcategory is required.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      postFn(app),
    );

  routeItem(router, app);

  return router;
};
