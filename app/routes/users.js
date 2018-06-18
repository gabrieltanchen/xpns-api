module.exports = (router, app) => {
  router.route('/')
    .post(async(req, res) => {
      return res.sendStatus(501);
    });

  return router;
};
