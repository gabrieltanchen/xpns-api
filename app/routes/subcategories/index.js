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
        body([['data', 'attributes', 'name']], 'Subcategory name is required.').not().isEmpty(),
        body([['data', 'relationships', 'category', 'data', 'id']], 'Parent category is required.').not().isEmpty(),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      postFn(app),
    );

  return router;
};
