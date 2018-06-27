const jwt = require('jsonwebtoken');
const nconf = require('nconf');

module.exports = async({
  token,
  userCtrl,
}) => {
  return jwt.verify(token, nconf.get('jwtPrivateKey'), {
    algorithms: [userCtrl.jwtAlgorithm],
  });
};
