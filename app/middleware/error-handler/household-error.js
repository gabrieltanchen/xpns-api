module.exports = class HouseholdError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HouseholdError';
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
