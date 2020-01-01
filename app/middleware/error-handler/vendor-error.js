module.exports = class VendorError extends Error {
  constructor(message) {
    super(message);
    this.name = 'VendorError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Cannot delete with expenses':
      return {
        message: 'Cannot delete when there are expenses remaining.',
        status: 422,
      };
    case 'Not found':
      return {
        message: 'Unable to find vendor.',
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
