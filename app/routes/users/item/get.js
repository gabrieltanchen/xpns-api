module.exports = (app) => {
  const models = app.get('models');

  return async(req, res, next) => {
    if (req.params.userUuid !== req.userUuid) {
      return res.status(401).json({
        errors: [{
          detail: 'Unauthorized',
        }],
      });
    }
    try {
      const user = await models.User.findOne({
        attributes: ['created_at', 'email', 'first_name', 'last_name', 'uuid'],
        where: {
          uuid: req.userUuid,
        },
      });

      return res.status(200).json({
        'data': {
          'attributes': {
            'created-at': user.get('created_at'),
            'email': user.get('email'),
            'first-name': user.get('first_name'),
            'last-name': user.get('last_name'),
          },
          'id': user.get('uuid'),
          'type': 'users',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
