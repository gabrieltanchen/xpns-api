module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  return async(req, res, next) => {
    try {
      const userUuid = await controllers.UserCtrl.signUp({
        auditApiCallUuid: req.auditApiCallUuid,
        email: req.body.data.attributes.email,
        firstName: req.body.data.attributes['first-name'],
        lastName: req.body.data.attributes['last-name'],
        password: req.body.data.attributes.password,
      });

      const user = await models.User.findOne({
        attributes: ['created_at', 'email', 'first_name', 'last_name', 'uuid'],
        include: [{
          attributes: ['name', 'uuid'],
          model: models.Household,
          required: true,
        }],
        where: {
          uuid: userUuid,
        },
      });
      const token = await controllers.UserCtrl.getToken(user.get('uuid'));

      return res.status(201).json({
        'data': {
          'attributes': {
            'created-at': user.get('created_at'),
            'email': user.get('email'),
            'first-name': user.get('first_name'),
            'last-name': user.get('last_name'),
            'token': token,
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
