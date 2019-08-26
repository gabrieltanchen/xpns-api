const { validationResult } = require('express-validator');
const _ = require('lodash');

module.exports = {
  validateRequest() {
    return (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: _.map(errors.array(), (error) => {
            return {
              source: {
                pointer: `/${error.param.replace(/\./g, '/')}`,
              },
              detail: error.msg,
            };
          }),
        });
      }
      return next();
    };
  },
};
