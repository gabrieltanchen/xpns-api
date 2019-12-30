require('dotenv').config();
const nconf = require('nconf');

nconf.use('memory');
nconf.argv();
nconf.env();

/* istanbul ignore next */
switch (nconf.get('NODE_ENV')) {
case 'development':
  nconf.set('DATABASE_URL', 'postgres://finance:finance@localhost/finance_development');
  nconf.set('jwtPrivateKey', 'wD9!$PKRwjd4TG6hB@MYmx5FgVLMRGmCs$p=cupWxb3%^R86hC@7W8j=97JkzYMK');
  break;
case 'test':
  nconf.set('DATABASE_URL', 'postgres://finance:finance@localhost/finance_test');
  nconf.set('jwtPrivateKey', 'fu&-?4XFPQM^5H@NcZ-#_K6t5XaePQn4-F5?yahA^xX+ywUAzJG5qDpDL6U9PvLn');
  break;
case 'production':
  if (!nconf.get('DATABASE_URL')) {
    nconf.set('DATABASE_URL', 'postgres://finance:finance@localhost/finance_production');
  }
  if (!nconf.get('jwtPrivateKey')) {
    nconf.set('jwtPrivateKey', 'bgTzhX$wdFzg-4%rT!k$tLU-N=*4rz#JfkLgAYtSd$t3JGqd2*CeYVur3g?GmE+e');
  }
  nconf.set('NODE_PORT', '8081');
  break;
default:
  break;
}
