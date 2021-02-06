const { body } = require('express-validator');
const postFn = require('./post');
const routeItem = require('./item');
const routeLogin = require('./login');

module.exports = (router, app) => {
  const Auditor = app.get('Auditor');
  const Validator = app.get('Validator');

  router.route('/')
    .post(
      [
        body([['data', 'attributes', 'email']], 'Email address is required.').not().isEmpty(),
        body([['data', 'attributes', 'email']], 'Please enter a valid email address.').isEmail(),
        body([['data', 'attributes', 'first-name']], 'First name is required.').not().isEmpty(),
        body([['data', 'attributes', 'last-name']], 'Last name is required.').not().isEmpty(),
        body([['data', 'attributes', 'password']], 'Passwords must be a minimum of 8 characters.').isLength({
          min: 8,
        }),
      ],
      Validator.validateRequest(),
      Auditor.trackApiCall(),
      postFn(app),
    );

  routeLogin(router, app);

  routeItem(router, app);

  return router;
};
