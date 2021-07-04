const { body } = require('express-validator');
const getFn = require('./get');
const patchFn = require('./patch');

module.exports = (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  router.route('/:uuid')
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    )
    .patch(
      Authentication.UserAuth.can('access-account'),
      [
        body([['data', 'attributes', 'name']], 'Fund name is required.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      patchFn(app),
    );
};
