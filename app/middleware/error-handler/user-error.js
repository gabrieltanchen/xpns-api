module.exports = class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Email already exists':
      return {
        message: 'That email address is already taken.',
        status: 403,
      };
    case 'Not found':
      return {
        message: 'Unable to find user.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};
