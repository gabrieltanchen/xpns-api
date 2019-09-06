const chai = require('chai');

const assert = chai.assert;

const { AuditError } = require('../../../../app/middleware/error-handler/');

describe('Unit:Middleware - ErrorHandler - AuditError', function() {
  it('should return 500 with unknown error', function() {
    const err = new AuditError('Unknown error');
    assert.deepEqual(err.getApiResponse(), {
      message: 'An error occurred. Please try again later.',
      status: 500,
    });
  });
});
