const { body } = require('express-validator/check');
const post = require('./post');
const routeLoginToken = require('./token/');

module.exports = (router, app) => {
  const Validator = app.get('Validator');

  router.route('/login')
    .get((req, res) => {
      return res.sendStatus(501);
    })
    .post([
      body([['data', 'attributes', 'email']], 'Email address is required.').not().isEmpty(),
      body([['data', 'attributes', 'email']], 'Please enter a valid email address.').isEmail(),
      body([['data', 'attributes', 'password']], 'Passwords must be a minimum of 8 characters.').isLength({
        min: 8,
      }),
    ], Validator.validateRequest(), post(app));

  routeLoginToken(router, app);
};
