const { body } = require('express-validator/check');
const post = require('./post');

module.exports = (router, app) => {
  const Validator = app.get('Validator');

  router.route('/login/token')
    .post([
      body([['data', 'attributes', 'token']], 'No token provided.').not().isEmpty(),
    ], Validator.validateRequest(), post(app));
};
