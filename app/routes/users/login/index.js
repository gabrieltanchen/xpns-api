const { body } = require('express-validator/check');
const post = require('./post');

module.exports = (router, app) => {
  const Validator = app.get('Validator');

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
  router.route('/login')
    .post([
      body([['data', 'attributes', 'email']], 'Email address is required.').not().isEmpty(),
      body([['data', 'attributes', 'email']], 'Please enter a valid email address.').isEmail(),
      body([['data', 'attributes', 'password']], 'Passwords must be a minimum of 8 characters.').isLength({
        min: 8,
      }),
    ], Validator.validateRequest(), post(app));
};
