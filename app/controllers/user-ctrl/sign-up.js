const crypto = require('crypto');
const scrypt = require('scrypt');
const Sequelize = require('sequelize');
const _ = require('lodash');

const { UserError } = require('../../middleware/error-handler/');

/**
 * @param {string} auditApiCallUuid
 * @param {string} email
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} password
 * @param {object} userCtrl Instance of UserCtrl
 */
module.exports = async({
  auditApiCallUuid,
  email,
  firstName,
  lastName,
  password,
  userCtrl,
}) => {
  const controllers = userCtrl.parent;
  const models = userCtrl.models;
  if (!email || !_.isString(email)) {
    throw new UserError('Email is required');
  } else if (!firstName || !_.isString(firstName)) {
    throw new UserError('First name is required');
  } else if (!lastName || !_.isString(lastName)) {
    throw new UserError('Last name is required');
  } else if (!password || !_.isString(password)) {
    throw new UserError('Password is required');
  } else if (password.length < 8) {
    throw new UserError('Passwords must be at least 8 characters');
  } else if (!auditApiCallUuid || !_.isString(auditApiCallUuid)) {
    throw new UserError('Audit API call is required');
  }

  if (await models.User.findOne({
    attributes: ['uuid'],
    where: {
      email: email.toLowerCase(),
    },
  })) {
    throw new UserError('Email already exists');
  }

  const user = models.User.build({
    email: email.toLowerCase(),
    first_name: firstName,
    last_name: lastName,
  });
  const userLogin = models.UserLogin.build({
    s1: crypto.randomBytes(48).toString('base64'),
  });
  const household = models.Household.build({
    name: user.get('last_name'),
  });
  const hash = await models.Hash.create({
    h1: (
      await scrypt.hash(password, userCtrl.hashParams, 96, userLogin.get('s1'))
    ).toString('base64'),
    s2: crypto.randomBytes(48).toString('base64'),
  });
  userLogin.set('h2', (
    await scrypt.hash(password, userCtrl.hashParams, 96, hash.get('s2'))
  ).toString('base64'));

  await models.sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  }, async(transaction) => {
    await household.save({
      transaction,
    });
    user.set('household_uuid', household.get('uuid'));
    await user.save({
      transaction,
    });
    userLogin.set('user_uuid', user.get('uuid'));
    await userLogin.save({
      transaction,
    });
    await controllers.AuditCtrl.trackChanges({
      auditApiCallUuid,
      newList: [household, user, userLogin],
      transaction,
    });
  });

  return user.get('uuid');
};
