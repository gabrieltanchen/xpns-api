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
      if (req.params.householdUuid !== user.get('household_uuid')) {
        return res.status(401).json({
          errors: [{
            detail: 'Unauthorized',
          }],
        });
      }

      const household = await models.Household.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: user.get('household_uuid'),
        },
      });

      return res.status(200).json({
        'data': {
          'attributes': {
            'created-at': household.get('created_at'),
            'name': household.get('name'),
          },
          'id': household.get('uuid'),
          'type': 'households',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
