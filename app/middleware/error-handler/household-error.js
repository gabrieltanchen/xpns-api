module.exports = class HouseholdError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HouseholdError';
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
        message: 'Unable to find member.',
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
