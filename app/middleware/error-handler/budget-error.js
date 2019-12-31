module.exports = class BudgetError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BudgetError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'Duplicate budget':
      return {
        message: 'A budget already exists for that month.',
        status: 403,
      };
    case 'Invalid month':
      return {
        message: 'Invalid month provided.',
        status: 403,
      };
    case 'Invalid year':
      return {
        message: 'Invalid year provided.',
        status: 403,
      };
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
