module.exports = (app) => {
  const controllers = app.get('controllers');
  const models = app.get('models');

  /**
   * @api {patch} /household-members/:uuid
   * @apiName HouseholdMemberItemPatch
   * @apiGroup HouseholdMember
   *
   * @apiSuccess (200) {object} data
   * @apiSuccess (200) {object} data.attributes
   * @apiSuccess (200) {string} data.attributes[created-at]
   * @apiSuccess (200) {string} data.attributes.name
   * @apiSuccess (200) {string} data.id
   * @apiSuccess (200) {string} data.type
   *
   * @apiErrorExample {json} Error-Response:
   *    HTTP/1.1 401 Unprocessable Entity
   *    {
   *      "errors": [{
   *        "detail": "Unauthorized",
   *      }],
   *    }
   */
  return async(req, res, next) => {
    try {
      await controllers.HouseholdCtrl.updateMember({
        auditApiCallUuid: req.auditApiCallUuid,
        householdMemberUuid: req.params.uuid,
        name: req.body.data.attributes.name,
      });

      const householdMember = await models.HouseholdMember.findOne({
        attributes: ['created_at', 'name', 'uuid'],
        where: {
          uuid: req.params.uuid,
        },
      });

      return res.status(200).json({
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
