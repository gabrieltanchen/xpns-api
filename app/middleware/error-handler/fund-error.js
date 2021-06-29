module.exports = class FundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FundError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    default:
      return {
        message: 'An error occurred. Please try again later.',
        status: 500,
      };
    }
  }
};
