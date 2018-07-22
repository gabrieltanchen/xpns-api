module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /categories/:uuid
   * @apiName CategoryItemPatch
   * @apiGroup Category
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.name
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {string} data.type
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
      await controllers.CategoryCtrl.updateCategory({
        auditApiCallUuid: req.auditApiCallUuid,
        categoryUuid: req.params.uuid,
        name: req.body.data.attributes.name,
      });

      const category = await models.Category.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: req.params.uuid,
        },
      });

      return res.status(200).json({
        'data': {
          'attributes': {
            'created-at': category.get('created_at'),
            'name': category.get('name'),
          },
          'id': category.get('uuid'),
          'type': 'categories',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
