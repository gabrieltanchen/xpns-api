const patch = require('./patch');

module.exports = (router, app) => {
  const Authentication = app.get('Authentication');

  router.route('/:uuid')
    .patch(Authentication.UserAuth.can('access-account'), patch(app));
};
