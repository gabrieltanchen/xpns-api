module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  return async(req, res, next) => {
    try {
      const userUuid = await controllers.UserCtrl.loginWithPassword({
        email: req.body.data.attributes.email,
        password: req.body.data.attributes.password,
      });

      const user = await models.User.findOne({
        attributes: ['created_at', 'email', 'first_name', 'last_name', 'uuid'],
        where: {
          uuid: userUuid,
        },
      });
      const token = await controllers.UserCtrl.getToken(user.get('uuid'));

      return res.status(200).json({
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
