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
}

module.exports = UserCtrl;
