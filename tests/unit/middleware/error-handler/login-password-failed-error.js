const chai = require('chai');

const assert = chai.assert;

const { LoginPasswordFailedError } = require('../../../../app/middleware/error-handler');

describe('Unit:Middleware - ErrorHandler - LoginPasswordFailedError', function() {
  it('should return invalid combination even for an unknown error', function() {
    const err = new LoginPasswordFailedError('Unknown error');
    assert.deepEqual(err.getApiResponse(), {
      message: 'Invalid email/password combination.',
      status: 403,
    });
  });
});
