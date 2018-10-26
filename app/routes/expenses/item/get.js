module.exports = (app) => {
  const models = app.get('models');

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

      const expense = await models.Expense.findOne({
        attributes: [
          'amount_cents',
          'created_at',
          'date',
          'description',
          'reimbursed_cents',
          'uuid',
        ],
        include: [{
          attributes: ['uuid'],
          model: models.Category,
          required: true,
          where: {
            household_uuid: user.get('household_uuid'),
          },
        }, {
          attributes: ['uuid'],
          model: models.Vendor,
          required: true,
          where: {
            household_uuid: user.get('household_uuid'),
          },
        }],
        where: {
          uuid: req.params.uuid,
        },
      });
      if (!expense) {
        throw new Error('Not found');
      }

      return res.status(200).json({
        'data': {
          'attributes': {
            'amount': parseFloat(expense.get('amount_cents') / 100),
            'amount-cents': expense.get('amount_cents'),
            'created-at': expense.get('created_at'),
            'date': expense.get('date'),
            'description': expense.get('description'),
            'reimbursed-amount': parseFloat(expense.get('reimbursed_cents') / 100),
            'reimbursed-cents': expense.get('reimbursed_cents'),
          },
          'id': expense.get('uuid'),
          'relationships': {
            'category': {
              'data': {
                'id': expense.Category.get('uuid'),
              },
            },
            'vendor': {
              'data': {
                'id': expense.Vendor.get('uuid'),
              },
            },
          },
          'type': 'expenses',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
