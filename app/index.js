const bodyParser = require('body-parser');
const Controllers = require('./controllers/');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('winston');
const Middleware = require('./middleware/');
const Models = require('./models/');
const nconf = require('nconf');
const routes = require('./routes/');
const Sequelize = require('sequelize');
const Umzug = require('umzug');

module.exports = {
  createApp() {
    const app = express();

    const Authentication = Middleware.Authentication();
    app.set('models', new Models(nconf.get('DATABASE_URL')));
    app.set('controllers', new Controllers(app.get('models')));
    app.set('Auditor', new Middleware.Auditor(app.get('models')));
    app.set('Authentication', Authentication);
    app.set('Validator', Middleware.Validator);

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
      }
      if (req.method === 'GET') {
        res.setHeader('Last-Modified', (new Date()).toUTCString());
      }
      return next();
    });

    app.use(Authentication.checkBearerAuth);

    routes(app);

    app.use((err, req, res, next) => {
      if (err) {
        return res.status(403).json({
          errors: [{
            detail: err.message,
          }],
        });
      }
      return next();
    });

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
