const getFn = require('./get');

module.exports = (router, app) => {
  const Authentication = app.get('Authentication');

  router.route('/')
    .get(
      Authentication.UserAuth.can('access-account'),
      getFn(app),
    );

  return router;
};
