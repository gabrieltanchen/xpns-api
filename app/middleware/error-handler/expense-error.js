module.exports = class ExpenseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ExpenseError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'No open queries':
      return {
        message: 'Category or vendor ID is required.',
        status: 403,
      };
    case 'Not found':
      return {
        message: 'Unable to find expense.',
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
