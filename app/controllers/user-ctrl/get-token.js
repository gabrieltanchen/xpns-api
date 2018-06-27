const jwt = require('jsonwebtoken');
const nconf = require('nconf');

module.exports = async({
  userCtrl,
  userUuid,
}) => {
  const models = userCtrl.models;
  if (!userUuid) {
    throw new Error('User UUID is required.');
  }

  const user = await models.User.findOne({
    attributes: ['email', 'first_name', 'last_name', 'uuid'],
    where: {
      uuid: userUuid,
    },
  });
  if (!user) {
    throw new Error('User not found.');
  }

  return jwt.sign({
    email: user.get('email'),
    first_name: user.get('first_name'),
    last_name: user.get('last_name'),
    uuid: user.get('uuid'),
  }, nconf.get('jwtPrivateKey'), {
    algorithm: userCtrl.jwtAlgorithm,
    expiresIn: userCtrl.tokenExpiresIn,
  });
};
