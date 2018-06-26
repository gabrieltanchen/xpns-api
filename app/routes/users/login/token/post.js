module.exports = (app) => {
  const controllers = app.get('controllers');

  return async(req, res, next) => {
    try {
      const user = await controllers.UserCtrl.loginWithToken(req.body.data.attributes.token);

      return res.status(200).json({
        'data': {
          'attributes': {
            'email': user.email,
            'first-name': user.first_name,
            'last-name': user.last_name,
          },
          'id': user.uuid,
          'type': 'users',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
