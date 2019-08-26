const ConnectRoles = require('connect-roles');
const jwt = require('jsonwebtoken');
const nconf = require('nconf');

module.exports = (logger) => {
  const Authentication = {
    checkBearerAuth(req, res, next) {
      req.userUuid = null;

      let token = req.headers.authorization || '';
      token = token.substr(7); // Remove the Bearer prefix
      if (token.length >= 10) {
        try {
          const user = jwt.verify(token, nconf.get('jwtPrivateKey'), {
            algorithms: ['HS256'],
          });
          req.userUuid = user.uuid;
        } catch (err) {
          logger.error('[Authentication][checkBearerAuth] Error verifying jwt:', err);
        }
      }

      return next();
    },
  };

  Authentication.UserAuth = new ConnectRoles({
    failureHandler: (req, res, action) => {
      let actionDetail;
      switch (action) {
      case 'access-account':
        actionDetail = 'Unauthorized';
        break;
      default:
        actionDetail = action;
      }
      return res.status(401).json({
        errors: [{
          detail: actionDetail,
        }],
      });
    },
  });

  Authentication.UserAuth.use('access-account', (req) => {
    return !!req.userUuid;
  });

  return Authentication;
};
