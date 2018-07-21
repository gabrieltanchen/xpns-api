const { body } = require('express-validator/check');
const post = require('./post');

module.exports = (router, app) => {
  const Auditor = app.get('Auditor');
  const Authentication = app.get('Authentication');
  const Validator = app.get('Validator');

  router.route('/')
    .post(Authentication.UserAuth.can('access-account'), [
      body([['data', 'attributes', 'name']], 'Category name is required.').not().isEmpty(),
    ], Validator.validateRequest(), Auditor.trackApiCall(), post(app));

  return router;
};
