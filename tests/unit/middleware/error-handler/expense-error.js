const chai = require('chai');

const assert = chai.assert;

const { ExpenseError } = require('../../../../app/middleware/error-handler/');

describe('Unit:Middleware - ErrorHandler - ExpenseError', function() {
  it('should return no open queries message', function() {
    const err = new ExpenseError('No open queries');
    assert.deepEqual(err.getApiResponse(), {
      message: 'Category or vendor ID is required.',
      status: 403,
    });
  });

  it('should return not found message', function() {
    const err = new ExpenseError('Not found');
    assert.deepEqual(err.getApiResponse(), {
      message: 'Unable to find expense.',
      status: 404,
    });
  });

  it('should return 500 with unknown error', function() {
    const err = new ExpenseError('Unknown error');
    assert.deepEqual(err.getApiResponse(), {
      message: 'An error occurred. Please try again later.',
      status: 500,
    });
  });
});
