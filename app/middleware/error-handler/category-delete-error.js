module.exports = class CategoryDeleteError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CategoryDeleteError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Found subcategories':
      return {
        message: 'Cannot delete when there are subcategories remaining.',
        status: 422,
      };
    default:
      return {
        message: 'Unable to delete category.',
        status: 422,
      };
    }
  }
};
