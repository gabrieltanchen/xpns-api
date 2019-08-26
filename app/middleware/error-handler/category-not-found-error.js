module.exports = class CategoryNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CategoryNotFoundError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Parent category not found':
      return {
        message: 'Could not find parent category.',
        status: 404,
      };
    default:
      return {
        message: 'Unable to find category.',
        status: 404,
      };
    }
  }
};
