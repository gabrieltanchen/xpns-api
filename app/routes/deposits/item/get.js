const { FundError } = require('../../../middleware/error-handler');

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /deposits/:uuid
   * @apiName DepositItemGet
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
   * @apiSuccess (200) {string} data.relatinoships.fund.data.type
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
      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });
      if (!user) {
        throw new Error('Unauthorized');
      }

      const deposit = await models.Deposit.findOne({
        attributes: ['amount_cents', 'created_at', 'date', 'uuid'],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.Fund,
          required: true,
          where: {
            household_uuid: user.get('household_uuid'),
          },
        }],
        where: {
          uuid: req.params.uuid,
        },
      });
      if (!deposit) {
        throw new FundError('Deposit not found');
      }

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
        'included': [{
          'attributes': {
            'name': deposit.Fund.get('name'),
          },
          'id': deposit.Fund.get('uuid'),
          'type': 'funds',
        }],
      });
    } catch (err) {
      return next(err);
    }
  };
};
