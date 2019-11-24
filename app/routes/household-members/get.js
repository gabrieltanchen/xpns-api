module.exports = (app) => {
  const models = app.get('models');

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

      const householdMembers = await models.HouseholdMember.findAndCountAll({
        attributes: ['created_at', 'name', 'uuid'],
        limit,
        offset,
        order: [['name', 'ASC']],
        where: {
          household_uuid: user.get('household_uuid'),
        },
      });

      return res.status(200).json({
        'data': householdMembers.rows.map((householdMember) => {
          return {
            'attributes': {
              'created-at': householdMember.get('created_at'),
              'name': householdMember.get('name'),
            },
            'id': householdMember.get('uuid'),
            'type': 'household-members',
          };
        }),
        'meta': {
          'pages': Math.ceil(householdMembers.count / limit),
          'total': householdMembers.count,
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
