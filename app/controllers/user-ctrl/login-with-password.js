const scrypt = require('scrypt');

module.exports = async({
  email,
  password,
  userCtrl,
}) => {
  const models = userCtrl.models;
  const loginError = 'Invalid email/password combination.';
  if (!email || !password) {
    throw new Error(loginError);
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
    throw new Error(loginError);
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
    throw new Error(loginError);
  }

  const h2 = (
    await scrypt.hash(password, userCtrl.hashParams, 96, hash.get('s2'))
  ).toString('base64');
  if (h2 !== user.UserLogin.get('h2')) {
    throw new Error(loginError);
  }

  return user.get('uuid');
};
