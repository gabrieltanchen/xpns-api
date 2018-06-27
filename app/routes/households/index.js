const routeItem = require('./item/');

module.exports = (router, app) => {
  routeItem(router, app);

  return router;
};
