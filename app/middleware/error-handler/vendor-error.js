module.exports = class VendorError extends Error {
  constructor(message) {
    super(message);
    this.name = 'VendorError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Not found':
      return {
        message: 'Unable to find vendor.',
        status: 404,
      };
    default:
      return {
        message: 'An error occurred. Please try again.',
        status: 500,
      };
    }
  }
};
