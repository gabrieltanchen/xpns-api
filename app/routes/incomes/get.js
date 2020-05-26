const {
  HouseholdError,
} = require('../../middleware/error-handler');

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /incomes
   * @apiName IncomeGet
   * @apiGroup Income
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object[]} data.incomes
   * @apiSuccess (200) {object} data.incomes[].attributes
   * @apiSuccess (200) {decimal} data.incomes[].attributes.amount
   * @apiSuccess (200) {integer} data.incomes[].attributes[amount-cents]
   * @apiSuccess (200) {string} data.incomes[].attributes[created-at]
   * @apiSuccess (200) {string} data.incomes[].attributes.date
   * @apiSuccess (200) {string} data.incomes[].attributes.description
   * @apiSuccess (200) {string} data.incomes[].id
   * @apiSuccess (200) {object} data.incomes[].relationships
   * @apiSuccess (200) {object} data.incomes[].relationships[household-member]
   * @apiSuccess (200) {object} data.incomes[].relationships[household-member].data
   * @apiSuccess (200) {string} data.incomes[].relationships[household-member].data.id
   * @apiSuccess (200) {string} data.incomes[].type
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
        offset = limit * (parseInt(req.query.page, 10) - 1);
      }

      const user = await models.User.findOne({
        attributes: ['household_uuid', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });

      const incomeWhere = {};
      if (req.query.household_member_id) {
        const householdMember = await models.HouseholdMember.findOne({
          attributes: ['uuid'],
          where: {
            household_uuid: user.get('household_uuid'),
            uuid: req.query.household_member_id,
          },
        });
        if (!householdMember) {
          throw new HouseholdError('Not found');
        }
        incomeWhere.household_member_uuid = householdMember.get('uuid');
      }

      const incomes = await models.Income.findAndCountAll({
        attributes: [
          'amount_cents',
          'created_at',
          'date',
          'description',
          'uuid',
        ],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.HouseholdMember,
          required: true,
          where: {
            household_uuid: user.get('household_uuid'),
          },
        }],
        limit,
        offset,
        order: [['date', 'DESC']],
        where: incomeWhere,
      });

      const included = [];
      const householdMemberIds = [];
      incomes.rows.forEach((income) => {
        if (!householdMemberIds.includes(income.HouseholdMember.get('uuid'))) {
          householdMemberIds.push(income.HouseholdMember.get('uuid'));
          included.push({
            'attributes': {
              'name': income.HouseholdMember.get('name'),
            },
            'id': income.HouseholdMember.get('uuid'),
            'type': 'household-members',
          });
        }
      });

      return res.status(200).json({
        'data': incomes.rows.map((income) => {
          return {
            'attributes': {
              'amount': parseFloat(income.get('amount_cents') / 100).toFixed(2),
              'amount-cents': income.get('amount_cents'),
              'created-at': income.get('created_at'),
              'date': income.get('date'),
              'description': income.get('description'),
            },
            'id': income.get('uuid'),
            'relationships': {
              'household-member': {
                'data': {
                  'id': income.HouseholdMember.get('uuid'),
                  'type': 'household-member',
                },
              },
            },
            'type': 'incomes',
          };
        }),
        'included': included,
        'meta': {
          'pages': Math.ceil(incomes.count / limit),
          'total': incomes.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
