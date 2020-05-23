module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /users/login
   * @apiName UserLoginPost
   * @apiGroup User
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {string} data.attributes.email
   * @apiParam {string} data.attributes.password
   * @apiParam {string} data.type
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.email
   * @apiSuccess (200) {string} data.attributes[first-name]
   * @apiSuccess (200) {string} data.attributes[last-name]
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {string} data.type
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 422 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "source": {
   *          "pointer": "/data/attributes/email",
   *        },
   *        "detail": "Email is required.",
   *      }],
   *    }
   */
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
          'type': 'login-users',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
