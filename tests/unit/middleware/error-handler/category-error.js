const chai = require('chai');

const assert = chai.assert;

const { CategoryError } = require('../../../../app/middleware/error-handler');

describe('Unit:Middleware - ErrorHandler - CategoryError', function() {
  it('should return cannot delete with subcategories message', function() {
    const err = new CategoryError('Cannot delete with subcategories');
    assert.deepEqual(err.getApiResponse(), {
      message: 'Cannot delete when there are subcategories remaining.',
      status: 422,
    });
  });

  it('should return not found message', function() {
    const err = new CategoryError('Not found');
    assert.deepEqual(err.getApiResponse(), {
      message: 'Unable to find category.',
      status: 404,
    });
  });

  it('should return parent category not found message', function() {
    const err = new CategoryError('Parent category not found');
    assert.deepEqual(err.getApiResponse(), {
      message: 'Could not find parent category.',
      status: 404,
    });
  });

  it('should return 500 with unknown error', function() {
    const err = new CategoryError('Unknown error');
    assert.deepEqual(err.getApiResponse(), {
      message: 'An error occurred. Please try again later.',
      status: 500,
    });
  });
});
