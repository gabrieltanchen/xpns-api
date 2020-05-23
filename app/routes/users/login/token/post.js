module.exports = (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {post} /users/login/token
   * @apiName UserLoginTokenPost
   * @apiGroup User
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {string} data.attributes.token
   * @apiParam {string} data.type
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
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
   *          "pointer": "/data/attributes/token",
   *        },
   *        "detail": "No token provided.",
   *      }],
   *    }
   */
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
          'type': 'login-token',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
