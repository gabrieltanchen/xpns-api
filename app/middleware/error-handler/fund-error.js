module.exports = class FundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FundError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    case 'No open deposit queries':
      return {
        message: 'Fund ID is required.',
        status: 403,
      };
    case 'Not found':
      return {
        message: 'Unable to find fund.',
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
