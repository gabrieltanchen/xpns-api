const crypto = require('crypto');
const scrypt = require('scrypt');
const _ = require('lodash');

class UserCtrl {
  constructor(parent, models) {
    this.parent = parent;
    this.models = models;
    this.jwtAlgorithm = 'HS256';
    this.hashParams = {
      N: 16384,
      r: 8,
      p: 1,
    };
    this.tokenExpiresIn = 7200;
  }

  /**
   * @param {string} auditApiCallUuid
   * @param {string} email
   * @param {string} firstName
   * @param {string} lastName
   * @param {string} password
   */
  async signUp({
    auditApiCallUuid,
    email,
    firstName,
    lastName,
    password,
  }) {
    const controllers = this.parent;
    const models = this.models;
    if (!email || !_.isString(email)) {
      throw new Error('Email is required.');
    } else if (!firstName || !_.isString(firstName)) {
      throw new Error('First name is required.');
    } else if (!lastName || !_.isString(lastName)) {
      throw new Error('Last name is required.');
    } else if (!password || !_.isString(password)) {
      throw new Error('Password is required.');
    } else if (password.length < 8) {
      throw new Error('Passwords must be at least 8 characters.');
    } else if (!auditApiCallUuid || !_.isString(auditApiCallUuid)) {
      throw new Error('Audit API call is required.');
    }

    if (await models.User.findOne({
      attributes: ['uuid'],
      where: {
        email: email.toLowerCase(),
      },
    })) {
      throw new Error('That email address is already taken.');
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
        await scrypt.hash(password, this.hashParams, 96, userLogin.get('s1'))
      ).toString('base64'),
      s2: crypto.randomBytes(48).toString('base64'),
    });
    userLogin.set('h2', (
      await scrypt.hash(password, this.hashParams, 96, hash.get('s2'))
    ).toString('base64'));

    await models.sequelize.transaction({
      isolationLevel: models.sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
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
  }
}

module.exports = UserCtrl;
