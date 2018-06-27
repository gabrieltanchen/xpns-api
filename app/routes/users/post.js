module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /users
   * @apiName UserPost
   * @apiGroup User
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {string} data.attributes.email
   * @apiParam {string} data.attributes[first-name]
   * @apiParam {string} data.attributes[last-name]
   * @apiParam {string} data.attributes.password
   * @apiParam {string} data.type
   *
   * @apiSuccess (201) {object} data
   * @apiSuccess (201) {object} data.attributes
   * @apiSuccess (201) {string} data.attributes[created-at]
   * @apiSuccess (201) {string} data.attributes.email
   * @apiSuccess (201) {string} data.attributes[first-name]
   * @apiSuccess (201) {string} data.attributes[last-name]
   * @apiSuccess (201) {string} data.attributes.token
   * @apiSuccess (201) {string} data.id
   * @apiSuccess (201) {string} data.type
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
