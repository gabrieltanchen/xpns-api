require('./config/');
const App = require('./app/');

const app = App.createApp();
App.startServer(app);
