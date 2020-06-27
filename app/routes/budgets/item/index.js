const { body } = require('express-validator');
const deleteFn = require('./delete');
const getFn = require('./get');
const patchFn = require('./patch');

module.exports = (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  return router.route('/:uuid')
    .delete(
      Authentication.UserAuth.can('access-account'),
      Auditor.trackApiCall(),
      deleteFn(app),
    )
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    )
    .patch(
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
      patchFn(app),
    );
};
