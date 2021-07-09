module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /deposits/:uuid
   * @apiName DepositItemPatch
   * @apiGroup Deposit
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {integer} data.attributes.amount
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.date
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {object} data.relationships
   * @apiSuccess (200) {object} data.relationships.fund
   * @apiSuccess (200) {object} data.relationships.fund.data
   * @apiSuccess (200) {string} data.relationships.fund.data.id
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
      await controllers.FundCtrl.updateDeposit({
        amount: req.body.data.attributes.amount,
        auditApiCallUuid: req.auditApiCallUuid,
        date: req.body.data.attributes.date,
        depositUuid: req.params.uuid,
        fundUuid: req.body.data.relationships.fund.data.id,
      });

      const deposit = await models.Deposit.findOne({
        attributes: ['amount_cents', 'created_at', 'date', 'uuid'],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.Fund,
          required: true,
        }],
        where: {
          uuid: req.params.uuid,
        },
      });

      return res.status(200).json({
        'data': {
          'attributes': {
            'amount': deposit.get('amount_cents'),
            'created-at': deposit.get('created_at'),
            'date': deposit.get('date'),
          },
          'id': deposit.get('uuid'),
          'relationships': {
            'fund': {
              'data': {
                'id': deposit.Fund.get('uuid'),
                'type': 'funds',
              },
            },
          },
          'type': 'deposits',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
