module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /funds/:uuid
   * @apiName FundItemPatch
   * @apiGroup Fund
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {integer} data.attributes.balance
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
      await controllers.FundCtrl.updateFund({
        auditApiCallUuid: req.auditApiCallUuid,
        fundUuid: req.params.uuid,
        name: req.body.data.attributes.name,
      });

      const fund = await models.Fund.findOne({
        attributes: ['balance_cents', 'created_at', 'name', 'uuid'],
        where: {
          uuid: req.params.uuid,
        },
      });

      return res.status(200).json({
        'data': {
          'attributes': {
            'balance': fund.get('balance_cents'),
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
