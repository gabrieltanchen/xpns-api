class Auditor {
  constructor(models) {
    this.models = models;
  }

  trackApiCall() {
    const models = this.models;
    return async(req, res, next) => {
      const apiCallParams = {
        http_method: req.method,
        ip_address: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        route: req.originalUrl,
        user_agent: req.headers['user-agent'],
      };
      if (req.userUuid) {
        apiCallParams.user_uuid = req.userUuid;
      }
      const apiCall = await models.Audit.ApiCall.create(apiCallParams);
      req.auditApiCallUuid = apiCall.get('uuid');
      return next();
    };
  }
}

module.exports = Auditor;
