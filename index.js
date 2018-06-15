require('./config/');
const App = require('./app/');
const logger = require('winston');
const nconf = require('nconf');

const app = App.createApp();
const port = process.env.PORT || nconf.get('NODE_PORT');
app.listen(port, () => {
  logger.info(`listening on port ${port}`);
});
