module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /deposits
   * @apiName DepositPost
   * @apiGroup Deposit
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {integer} data.attributes.amount
   * @apiParam {string} data.attributes.date
   * @apiParam {object} data.relationships
   * @apiParam {object} data.relationships.fund
   * @apiParam {object} data.relationships.fund.data
   * @apiParam {string} data.relationships.fund.data.id
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 422 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "source": {
   *          "pointer": "/data/attributes/amount-cents",
   *        },
   *        "detail": "Amount is required.",
   *      }]
   *    }
   */
  return async(req, res, next) => {
    try {
      const depositUuid = await controllers.FundCtrl.createDeposit({
        amount: req.body.data.attributes.amount,
        auditApiCallUuid: req.auditApiCallUuid,
        date: req.body.data.attributes.date,
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
          uuid: depositUuid,
        },
      });

      return res.status(201).json({
        'data': {
          'attributes': {
            'amount': deposit.get('amount_cents'),
            'created-at': deposit.get('created_at'),
            'date': deposit.get('date'),
          },
          'id': depositUuid,
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
