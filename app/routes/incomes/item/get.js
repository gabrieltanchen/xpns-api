const { IncomeError } = require('../../../middleware/error-handler');

module.exports = (app) => {
  const models = app.get('models');

  /**
   * @api {get} /incomes/:uuid
   * @apiName IncomeItemGet
   * @apiGroup Income
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {decimal} data.attributes.amount
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.date
   * @apiSuccess (200) {string} data.attributes.description
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {object} data.relationships
   * @apiSuccess (200) {object} data.relationships[household-member]
   * @apiSuccess (200) {object} data.relationships[household-member].data
   * @apiSuccess (200) {string} data.relationships[household-member].data.id
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

      const income = await models.Income.findOne({
        attributes: [
          'amount_cents',
          'created_at',
          'date',
          'description',
          'uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.HouseholdMember,
          required: true,
          where: {
            household_uuid: user.get('household_uuid'),
          },
        }],
        where: {
          uuid: req.params.uuid,
        },
      });
      if (!income) {
        throw new IncomeError('Not found');
      }

      return res.status(200).json({
        'data': {
          'attributes': {
            'amount': income.get('amount_cents'),
            'created-at': income.get('created_at'),
            'date': income.get('date'),
            'description': income.get('description'),
          },
          'id': income.get('uuid'),
          'relationships': {
            'household-member': {
              'data': {
                'id': income.HouseholdMember.get('uuid'),
                'type': 'household-members',
              },
            },
          },
          'type': 'incomes',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
