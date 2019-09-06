module.exports = class LoginPasswordFailedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LoginPasswordFailedError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    default:
      return {
        message: 'Invalid email/password combination.',
        status: 403,
      };
    }
  }
};
