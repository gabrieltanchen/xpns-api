const bodyParser = require('body-parser');
const Controllers = require('./controllers/');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('winston');
const Models = require('./models/');
const nconf = require('nconf');
const routes = require('./routes/');
const Sequelize = require('sequelize');
const Umzug = require('umzug');

module.exports = {
  createApp() {
    const app = express();
    app.set('models', new Models(nconf.get('DATABASE_URL')));
    app.set('controllers', new Controllers(app.get('models')));

    app.use(bodyParser.urlencoded({
      extended: true,
    }));
    app.use(bodyParser.json({
      type: 'application/vnd.api+json',
    }));
    app.use(cookieParser());

    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Accept-Version');
      res.header('Access-Control-Allow-Credentials', 'true');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      } else if (req.method === 'GET') {
        res.setHeader('Last-Modified', (new Date()).toUTCString());
      }
      return next();
    });

    routes(app);

    app.use((req, res) => {
      return res.sendStatus(501);
    });

    return app;
  },

  async startServer(app) {
    const models = app.get('models');

    const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: models.sequelize,
      },
      migrations: {
        params: [models.sequelize.getQueryInterface(), Sequelize],
      },
    });
    await umzug.up();

    const port = process.env.PORT || nconf.get('NODE_PORT');
    return app.listen(port, () => {
      logger.info(`[API] Listening on port ${port}`);
    });
  },
};
