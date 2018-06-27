const ApiCall = require('./api-call');
const Change = require('./change');
const Log = require('./log');

module.exports = (sequelize) => {
  return {
    ApiCall: ApiCall(sequelize),
    Change: Change(sequelize),
    Log: Log(sequelize),
  };
};
