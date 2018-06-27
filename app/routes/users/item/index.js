const get = require('./get');

module.exports = (router, app) => {
  const Authentication = app.get('Authentication');

  router.route('/:uuid')
    .get(Authentication.UserAuth.can('access-account'), get(app));
};
