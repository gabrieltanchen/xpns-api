module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /categories
   * @apiName CategoryPost
   * @apiGroup Category
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {string} data.attributes.name
   * @apiParam {string} data.type
   *
   * @apiSuccess (201) {object} data
   * @apiSuccess (201) {object} data.attributes
   * @apiSuccess (201) {string} data.attributes[created-at]
   * @apiSuccess (201) {string} data.attributes.name
   * @apiSuccess (201) {string} data.id
   * @apiSuccess (201) {string} data.type
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 422 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "source": {
   *          "pointer": "/data/attributes/name",
   *        },
   *        "detail": "Category name is required.",
   *      }]
   *    }
   */
  return async(req, res, next) => {
    try {
      const categoryUuid = await controllers.CategoryCtrl.createCategory({
        auditApiCallUuid: req.auditApiCallUuid,
        name: req.body.data.attributes.name,
      });

      const category = await models.Category.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: categoryUuid,
        },
      });

      return res.status(201).json({
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
