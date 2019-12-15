module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /subcategories/:uuid
   * @apiName SubcategoryItemPatch
   * @apiGroup Subcategory
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
      await controllers.CategoryCtrl.updateSubcategory({
        auditApiCallUuid: req.auditApiCallUuid,
        categoryUuid: req.body.data.relationships.category.data.id,
        name: req.body.data.attributes.name,
        subcategoryUuid: req.params.uuid,
      });

      const subcategory = await models.Subcategory.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: req.params.uuid,
        },
      });

      return res.status(200).json({
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
