const crypto = require('crypto');

const { LoginPasswordFailedError } = require('../../middleware/error-handler');

module.exports = async({
  email,
  password,
  userCtrl,
}) => {
  const models = userCtrl.models;
  if (!email || !password) {
    throw new LoginPasswordFailedError('No email or password given');
  }

  const user = await models.User.findOne({
    attributes: ['uuid'],
    include: [{
      attributes: ['h2', 's1', 'user_uuid'],
      model: models.UserLogin,
      required: true,
    }],
    where: {
      email: email.toLowerCase(),
    },
  });
  if (!user) {
    throw new LoginPasswordFailedError('User does not exist');
  }

  const hash = await models.Hash.findOne({
    attributes: ['h1', 's2'],
    where: {
      h1: (
        await crypto.scryptSync(password, user.UserLogin.get('s1'), 96, userCtrl.hashParams)
      ).toString('base64'),
    },
  });
  if (!hash) {
    throw new LoginPasswordFailedError('H1 not found');
  }

  const h2 = (
    await crypto.scryptSync(password, hash.get('s2'), 96, userCtrl.hashParams)
  ).toString('base64');
  if (h2 !== user.UserLogin.get('h2')) {
    throw new LoginPasswordFailedError('H2 does not match');
  }

  return user.get('uuid');
};
