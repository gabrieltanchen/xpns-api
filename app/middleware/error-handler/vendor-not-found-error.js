module.exports = class VendorNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'VendorNotFoundError';
  }

  getApiResponse() {
    const message = this.message;
    switch (message) {
    default:
      return {
        message: 'Unable to find vendor.',
        status: 404,
      };
    }
  }
};
