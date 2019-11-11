module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {post} /household-members
   * @apiName HouseholdMemberPost
   * @apiGroup HouseholdMember
   *
   * @apiParam {object} data
   * @apiParam {object} data.attributes
   * @apiParam {string} data.attributes.name
   * @apiParam {string} data.type
   *
   * @apiSuccess (201) {object} data
   * @apiSuccess (201) {object} data.attributes
   * @apiSuccess (201) {string} data.attributes[created-at]
   * @apiSuccess (201) {string} data.attributes.name
   * @apiSuccess (201) {string} data.id
   * @apiSuccess (201) {string} data.type
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 422 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "source": {
   *          "pointer": "/data/attributes/name",
   *        },
   *        "detail": "Household member name is required.",
   *      }]
   *    }
   */
  return async(req, res, next) => {
    try {
      const householdMemberUuid = await controllers.HouseholdCtrl.createMember({
        auditApiCallUuid: req.auditApiCallUuid,
        name: req.body.data.attributes.name,
      });

      const householdMember = await models.HouseholdMember.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: householdMemberUuid,
        },
      });

      return res.status(201).json({
        'data': {
          'attributes': {
            'created-at': householdMember.get('created_at'),
            'name': householdMember.get('name'),
          },
          'id': householdMember.get('uuid'),
          'type': 'household-members',
        },
      });
    } catch (err) {
      return next(err);
    }
  };
};
