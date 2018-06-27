const getToken = require('./get-token');
const loginWithPassword = require('./login-with-password');
const loginWithToken = require('./login-with-token');
const signUp = require('./sign-up');

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

  async getToken(userUuid) {
    return getToken({
      userCtrl: this,
      userUuid,
    });
  }

  async loginWithPassword({
    email,
    password,
  }) {
    return loginWithPassword({
      email,
      password,
      userCtrl: this,
    });
  }

  async loginWithToken(token) {
    return loginWithToken({
      token,
      userCtrl: this,
    });
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
    return signUp({
      auditApiCallUuid,
      email,
      firstName,
      lastName,
      password,
      userCtrl: this,
    });
  }
}

module.exports = UserCtrl;
