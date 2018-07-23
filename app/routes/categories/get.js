module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /categories
   * @apiName CategoryGet
   * @apiGroup Category
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.categories
   * @apiSuccess (200) {object} data.categories[].attributes
   * @apiSuccess (200) {string} data.categories[].attributes[created-at]
   * @apiSuccess (200) {string} data.categories[].attributes.name
   * @apiSuccess (200) {string} data.categories[].id
   * @apiSuccess (200) {string} data.categories[].type
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 401 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "detail": "Unauthorized",
   *      }],
   *    }
   */
  return async(req, res, next) => {
    try {
      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });


    } catch (err) {
      return next(err);
    }
  };
};
