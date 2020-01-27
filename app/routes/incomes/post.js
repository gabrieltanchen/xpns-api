module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /incomes
   * @apiName IncomePost
   * @apiGroup Income
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {integer} data.attributes[amount-cents]
   * @apiParam {string} data.attributes.description
   * @apiParam {object} data.relationships
   * @apiParam {object} data.relationships[household-member]
   * @apiParam {object} data.relationships[household-member].data
   * @apiParam {string} data.relationships[household-member].data.id
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
      const incomeUuid = await controllers.IncomeCtrl.createIncome({
        amountCents: req.body.data.attributes['amount-cents'],
        auditApiCallUuid: req.auditApiCallUuid,
        description: req.body.data.attributes.description,
        householdMemberUuid: req.body.data.relationships['household-member'].data.id,
      });

      const income = await models.Income.findOne({
        attributes: [
          'amount_cents',
          'created_at',
          'description',
          'uuid',
        ],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.HouseholdMember,
          required: true,
        }],
        where: {
          uuid: incomeUuid,
        },
      });

      return res.status(201).json({
        'data': {
          'attributes': {
            'amount': parseFloat(income.get('amount_cents') / 100).toFixed(2),
            'amount-cents': income.get('amount_cents'),
            'created-at': income.get('created_at'),
            'description': income.get('description'),
          },
          'id': incomeUuid,
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
