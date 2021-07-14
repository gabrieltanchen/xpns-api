const { FundError } = require('../../../middleware/error-handler');

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /funds/:uuid
   * @apiName FundItemGet
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
      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });
      if (!user) {
        throw new Error('Unauthorized');
      }

      const fund = await models.Fund.findOne({
        attributes: ['balance_cents', 'created_at', 'name', 'uuid'],
        where: {
          household_uuid: user.get('household_uuid'),
          uuid: req.params.uuid,
        },
      });
      if (!fund) {
        throw new FundError('Not found');
      }

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
