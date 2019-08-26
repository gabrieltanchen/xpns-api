const scrypt = require('scrypt');

const { LOGIN_PASSWORD_FAILED } = require('../../middleware/error-handler/');

module.exports = async({
  email,
  password,
  userCtrl,
}) => {
  const models = userCtrl.models;
  if (!email || !password) {
    const error = new Error('No email or password given');
    error.code = LOGIN_PASSWORD_FAILED;
    throw error;
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
    const error = new Error('User does not exist');
    error.code = LOGIN_PASSWORD_FAILED;
    throw error;
  }

  const hash = await models.Hash.findOne({
    attributes: ['h1', 's2'],
    where: {
      h1: (
        await scrypt.hash(password, userCtrl.hashParams, 96, user.UserLogin.get('s1'))
      ).toString('base64'),
    },
  });
  if (!hash) {
    const error = new Error('Wrong password');
    error.code = LOGIN_PASSWORD_FAILED;
    throw error;
  }

  const h2 = (
    await scrypt.hash(password, userCtrl.hashParams, 96, hash.get('s2'))
  ).toString('base64');
  if (h2 !== user.UserLogin.get('h2')) {
    const error = new Error('Wrong password');
    error.code = LOGIN_PASSWORD_FAILED;
    throw error;
  }

  return user.get('uuid');
};
