module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /subcategories
   * @apiName SubcategoryPost
   * @apiGroup Subcategory
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {string} data.attributes.name
   * @apiParam {object} data.relationships
   * @apiParam {object} data.relationships.category
   * @apiParam {object} data.relationships.category.data
   * @apiParam {string} data.relationships.category.data.id
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
   *        "detail": "Subcategory name is required.",
   *      }]
   *    }
   */
  return async(req, res, next) => {
    try {
      const subcategoryUuid = await controllers.CategoryCtrl.createSubcategory({
        auditApiCallUuid: req.auditApiCallUuid,
        categoryUuid: req.body.data.relationships.category.data.id,
        name: req.body.data.attributes.name,
      });

      const subcategory = await models.Subcategory.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: subcategoryUuid,
        },
      });

      return res.status(201).json({
        'data': {
          'attributes': {
            'created-at': subcategory.get('created_at'),
            'name': subcategory.get('name'),
          },
          'id': subcategory.get('uuid'),
          'type': 'subcategories',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
