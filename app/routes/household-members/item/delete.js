module.exports = (app) => {
  const controllers = app.get('controllers');

  /**
   * @api {delete} /vendors/:uuid
   * @apiName HouseholdMemberItemDelete
   * @apiGroup HouseholdMember
   *
   * @apiSuccess (204)
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
      await controllers.HouseholdCtrl.deleteMember({
        auditApiCallUuid: req.auditApiCallUuid,
        householdMemberUuid: req.params.uuid,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
