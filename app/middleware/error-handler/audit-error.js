module.exports = class AuditError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuditError';
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
