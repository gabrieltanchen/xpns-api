module.exports = class CategoryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CategoryError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Cannot delete with subcategories':
      return {
        message: 'Cannot delete when there are subcategories remaining.',
        status: 422,
      };
    case 'No open queries':
      return {
        message: 'Category ID is required.',
        status: 403,
      };
    case 'Not found':
      return {
        message: 'Unable to find category.',
        status: 404,
      };
    case 'Parent category not found':
      return {
        message: 'Could not find parent category.',
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
