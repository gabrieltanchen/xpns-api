const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');

module.exports = {
  createApp() {
    const app = express();
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

    app.use((req, res) => {
      return res.sendStatus(501);
    });

    return app;
  },
};
