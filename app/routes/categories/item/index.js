const { body } = require('express-validator/check');
const patch = require('./patch');

module.exports = (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  router.route('/:uuid')
    .patch(Authentication.UserAuth.can('access-account'), [
      body([['data', 'attributes', 'name']], 'Category name is required.').not().isEmpty(),
    ], Validator.validateRequest(), Auditor.trackApiCall(), patch(app));
};
