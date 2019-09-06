const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const nconf = require('nconf');
const Sequelize = require('sequelize');
const Umzug = require('umzug');

const Controllers = require('./controllers/');
const Middleware = require('./middleware/');
const Models = require('./models/');
const routes = require('./routes/');

class App {
  constructor({ logger }) {
    this.app = express();
    this.app.set('logger', logger);
    this.app.set('models', new Models(nconf.get('DATABASE_URL')));
    this.app.set('controllers', new Controllers(this.app.get('models')));
    this.app.set('Auditor', new Middleware.Auditor(this.app.get('models')));
    const Authentication = Middleware.Authentication(logger);
    this.app.set('Authentication', Authentication);
    this.app.set('Validator', Middleware.Validator);

    this.app.use(bodyParser.urlencoded({
      extended: true,
    }));
    this.app.use(bodyParser.json({
      type: 'application/vnd.api+json',
    }));
    this.app.use(cookieParser());

    this.app.use((req, res, next) => {
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

    this.app.use(Authentication.checkBearerAuth);

    routes(this.app);

    this.app.use(Middleware.ErrorHandler.middleware);

    this.app.use((err, req, res, next) => {
      if (err) {
        logger.error('500 ERROR: Unhandled error', err);
        return res.status(500).json({
          errors: [{
            detail: 'Something went wrong. Please try again later.',
          }],
        });
      }
      return next();
    });

    this.app.use((req, res) => {
      return res.sendStatus(501);
    });
  }

  async startServer() {
    const app = this.app;
    const logger = app.get('logger');
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
  }
}

module.exports = App;
