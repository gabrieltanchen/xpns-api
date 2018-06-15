require('dotenv').load();
const nconf = require('nconf');

nconf.use('memory');
nconf.argv();
nconf.env();

switch (nconf.get('NODE_ENV')) {
case 'development':
  nconf.set('DATABASE_URL', 'postgres://finance:finance@localhost/finance_development');
  nconf.set('jwtPrivateKey', 'wD9!$PKRwjd4TG6hB@MYmx5FgVLMRGmCs$p=cupWxb3%^R86hC@7W8j=97JkzYMK');
  break;
case 'test':
  nconf.set('DATABASE_URL', 'postgres://finance:finance@localhost/finance_test');
  nconf.set('jwtPrivateKey', 'fu&-?4XFPQM^5H@NcZ-#_K6t5XaePQn4-F5?yahA^xX+ywUAzJG5qDpDL6U9PvLn');
  break;
default:
  break;
}
