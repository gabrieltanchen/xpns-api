const { body } = require('express-validator/check');
const post = require('./post');
const routeLogin = require('./login/');

module.exports = (router, app) => {
  const Auditor = app.get('Auditor');
  const Validator = app.get('Validator');

  router.route('/')
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
    .post([
      body([['data', 'attributes', 'email']], 'Email address is required.').not().isEmpty(),
      body([['data', 'attributes', 'email']], 'Please enter a valid email address.').isEmail(),
      body([['data', 'attributes', 'first-name']], 'First name is required.').not().isEmpty(),
      body([['data', 'attributes', 'last-name']], 'Last name is required.').not().isEmpty(),
      body([['data', 'attributes', 'password']], 'Passwords must be a minimum of 8 characters.').isLength({
        min: 8,
      }),
    ], Validator.validateRequest(), Auditor.trackApiCall(), post(app));

  routeLogin(router, app);

  return router;
};
