const { FundError } = require('../../middleware/error-handler');

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /deposits
   * @apiName DepositGet
   * @apiGroup Deposit
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.deposits
   * @apiSuccess (200) {object} data.deposits[].attributes
   * @apiSuccess (200) {integer} data.deposits[].attributes.amount
   * @apiSuccess (200) {string} data.deposits[].attributes[created-at]
   * @apiSuccess (200) {string} data.deposits[].attributes.date
   * @apiSuccess (200) {string} data.deposits[].id
   * @apiSuccess (200) {object} data.deposits[].relationships
   * @apiSuccess (200) {object} data.deposits[].relationships.fund
   * @apiSuccess (200) {object} data.deposits[].relationships.fund.data
   * @apiSuccess (200) {string} data.deposits[].relationships.fund.data.id
   * @apiSuccess (200) {string} data.deposits[].type
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
      // Query params
      let limit = 25;
      if (req.query && req.query.limit) {
        limit = parseInt(req.query.limit, 10);
      }
      let offset = 0;
      if (req.query && req.query.page) {
        offset = limit * (parseInt(req.querypage, 10) - 1);
      }

      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });

      const depositWhere = {};
      if (req.query.fund_id) {
        const fund = await models.Fund.findOne({
          attributes: ['uuid'],
          where: {
            household_uuid: user.get('household_uuid'),
            uuid: req.query.fund_id,
          },
        });
        if (!fund) {
          throw new FundError('Not found');
        }
        depositWhere.fund_uuid = fund.get('uuid');
      } else {
        throw new FundError('No open queries');
      }

      const deposits = await models.Deposit.findAndCountAll({
        attributes: ['amount_cents', 'created_at', 'date', 'uuid'],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.Fund,
          required: true,
        }],
        limit,
        offset,
        order: [['date', 'DESC']],
        where: depositWhere,
      });

      const included = [];
      const fundIds = [];
      deposits.rows.forEach((deposit) => {
        if (!fundIds.includes(deposit.Fund.get('uuid'))) {
          fundIds.push(deposit.Fund.get('uuid'));
          included.push({
            'attributes': {
              'name': deposit.Fund.get('name'),
            },
            'id': deposit.Fund.get('uuid'),
            'type': 'funds',
          });
        }
      });

      return res.status(200).json({
        'data': deposits.rows.map((deposit) => {
          return {
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
          };
        }),
        'included': included,
        'meta': {
          'pages': Math.ceil(deposits.count / limit),
          'total': deposits.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
