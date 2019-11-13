// const { body } = require('express-validator');
const getFn = require('./get');

module.exports = (router, app) => {
  const Authentication = app.get('Authentication');

  return router.route('/:uuid')
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    );
};
