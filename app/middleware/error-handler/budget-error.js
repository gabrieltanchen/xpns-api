module.exports = class BudgetError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BudgetError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Not found':
      return {
        message: 'Unable to find budget.',
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
