const { body } = require('express-validator/check');
const post = require('./post');

module.exports = (router, app) => {
  const Validator = app.get('Validator');

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
  router.route('/login/token')
    .post([
      body([['data', 'attributes', 'token']], 'No token provided.').not().isEmpty(),
    ], Validator.validateRequest(), post(app));
};
