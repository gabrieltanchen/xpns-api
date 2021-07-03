module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /funds
   * @apiName FundPost
   * @apiGroup Fund
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {string} data.attributes.name
   * @apiParam {string} data.type
   *
   * @apiSuccess (201) {object} data
   * @apiSuccess (201) {object} data.attributes
   * @apiSuccess (201) {integer} data.attributes.amount
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
      const fundUuid = await controllers.FundCtrl.createFund({
        auditApiCallUuid: req.auditApiCallUuid,
        name: req.body.data.attributes.name,
      });

      const fund = await models.Fund.findOne({
        attributes: ['amount_cents', 'created_at', 'name', 'uuid'],
        where: {
          uuid: fundUuid,
        },
      });

      return res.status(201).json({
        'data': {
          'attributes': {
            'amount': fund.get('amount_cents'),
            'created-at': fund.get('created_at'),
            'name': fund.get('name'),
          },
          'id': fund.get('uuid'),
          'type': 'funds',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
